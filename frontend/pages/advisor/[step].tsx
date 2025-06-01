import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

import { questions, Question, Option } from "@/lib/advisorFlow";
import { useRiskStore } from "@/contexts/useRiskStore";
import AdvisorDots from "@/components/advisor/AdvisorDots";
import QuestionContainer from "@/components/advisor/QuestionContainer";
import BotBubble from "@/components/advisor/BotBubble";
import UserBubble from "@/components/advisor/UserBubble";
import { ChatLayout } from "@/components/advisor/ChatLayout";
import { withAuth } from "@/helpers/withAuth";
import { withUserSSR } from "@/lib/withUserSSR";
import CustomContainer from "@/components/reusable/CustomContainer";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";

type Msg = { role: "user" | "bot"; text: string };

const QuestionPage: NextPage = () => {
  const router = useRouter();
  const { step } = router.query as { step?: string };

  const q: Question | undefined = useMemo(
    () => questions.find((x) => x.id === step),
    [step],
  );
  if (!q) return null;

  const curIdx = questions.findIndex((x) => x.id === q.id);
  const total = questions.length;

  const { answers, setAnswer } = useRiskStore();
  const alreadyAnswered = q.id in answers;

  const [editing, setEditing] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: q.intro },
  ]);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "bot", text: q.intro }]);
    setCustomMode(false);
    setCustomInput("");
    setEditing(false);
  }, [q.id, q.intro]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMsg = (m: Msg) => setMessages((prev) => [...prev, m]);

  const recordAnswer = async (option: Option) => {
    addMsg({ role: "user", text: option.label });

    try {
      const r = await fetch("/api/advisor/answer", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: q.id, text: option.id }),
      });

      const json = await r.json();

      addMsg({ role: "bot", text: json.botReply ?? "Got it, thanks." });
      setAnswer(q.id, option.id);
      setEditing(false);
    } catch (e) {
      console.error("[FE] error", e);
      addMsg({ role: "bot", text: "Sorry, something went wrong." });
    }
  };

  const saveCustom = useCallback(async () => {
    const text = customInput.trim();
    if (!text) return;

    addMsg({ role: "user", text });
    setCustomInput("");

    try {
      const r = await fetch("/api/advisor/answer", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: q.id, text }),
      });

      const json = (await r.json()) as {
        optionId: string;
        needsClarification: boolean;
        followUp?: string;
        botReply?: string;
      };

      if (json.needsClarification) {
        addMsg({
          role: "bot",
          text: json.followUp || "Could you be more specific?",
        });
        return;
      }

      addMsg({ role: "bot", text: json.botReply ?? "Got it, thanks." });
      const stored = q.options.some((o) => o.id === json.optionId)
        ? json.optionId
        : text;
      setAnswer(q.id, stored);
      setCustomMode(false);
      setEditing(false);
    } catch {
      addMsg({ role: "bot", text: "Sorry, something went wrong." });
    }
  }, [customInput, q.id, q.options, setAnswer]);

  const nextStep = () => {
    if (curIdx === total - 1) router.push("/advisor/summary");
    else router.push(`/advisor/${questions[curIdx + 1].id}`);
  };

  return (
    <ChatLayout>
      <CustomContainer as="section" px={"2xl"}>
        <Box w={"100%"}>
          <Box w="100%" mb="l">
            <AdvisorDots total={total} idx={curIdx} />
            <Text
              fontWeight="900"
              fontSize="step1"
              mt="xl"
              color="grayCliff.solid.100"
            >
              {q.intro}
            </Text>
          </Box>

          {messages.map((m, i) =>
            m.role === "user" ? (
              <UserBubble key={i}>{m.text}</UserBubble>
            ) : (
              <BotBubble key={i}>{m.text}</BotBubble>
            ),
          )}
        </Box>

        <Box w={"100%"} mt={"xl"}>
          {(!alreadyAnswered || editing) && (
            <QuestionContainer
              options={q.options}
              customMode={customMode}
              inputValue={customInput}
              onInputChange={setCustomInput}
              onPick={recordAnswer}
              onCustom={() => setCustomMode(true)}
              onSave={saveCustom}
              onCancel={() => {
                setCustomMode(false);
                setCustomInput("");
                if (alreadyAnswered) setEditing(false);
              }}
            />
          )}

          {alreadyAnswered && !editing && (
            <VStack w="100%" mt="6" gap="s">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => setEditing(true)}
              >
                Change answer
              </Button>

              <Button {...emailLoginBtnStyles} onClick={nextStep}>
                {q.ctaLabel ?? "Next question"}
              </Button>
            </VStack>
          )}

          <div ref={bottomRef} />
        </Box>
      </CustomContainer>
    </ChatLayout>
  );
};

export const getServerSideProps = withUserSSR();
export default withAuth(QuestionPage);
