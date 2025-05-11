import { Box, HStack, VStack } from "@chakra-ui/react";
import SelectableGoal from "./selectable-goal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { goalsData } from "@/data/placeholder-data";
import { useRouter } from "next/router";

const GoalsContainer = () => {
  // Hook
  const router = useRouter();

  //   Button ONclick Func
  function btnClicked() {
    router.push("/onboarding/question/custom-answer");
  }

  return (
    <Box w={"100%"} p={"l"} bg={"grayCliff.solid.950"} rounded={"l3"}>
      {/* Radio Boxes */}
      <VStack alignItems={"start"} gap={"s"} w={"100%"}>
        {goalsData?.map((item) => (
          <SelectableGoal label={item.label} value={item.value} />
        ))}
      </VStack>

      {/* Custom Answer Input */}
      <HStack w={"100%"} gap={"4xs"} alignItems={"center"} mt={"s"}>
        {/* Icon */}
        <FontAwesomeIcon icon={faWandMagicSparkles} size="lg" color="#9C9888" />

        {/* Link */}
        <Box
          as={"button"}
          w={"100%"}
          bg={"transparent"}
          border={"2px solid"}
          borderColor={"grayCliff.solid.800"}
          rounded={"l2"}
          p={"2xs"}
          textAlign={"start"}
          color={"grayCliff.solid.400"}
          onClick={btnClicked}
        >
          Custom Answer
        </Box>
      </HStack>
    </Box>
  );
};

export default GoalsContainer;
