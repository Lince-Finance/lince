import { PropsWithChildren } from 'react';
import Bubble from './Bubble';

export default function UserBubble({ children }: PropsWithChildren) {
  return <Bubble side="right">{children}</Bubble>;
}
