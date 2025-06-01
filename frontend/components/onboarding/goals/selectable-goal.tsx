import { Box, Circle, Text } from '@chakra-ui/react';

interface Props {
  value    : string;
  label    : string;
  onSelect?: (value: string) => void;
}

export default function SelectableGoal({ value, label, onSelect }: Props) {
  return (
    <Box
      as="button"
      w="100%"
      display="flex"
      alignItems="center"
      gap="s"
      p="2xs"
      _hover={{ bg: 'grayCliff.solid.900' }}
      onClick={() => onSelect?.(value)}
    >
      <Circle
        size="16px"
        border="2px solid"
        borderColor="grayCliff.solid.700"
        _groupHover={{ borderColor: 'grayCliff.solid.500' }}
      />
      <Text color="grayCliff.solid.400">{label}</Text>
    </Box>
  );
}
