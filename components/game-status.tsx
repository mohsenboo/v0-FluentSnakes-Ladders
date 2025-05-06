"use client"

import { Button } from "@/components/ui/button"

export default function GameStatus({ gameState, lastRoll, resetGame }) {
  // Determine the color for the turn indicator based on current player
  const turnIndicatorColor = gameState.currentTurn === "player" ? "text-fluent-spring-green" : "text-fluent-jonquil"

  // Determine if there's a bonus roll in progress
  const isBonusRoll = gameState.playerBonusRoll || gameState.botBonusRoll
  const bonusRollPlayer = gameState.playerBonusRoll ? "player" : "bot"
  const bonusRollColor = bonusRollPlayer === "player" ? "text-fluent-spring-green" : "text-fluent-jonquil"

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      {/* Position indicators */}
      <div className="bg-black bg-opacity-80 p-4 rounded-lg">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm text-white font-medium mb-1">Your Position</h3>
            <p className="text-xl font-bold text-fluent-spring-green">{gameState.playerPosition}</p>
          </div>
          <div>
            <h3 className="text-sm text-white font-medium mb-1">Bot Position</h3>
            <p className="text-xl font-bold text-fluent-jonquil">{gameState.botPosition}</p>
          </div>
        </div>
      </div>

      {/* Turn indicator or game over message */}
      {gameState.gameOver ? (
        <div className="bg-black bg-opacity-80 p-4 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2 gradient-text aurora-pulse-bg">
            Game Over! {gameState.winner === "player" ? "You Won! 🎉" : "Bot Won! 🤖"}
          </h2>
          <Button onClick={resetGame} className="mt-2 bg-gradient-to-r from-fluent-blue to-fluent-pink text-white">
            Play Again
          </Button>

          {gameState.winner === "player" && (
            <p className="mt-2 text-fluent-spring-green">You can mint your victory NFT below!</p>
          )}
        </div>
      ) : (
        <div className="bg-black bg-opacity-80 p-3 rounded-lg text-center">
          {isBonusRoll ? (
            <div>
              <p className={`text-lg font-medium ${bonusRollColor}`}>
                {bonusRollPlayer === "player" ? "BONUS ROLL! Roll again!" : "Bot gets a BONUS ROLL!"}
              </p>
              {gameState.consecutiveSixes > 1 && (
                <p className="text-sm text-fluent-jonquil mt-1">{gameState.consecutiveSixes} consecutive sixes!</p>
              )}
            </div>
          ) : (
            <p className={`text-lg font-medium ${turnIndicatorColor}`}>
              {gameState.currentTurn === "player" ? "Your turn - Roll the dice!" : "Bot's turn - Please wait..."}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
