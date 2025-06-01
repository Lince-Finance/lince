import { PropsWithChildren } from 'react';
import Bubble from './Bubble';

export default function BotBubble({ children }: PropsWithChildren) {
  return <Bubble side="left">{children}</Bubble>;
}
