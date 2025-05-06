"use client"

import { Button } from "@/components/ui/button"
import { Trophy, Frown } from "lucide-react"

export default function GameOverModal({ isOpen, winner, onReplay, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="fluent-gradient-border w-full max-w-md animate-fadeIn">
        <div className="bg-fluent-dark-grey p-6 rounded-lg">
          <div className="flex justify-center mb-4">
            {winner === "player" ? (
              <Trophy className="h-16 w-16 text-fluent-jonquil" />
            ) : (
              <Frown className="h-16 w-16 text-fluent-pink" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-4">
            {winner === "player" ? "Congratulations! You Won!" : "Game Over! Bot Won!"}
          </h2>

          <p className="text-center text-gray-300 mb-6">
            {winner === "player"
              ? "You've successfully reached the end of the board! Would you like to play again?"
              : "Better luck next time! Would you like to try again?"}
          </p>

          <div className="flex gap-4">
            <Button onClick={onReplay} className="w-full fluent-button">
              Play Again
            </Button>
            <Button onClick={onClose} className="w-full bg-fluent-dark-grey text-white border border-gray-700">
              Close
            </Button>
          </div>

          {winner === "player" && (
            <p className="mt-4 text-sm text-fluent-spring-green text-center">
              Don't forget to mint your victory NFT below!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
