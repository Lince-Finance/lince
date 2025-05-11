import { RadioGroup } from "@chakra-ui/react";

const SelectableGoal = ({ value, label }: { value: string; label: string }) => {
  return (
    <RadioGroup.Root size={"lg"}>
      <RadioGroup.Item key={value} value={value} className="goals-radio">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator className="radio-indicator" />
        <RadioGroup.ItemText color={"grayCliff.solid.400"}>
          {label}
        </RadioGroup.ItemText>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

export default SelectableGoal;
