"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"

const PLAYER_COLORS = [
  { name: "Green", value: "#32FE6B", textColor: "text-black" },
  { name: "Blue", value: "#3700FF", textColor: "text-white" },
  { name: "Pink", value: "#FF8FDA", textColor: "text-black" },
  { name: "Yellow", value: "#FECD07", textColor: "text-black" },
  { name: "Cyan", value: "#49EDED", textColor: "text-black" },
]

export default function PlayerSetup({ onComplete }) {
  const [playerName, setPlayerName] = useState("")
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].value)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!playerName.trim()) {
      setError("Please enter a name")
      return
    }

    onComplete({
      name: `${playerName.trim()}.fluent`,
      color: selectedColor,
    })
  }

  return (
    <div className="player-setup-card w-full max-w-md">
      <div className="player-setup-header"></div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Choose a name</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value)
                  setError("")
                }}
                className="bg-black bg-opacity-50 border-0 text-white placeholder-gray-500"
                placeholder="Enter your name"
                maxLength={15}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">.fluent</div>
            </div>
            {error && <p className="text-fluent-pink text-sm mt-1">{error}</p>}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Choose your color</h2>
            <div className="flex justify-between gap-2">
              {PLAYER_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`color-option ${selectedColor === color.value ? "selected" : ""}`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && <Check className={`h-5 w-5 ${color.textColor}`} />}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 rounded-md font-semibold bg-gradient-to-r from-fluent-pink to-fluent-blue text-white"
          >
            Start Playing
          </Button>
        </form>
      </div>
    </div>
  )
}
