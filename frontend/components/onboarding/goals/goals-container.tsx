import { Box, HStack, VStack } from '@chakra-ui/react';
import { FontAwesomeIcon }     from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { useRouter }           from 'next/router';
import SelectableGoal          from './selectable-goal';
import type { Option }         from '@/lib/advisorFlow';

interface Props {
  options : Option[];
  onPick  : (o: Option) => void;
}

export default function GoalsContainer({ options, onPick }: Props) {
  const router = useRouter();

  return (
    <Box w="100%" p="l" bg="grayCliff.solid.950" rounded="l3">
      <VStack alignItems="start" gap="s" w="100%">
        {options.map(o => (
          <SelectableGoal
            key={o.id}
            label={o.label}
            value={o.id}
            onSelect={() => onPick(o)}
          />
        ))}
      </VStack>

      <HStack w="100%" gap="4xs" alignItems="center" mt="s">
        <FontAwesomeIcon icon={faWandMagicSparkles} size="lg" color="#9C9888" />
        <Box
          as="button"
          w="100%"
          bg="transparent"
          border="2px solid"
          borderColor="grayCliff.solid.800"
          rounded="l2"
          p="2xs"
          textAlign="start"
          color="grayCliff.solid.400"
          onClick={() => router.push('/advisor/GOAL?custom=1')}
        >
          Custom Answer
        </Box>
      </HStack>
    </Box>
  );
}
