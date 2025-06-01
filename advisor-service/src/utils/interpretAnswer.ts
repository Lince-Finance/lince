import { openai }       from '../config/openaiConfig'
import { questions }    from './riskFlow'
import { StepId }       from '../types/risk'
import type {
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions'

export interface Classified {
  optionId: string
  needsClarification: boolean
  followUp?: string
  botReply?: string
}

const SIM_THRESHOLD = 0.35

const tokenize = (s: string) =>
  new Set(
    s.toLowerCase()
     .replace(/[^\p{L}\d ]+/gu, ' ')
     .split(/\s+/)
     .filter(Boolean),
  )

const jaccard = (a: string, b: string): number => {
  const A = tokenize(a)
  const B = tokenize(b)
  const inter = [...A].filter(w => B.has(w)).length
  const union = new Set([...A, ...B]).size || 1
  return inter / union
}

const SYSTEM = `
You are **Lince’s onboarding answer classifier**.

====== TASK ======
For the current STEP you receive:
• STEP id
• List of OPTIONS (id + label)
• USER_ANSWER (free text)

Return *one JSON object* and nothing else:

{
  "optionId": "<OPTION id | unknown>",
  "needsClarification": <true|false>,
  "followUp": "<if needsClarification=true, ≤15 words, same language>",
  "botReply": "<if needsClarification=false, 3–8 words, same language>"
}

====== RULES ======
1. Match answer case-insensitively; ignore punctuation, “%”, “years”, etc.
2. If the answer maps clearly to exactly one OPTION → needsClarification=false.
3. Otherwise → optionId="unknown", needsClarification=true.
4. *Language*: reply in the language of USER_ANSWER.
5. *botReply* must be 3-8 words (e.g. “Perfect, noted and thanks.”).
6. Never output markdown, code-blocks or extra keys.

====== EXAMPLES ======
USER: "Grow my money fast"      (STEP=GOAL)
ASSISTANT: {"optionId":"grow-max","needsClarification":false,"botReply":"Great, aiming for maximum growth."}

USER: "two-three years"         (STEP=TIME)
ASSISTANT: {"optionId":"1-3y","needsClarification":false,"botReply":"Okay, about two years noted."}

USER: "No quiero volatilidad"   (STEP=EXPOSURE)
ASSISTANT: {"optionId":"no-vol","needsClarification":false,"botReply":"Sin volatilidad, entendido."}

USER: "asdfasdf"                (any STEP)
ASSISTANT: {"optionId":"unknown","needsClarification":true,"followUp":"¿Podrías aclararlo un poco más?"}
`.trim()

const ACKS_EN = [
  'Perfect, noted and thanks.',
  'Great, I have that saved.',
  'Understood, appreciate the detail.',
  'All right, recorded for you.',
]

const ACKS_ES = [
  'Entendido, lo apunto enseguida.',
  'Anotado, muchas gracias.',
  'Comprendido, seguimos adelante.',
  'Sin problema, registrado.',
]

const randAck = (lang: 'en' | 'es' = 'en') => {
  const pool = lang === 'es' ? ACKS_ES : ACKS_EN
  return pool[Math.floor(Math.random() * pool.length)]
}

const FEW_SHOT_RAW: { user: string; id: string; ack: string }[] = [
  { user: 'Solo quiero proteger mi dinero', id: 'protect',    ack: 'Entendido, proteger el capital.' },
  { user: 'Grow but stay safe',             id: 'grow-protect',ack: 'Growth with safety, got it.' },
  { user: 'Max growth please',              id: 'grow-max',    ack: 'Going for max growth, noted.' },
  { user: 'Menos de un año',                id: 'lt-1y',       ack: 'Menos de un año, entendido.' },
  { user: 'Around 2 years',                 id: '1-3y',        ack: 'Two years, recorded.' },
  { user: '3-7 years',                      id: '3-7y',        ack: 'Between three and seven years.' },
  { user: 'over seven years',               id: 'gt-7y',       ack: 'Over seven years, perfect.' },
  { user: 'Never invested in crypto',       id: 'never',       ack: 'No crypto experience, noted.' },
  { user: 'Empecé hace poco',               id: 'recent',      ack: 'Inversiones recientes, entendido.' },
  { user: 'One to three years of trading',  id: '1-3y',        ack: '1-3 years experience, got it.' },
  { user: 'More than 3y experience',        id: 'gt-3y',       ack: 'Over three years, understood.' },
  { user: 'Less than 10 percent',           id: 'lt-10',       ack: 'Below ten percent allocation.' },
  { user: 'Maybe 20 %',                     id: '10-25',       ack: 'Roughly twenty percent noted.' },
  { user: 'About half of my assets',        id: '25-50',       ack: 'Around fifty percent, okay.' },
  { user: 'I would go all-in',              id: 'gt-50',       ack: 'All-in allocation, registered.' },
  { user: 'Sin volatilidad, por favor',     id: 'no-vol',      ack: 'Sin volatilidad, anotado.' },
  { user: 'Low volatility is fine',         id: 'low-vol',     ack: 'Low volatility preference saved.' },
  { user: 'I accept volatility',            id: 'accept',      ack: 'Volatility accepted, thank you.' },
  { user: '4 % APY sounds good',            id: 'lt-5',        ack: 'Aiming for four percent.' },
  { user: 'Between five and eight',         id: '5-8',         ack: '5-8 % target, understood.' },
  { user: 'unos 10 por ciento',             id: '8-12',        ack: 'Diez por ciento, registrado.' },
  { user: 'Over 12 %',                      id: 'gt-12',       ack: 'Above twelve percent, great.' },
  { user: 'I like pizza', id: 'unknown', ack: '' },
  { user: '',             id: 'unknown', ack: '' },
]

export async function interpretAnswer(
  step: StepId,
  text: string,
): Promise<Classified> {

  const q      = questions.find(x => x.id === step)!
  const answer = text.trim()

  const isSpanish =
  /[áéíóúñ¿¡]/i.test(answer) ||
  /\b(?:el|la|los|las|un|una|que|por|para|pero|sin|más)\b/i.test(answer)

  const lang: 'en' | 'es' = isSpanish ? 'es' : 'en'

  if (q.options.some(o => o.id === answer)) {
    return { optionId: answer, needsClarification: false, botReply: randAck(lang) }
  }

  let best: { id: string; score: number } = { id: 'unknown', score: 0 }
  for (const opt of q.options) {
    const score = jaccard(opt.label, answer)
    if (score > best.score) best = { id: opt.id, score }
  }
  if (best.score >= SIM_THRESHOLD) {
    return { optionId: best.id, needsClarification: false, botReply: randAck(lang) }
  }

  const fewShot = FEW_SHOT_RAW
    .filter(e => e.id === 'unknown' || q.options.some(o => o.id === e.id))
    .flatMap<ChatCompletionMessageParam>(e => [
      { role: 'user', content: e.user },
      {
        role   : 'assistant',
        content: JSON.stringify({
          optionId          : e.id,
          needsClarification: e.id === 'unknown',
          followUp          : undefined,
          botReply          : e.id === 'unknown' ? undefined : e.ack,
        }),
      },
    ])

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM },
    ...fewShot,
    {
      role   : 'user',
      content: [
        `STEP = ${step}`,
        '',
        'OPTIONS',
        q.options.map(o => `${o.id}: "${o.label}"`).join('\n'),
        '',
        `USER_ANSWER = """${answer}"""`,
        'Respond with JSON:',
      ].join('\n'),
    },
  ]

  try {
    const ai   = await openai()
    const resp = await ai.chat.completions.create({
      model      : process.env.ADVISOR_CLASSIFIER_MODEL ?? 'gpt-4o',
      temperature: 0.3,
      messages,
    })

    const parsed = JSON.parse(resp.choices[0].message.content || '{}') as Classified

    if (!q.options.some(o => o.id === parsed.optionId) && parsed.optionId !== 'unknown')
      parsed.optionId = 'unknown'

    if (parsed.needsClarification && !parsed.followUp) {
      parsed.followUp = lang === 'es'
        ? '¿Podrías aclararlo un poco más?'
        : 'Could you clarify a bit?'
    }

    if (!parsed.needsClarification && !parsed.botReply) {
      parsed.botReply = randAck(lang)
    }

    return parsed
  } catch (err) {
    console.error('[interpretAnswer] OpenAI error', err)
    return {
      optionId          : 'unknown',
      needsClarification: true,
      followUp          : lang === 'es'
        ? '¿Podrías aclararlo un poco más?'
        : 'Could you clarify a bit?',
    }
  }
}