import { Box, HStack, Text } from "@chakra-ui/react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  label: string;
}
export default function ProgressChecklist({ label }: Props) {
  return (
    <HStack
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      cursor="pointer"
      minH={"min-content"}
      p="xl"
      bg="grayCliff.solid.950"
      border={"1px solid"}
      borderColor={"grayCliff.solid.800"}
      rounded="l3"
      overflow="hidden"
    >
      <HStack alignItems="center" gap="xs">
        <Text color="grayCliff.solid.100" fontSize="15px">
          {label}
        </Text>
      </HStack>

      <Box w={"4"}>
        <FontAwesomeIcon icon={faCheck} color="#888471" />
      </Box>
    </HStack>
  );
}
