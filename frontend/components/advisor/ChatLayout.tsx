import { PropsWithChildren } from 'react';

export const ChatLayout = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col h-screen bg-black px-4 py-6 text-white">
    {children}
  </div>
);
