import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import OnboardingDots from '../reusable/onboarding-dots'
import GoalsContainer from './goals-container'
import { questions, Option } from '@/lib/advisorFlow'

export default function GoalsContent() {
  const router = useRouter()
  const goalQuestion = questions.find(q => q.id === 'GOAL')!

  const handlePick = (option: Option) => {
    router.push(`/advisor/GOAL?answer=${option.id}`)
  }

  return (
    <>
      <Box w="100%">
        <OnboardingDots activeIdx={1} />
        <Text fontWeight="900" color="grayCliff.solid.100" fontSize="step1" mt="xl">
          What's your top goal using Lince?
        </Text>
      </Box>
      <GoalsContainer options={goalQuestion.options} onPick={handlePick} />
    </>
  )
}
