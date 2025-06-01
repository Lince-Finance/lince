import { useRouter } from "next/router";
import { useMemo, useEffect } from "react";
import { useRiskStore } from "@/contexts/useRiskStore";
import { useAdvisorStore } from "@/contexts/useAdvisorStore";
import PrimaryButton from "@/components/advisor/PrimaryButton";
import { withUserSSR } from "@/lib/withUserSSR";
import { withAuth } from "@/helpers/withAuth";
import {
  Box,
  Text,
  VStack,
  Heading,
  useToken,
  Grid,
  Button,
} from "@chakra-ui/react";
import { emailLoginBtnStyles, loginBtnStyles } from "@/styles/reusable-styles";

interface ApiResult {
  risk: number;
  mix: Record<string, number>;
  projectedApy: number;
}
type ResultPayload =
  | (ApiResult & { retryRequired?: false })
  | { retryRequired: true };

function ResultPage() {
  const router = useRouter();
  const reset = useRiskStore((s) => s.reset);
  const setRiskProfile = useAdvisorStore((s) => s.setRiskProfile);

  // Get theme colors via Chakra's useToken hook
  const [gold, border, bg, text] = useToken("colors", [
    "goldFang.solid.600",
    "grayCliff.solid.800",
    "black",
    "white",
  ]);

  const data: ResultPayload | null = useMemo(() => {
    const encoded = router.query.data as string | undefined;
    if (!encoded) return null;
    try {
      return JSON.parse(decodeURIComponent(encoded));
    } catch {
      return null;
    }
  }, [router.query.data]);

  useEffect(() => {
    if (data && !("retryRequired" in data)) {
      const { risk } = data as ApiResult;
      
      // Determine risk profile based on score
      let profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
      if (risk <= 3) {
        profile = 'CONSERVATIVE';
      } else if (risk <= 6) {
        profile = 'MODERATE';
      } else {
        profile = 'AGGRESSIVE';
      }

      setRiskProfile(risk, profile);
    }
  }, [data, setRiskProfile]);

  if (!data) return null;

  if ("retryRequired" in data && data.retryRequired) {
    reset();
    return (
      <Box
        minH="100dvh"
        bg={bg}
        color={text}
        p={6}
        display="flex"
        flexDir="column"
      >
        <Heading as="h2" size="lg" mb={4}>
          We need a bit more detail
        </Heading>
        <Text fontSize="md" color="grayCliff.solid.300" mb={6} maxW="sm">
          Some of your answers were hard to interpret. Please retake the short
          questionnaire so we can give you an accurate investment plan.
        </Text>
        <PrimaryButton
          label="Start again →"
          onClick={() => router.replace("/advisor")}
        />
      </Box>
    );
  }

  const { risk, mix, projectedApy } = data as ApiResult;

  return (
    <Box
      minH="100dvh"
      bg={bg}
      color={text}
      p={6}
      display="flex"
      flexDir="column"
    >
      <Heading as="h2" size="lg" mb={4}>
        Recommended Investments
      </Heading>
      <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mb={8}>
        {Object.entries(mix).map(([token, pct]) => (
          <Box
            key={token}
            border="2px solid"
            borderColor={border}
            rounded="lg"
            p={4}
            bg="grayCliff.solid.950"
            display="flex"
            flexDir={"column"}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="md" color="grayCliff.solid.400" fontWeight="medium">
              {token}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={"grayCliff.solid.50"}
              lineHeight="1"
            >
              {(pct * 100).toFixed()} %
            </Text>
          </Box>
        ))}

        <Box
          border="2px solid"
          borderColor={border}
          rounded="lg"
          p={4}
          bg="grayCliff.solid.950"
          display="flex"
          flexDir={"column"}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="md" color="grayCliff.solid.300" fontWeight="medium">
            Projected blended APY
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={gold} lineHeight="1">
            {(projectedApy * 100).toFixed(2)} %
          </Text>
        </Box>
        <Box
          border="2px solid"
          borderColor={border}
          rounded="lg"
          p={4}
          bg="grayCliff.solid.950"
          display="flex"
          flexDir={"column"}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="md" color="grayCliff.solid.300" fontWeight="medium">
            Risk profile score
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={gold} lineHeight="1">
            {risk.toFixed(2)}/10
          </Text>
        </Box>
      </Grid>

      <Button
        {...emailLoginBtnStyles}
        onClick={() => {
          reset();
          router.replace("/advisor");
        }}
      >
        Start over
      </Button>

      <Button
        {...loginBtnStyles}
        mt={4}
        onClick={() => {
          router.push("/user/dashboard");
        }}
      >
        Go To Dashboard
      </Button>
    </Box>
  );
}

export const getServerSideProps = withUserSSR();
export default withAuth(ResultPage);
