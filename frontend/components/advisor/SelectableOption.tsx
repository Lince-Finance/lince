import * as RadioGroup from "@radix-ui/react-radio-group";
import { Text } from "@chakra-ui/react";

interface Props {
  value: string;
  label: string;
}

export default function SelectableOption({ value, label }: Props) {
  return (
    <RadioGroup.Item value={value} className="goals-radio">
      <RadioGroup.Indicator className="radio-indicator" />
      <Text as="span" textAlign={"start"} color="grayCliff.solid.400">
        {label}
      </Text>
    </RadioGroup.Item>
  );
}
