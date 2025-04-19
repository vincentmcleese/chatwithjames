"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Fish, Cat } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreatMeterProps {
  onHappinessChange: (happiness: number) => void;
  onFeedVeggies?: () => void;
}

export default function TreatMeter({
  onHappinessChange,
  onFeedVeggies,
}: TreatMeterProps) {
  const [happiness, setHappiness] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  const [treatPos, setTreatPos] = useState({ x: 0, y: 0 });
  const [showTreat, setShowTreat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();

    // Check if browser supports FLAC
    const canPlayFlac = audio.canPlayType("audio/flac");
    if (canPlayFlac === "probably" || canPlayFlac === "maybe") {
      audioRef.current = new Audio("/berghain.flac");
      audioRef.current.volume = 0.5; // Set volume to 50%
    } else {
      setAudioError(
        "Your browser doesn't support FLAC format. Please use a modern browser."
      );
    }

    return () => {
      // Cleanup audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Automatically decrease happiness over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1));
    }, 5000); // Decrease by 1 every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Sync happiness state with parent component
  useEffect(() => {
    onHappinessChange(happiness);
  }, [happiness, onHappinessChange]);

  // Feed James treats!
  const feedTreats = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const buttonRect = e.currentTarget.getBoundingClientRect();

    setTreatPos({
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top,
    });

    setShowTreat(true);
    setIsAnimating(true);

    setHappiness((prev) => Math.min(100, prev + 10));

    if (onFeedVeggies) {
      onFeedVeggies();
    }

    setTimeout(() => {
      setShowTreat(false);
      setIsAnimating(false);
    }, 1000);
  };

  const handleBerghain = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const progressClasses = cn(
    "h-6 transition-all duration-300",
    happiness >= 80
      ? "[&>div>div]:bg-blue-500"
      : happiness >= 40
      ? "[&>div>div]:bg-yellow-500"
      : "[&>div>div]:bg-red-500"
  );

  const TreatIcon = happiness > 50 ? Fish : Cat;

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-xs">
      <h2 className="text-lg font-bold text-center">
        James&apos;s Treat Meter
      </h2>

      <div className="relative h-6">
        <Progress value={happiness} className={progressClasses} />
        {showTreat && (
          <div
            className={`absolute transition-all duration-1000 ${
              isAnimating ? "opacity-0 -translate-y-20" : "opacity-100"
            }`}
            style={{ left: `${treatPos.x}px`, top: `${treatPos.y}px` }}
          >
            <TreatIcon className="text-blue-500 h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">
          {happiness >= 80
            ? "Very Happy!"
            : happiness >= 40
            ? "Getting Hungry..."
            : "Feed me now!"}
        </span>
        <span className="font-mono">{happiness}%</span>
      </div>

      <Button
        type="button"
        onClick={feedTreats}
        className="bg-blue-500 hover:bg-blue-600 gap-2 transition-transform duration-200 active:scale-95"
      >
        <Fish className="h-4 w-4" />
        Feed Treats
      </Button>

      <Button
        type="button"
        onClick={handleBerghain}
        className="bg-black hover:bg-gray-900 gap-2 transition-transform duration-200 active:scale-95"
        disabled={!!audioError}
      >
        {isPlaying ? "Stop Techno" : "Go to Berghain"}
      </Button>

      {audioError && (
        <p className="text-red-500 text-sm text-center">{audioError}</p>
      )}
    </div>
  );
}
