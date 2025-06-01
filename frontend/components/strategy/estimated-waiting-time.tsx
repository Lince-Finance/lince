import { Box, Text } from '@chakra-ui/react';

export default function EstimatedWaitingTime() {
  return (
    <Box mt={'5'} mb={'3xs'}>
      <Text color={'grayCliff.solid.500'} textAlign={'center'}>
        Estimated Waiting Time
      </Text>

      <Text
        color={'grayCliff.solid.100'}
        fontWeight={'900'}
        fontSize={'step1'}
        textAlign={'center'}
      >
        7-24 Days
      </Text>
    </Box>
  );
}
