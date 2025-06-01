import { useRouter } from "next/router";
import { questions } from "@/lib/advisorFlow";
import { useRiskStore } from "@/contexts/useRiskStore";
import ProgressChecklist from "@/components/advisor/ProgressChecklist";
import PrimaryButton from "@/components/advisor/PrimaryButton";
import { withUserSSR } from "@/lib/withUserSSR";
import withAuth from "@/helpers/withAuth";
import ContainerTopBox from "@/components/reusable/container-top-box";
import CustomContainer from "@/components/reusable/CustomContainer";
import { Box, Button, VStack } from "@chakra-ui/react";
import { emailLoginBtnStyles } from "@/styles/reusable-styles";

function SummaryPage() {
  const router = useRouter();
  const { answers } = useRiskStore();

  const missing = questions.filter((q) => !(q.id in answers)).map((q) => q.id);

  const confirm = () => {
    if (missing.length) {
      router.replace(`/advisor/${missing[0]}`);
    } else {
      router.push("/advisor/building");
    }
  };

  return (
    <CustomContainer p={"xl"}>
      {/* Top Part */}
      <Box w={"100%"}>
        <ContainerTopBox
          title="Well done"
          desc="We have enough to build your investment strategy. If you wish, you can change any of the answers."
          showIcon={false}
        />
      </Box>

      {/* Bottom Part */}
      <Box w={"100%"}>
        <VStack w={"100%"} gap={"1"} mb={4}>
          {questions.map((q) => (
            <ProgressChecklist key={q.id} label={q.summaryLabel} />
          ))}
        </VStack>

        <Button
          {...emailLoginBtnStyles}
          disabled={Boolean(missing.length)}
          onClick={confirm}
          loadingText="Building..."
        >
          {missing.length ? "Complete missing steps" : "Confirm Answers →"}
        </Button>
      </Box>
    </CustomContainer>
  );
}

export const getServerSideProps = withUserSSR();
export default withAuth(SummaryPage);
