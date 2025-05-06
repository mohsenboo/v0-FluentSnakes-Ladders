"use client"

import { useState, useEffect } from "react"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"

export default function DiceAnimation({ isRolling, value, isBonus = false }) {
  const [animationValue, setAnimationValue] = useState(value || 1)

  useEffect(() => {
    let interval

    if (isRolling) {
      // Start the animation
      interval = setInterval(() => {
        setAnimationValue(Math.floor(Math.random() * 6) + 1)
      }, 100)
    } else {
      // Stop the animation and set to final value
      setAnimationValue(value || 1)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRolling, value])

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

  // Add a special effect for value 6 (which grants bonus roll)
  const isSix = value === 6 && !isRolling
  const bonusClass = isSix ? "text-fluent-jonquil animate-pulse" : ""

  return (
    <div className={`text-white ${isRolling ? "animate-bounce" : ""} ${bonusClass}`}>
      {getDiceIcon(animationValue)}
      {isSix && <div className="text-xs text-fluent-jonquil font-bold mt-1 text-center">BONUS!</div>}
    </div>
  )
}
