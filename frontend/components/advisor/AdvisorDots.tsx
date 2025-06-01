import { Box, HStack } from '@chakra-ui/react';

interface Props {
  total: number;
  idx: number;
}

export default function AdvisorDots({ total, idx }: Props) {
  return (
    <HStack alignItems="center" gap="5xs">
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          w={idx === i ? '16px' : '6px'}
          h="6px"
          rounded="9999px"
          bg={idx === i ? 'grayCliff.solid.500' : 'grayCliff.solid.900'}
        />
      ))}
    </HStack>
  );
}
