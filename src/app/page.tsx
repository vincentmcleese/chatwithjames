"use client";

import { useState, useRef } from "react";
import Chat from "@/components/Chat";
import TreatMeter from "@/components/TreatMeter";
import { Cat } from "lucide-react";

export default function Home() {
  const [happiness, setHappiness] = useState(50);
  const chatRef = useRef<{
    addNimbusMessage: (message: string) => void;
  } | null>(null);

  const handleFeedTreats = () => {
    // Have James say "meow" when fed
    if (chatRef.current) {
      chatRef.current.addNimbusMessage("*meow meow meow* 🐟");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-gray-950 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center justify-center gap-2">
          <Cat className="h-8 w-8" />
          Chat with James!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Talk to James the cat - but make sure to keep him happy with treats!
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="h-[600px]">
          <Chat happiness={happiness} ref={chatRef} />
        </div>

        <div className="flex justify-center">
          <TreatMeter
            onHappinessChange={setHappiness}
            onFeedVeggies={handleFeedTreats}
          />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Cats need proper nutrition, fresh water, and lots of love for a happy
          life!
        </p>
      </footer>
    </div>
  );
}
