import { Center, Clipboard, Input, InputGroup } from '@chakra-ui/react';

const GetInFasterLinkClipboard = ({ value }: { value: string }) => {
  return (
    <Clipboard.Root w={'100%'} value={value}>
      <InputGroup endElement={<ClipboardIconButton />} w={'100%'}>
        <Clipboard.Input
          asChild
          w={'100%'}
          h={'12'}
          border={'2px solid'}
          borderColor={'grayCliff.solid.800'}
          rounded={'l2'}
          px={'2xs'}
          color="grayCliff.solid.100"
        >
          <Input />
        </Clipboard.Input>
      </InputGroup>
    </Clipboard.Root>
  );
};

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <Center
        as={'button'}
        bg={'grayCliff.solid.800'}
        w={'9'}
        h={'calc(100% - 8px)'}
        rounded={'4px'}
        color={'grayCliff.solid.100'}
        pos={'absolute'}
        right={'1'}
      >
        <Clipboard.Indicator />
      </Center>
    </Clipboard.Trigger>
  );
};

export default GetInFasterLinkClipboard;
