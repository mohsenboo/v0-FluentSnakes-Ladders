"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Loader2 } from "lucide-react"

export default function DiceRoller({ rollDice, lastRoll, isRolling, disabled, currentTurn, isCorrectNetwork }) {
  const [animationRoll, setAnimationRoll] = useState(1)

  // Animation for dice rolling
  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setAnimationRoll(Math.floor(Math.random() * 6) + 1)
      }, 100)

      return () => clearInterval(interval)
    } else {
      setAnimationRoll(lastRoll || 1)
    }
  }, [isRolling, lastRoll])

  const getDiceIcon = (value) => {
    switch (value) {
      case 1:
        return <Dice1 className="h-12 w-12" />
      case 2:
        return <Dice2 className="h-12 w-12" />
      case 3:
        return <Dice3 className="h-12 w-12" />
      case 4:
        return <Dice4 className="h-12 w-12" />
      case 5:
        return <Dice5 className="h-12 w-12" />
      case 6:
        return <Dice6 className="h-12 w-12" />
      default:
        return <Dice1 className="h-12 w-12" />
    }
  }

  return (
    <div className="fluent-card flex flex-col items-center gap-4 p-4">
      <div className="dice-container flex items-center justify-center p-4 w-20 h-20">
        <div className={`text-white ${isRolling ? "animate-pulse" : ""}`}>{getDiceIcon(animationRoll)}</div>
      </div>

      <Button onClick={rollDice} disabled={disabled || isRolling || !isCorrectNetwork} className="w-full fluent-button">
        {isRolling ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Confirming Transaction...
          </>
        ) : !isCorrectNetwork ? (
          "Wrong Network"
        ) : currentTurn === "player" ? (
          "Roll Dice"
        ) : (
          "Bot is thinking..."
        )}
      </Button>

      <p className="text-sm text-gray-400">
        {!isCorrectNetwork
          ? "Please switch to Fluent Developer Preview network"
          : disabled && !isRolling && currentTurn === "bot"
            ? "Bot is taking its turn"
            : "Each roll creates a blockchain transaction"}
      </p>
    </div>
  )
}
