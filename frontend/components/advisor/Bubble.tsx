import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface Props extends PropsWithChildren {
  side: 'left' | 'right';
}

export default function Bubble({ side, children }: Props) {
  return (
    <div
      className={clsx(
        'max-w-[80%] rounded-2xl py-3 px-4 text-sm',
        side === 'left'
          ? 'bg-neutral-800 self-start'
          : 'bg-neutral-700 self-end',
      )}
    >
      {children}
    </div>
  );
}
