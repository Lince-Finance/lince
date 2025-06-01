import { Box, HStack, VStack, Input, Button } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Option } from '@/lib/advisorFlow'
import SelectableOption from './SelectableOption'

interface Props {
  options: Option[]
  customMode: boolean
  inputValue: string
  onInputChange: (v: string) => void
  onPick: (o: Option) => void
  onCustom: () => void
  onSave: () => void
  onCancel: () => void
}

export default function QuestionContainer({
  options,
  customMode,
  inputValue,
  onInputChange,
  onPick,
  onCustom,
  onSave,
  onCancel,
}: Props) {
  return (
    <Box w="100%" p="l" bg="grayCliff.solid.950" rounded="l3">
      {/* lista de opciones → SIEMPRE visible */}
      <RadioGroup.Root
        className="w-full"
        onValueChange={val => {
          const opt = options.find(o => o.id === val)
          if (opt) onPick(opt)
        }}
      >
        <VStack alignItems="start" gap="s" w="100%">
          {options.map(o => (
            <SelectableOption key={o.id} value={o.id} label={o.label} />
          ))}
        </VStack>
      </RadioGroup.Root>

      {/* fila “custom answer” */}
      {!customMode && (
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
            onClick={onCustom}
          >
            Custom Answer
          </Box>
        </HStack>
      )}

      {/* input inline, SIN esconder los chips */}
      {customMode && (
        <VStack w="100%" gap="s" mt="s">
          <Input
            placeholder="Write your answer"
            bg="grayCliff.solid.900"
            borderColor="grayCliff.solid.700"
            color="white"
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
          />
          <HStack w="100%" gap="s">
            <Button
              flex="1"
              bg="grayCliff.solid.700"
              color="white"
              _hover={{ opacity: 0.9 }}
              rounded="md"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              bg="brand.500"
              color="black"
              _hover={{ opacity: 0.9 }}
              rounded="md"
              onClick={onSave}
              disabled={!inputValue.trim()}
            >
              Save
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  )
}
