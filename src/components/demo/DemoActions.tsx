'use client';

import PhoneKeypad from './PhoneKeypad';
import AIChat from './AIChat';

export default function DemoActions() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PhoneKeypad />
      <AIChat />
    </div>
  );
}
