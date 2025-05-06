"use client"

import { useEffect, useRef } from "react"

export default function GameBoard({ playerPosition, botPosition, playerColor }) {
  const canvasRef = useRef(null)

  // Board configuration
  const boardSize = 600
  const gridSize = 10
  const cellSize = boardSize / gridSize

  // Snakes and ladders positions
  const snakes = [
    { start: 16, end: 6 },
    { start: 47, end: 26 },
    { start: 49, end: 11 },
    { start: 56, end: 53 },
    { start: 62, end: 19 },
    { start: 64, end: 60 },
    { start: 87, end: 24 },
    { start: 93, end: 73 },
    { start: 95, end: 75 },
    { start: 98, end: 78 },
  ]

  const ladders = [
    { start: 3, end: 57 },
    { start: 14, end: 25 },
    { start: 9, end: 31 },
    { start: 21, end: 42 },
    { start: 28, end: 84 },
    { start: 36, end: 44 },
    { start: 51, end: 67 },
    { start: 71, end: 91 },
    { start: 80, end: 100 },
  ]

  // Get the correct position number for a cell based on row and column
  // This implements the traditional zigzag pattern of Snakes & Ladders
  const getPositionNumber = (row, col) => {
    // Board is numbered from bottom to top
    // Row 0 is the bottom row, Row 9 is the top row

    // If row is even (0, 2, 4, 6, 8), numbers increase from left to right
    // If row is odd (1, 3, 5, 7, 9), numbers increase from right to left

    const rowFromBottom = 9 - row
    const isEvenRowFromBottom = rowFromBottom % 2 === 0

    if (isEvenRowFromBottom) {
      // For even rows from bottom (0, 2, 4, 6, 8), numbers go left to right
      return rowFromBottom * 10 + col + 1
    } else {
      // For odd rows from bottom (1, 3, 5, 7, 9), numbers go right to left
      return rowFromBottom * 10 + (10 - col)
    }
  }

  // Convert position to x,y coordinates
  const getCoordinates = (position) => {
    if (position < 1 || position > 100) return { x: 0, y: 0 }

    // Find the row and column for this position
    const rowFromBottom = Math.floor((position - 1) / 10)
    const row = 9 - rowFromBottom
    let col

    // If row from bottom is even (0, 2, 4, 6, 8), numbers increase from left to right
    // If row from bottom is odd (1, 3, 5, 7, 9), numbers increase from right to left
    if (rowFromBottom % 2 === 0) {
      // Even row from bottom - numbers go left to right
      col = (position - 1) % 10
    } else {
      // Odd row from bottom - numbers go right to left
      col = 9 - ((position - 1) % 10)
    }

    // Calculate the center of the cell
    const x = (col + 0.5) * cellSize
    const y = (row + 0.5) * cellSize

    return { x, y }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, boardSize, boardSize)

    // Draw board with Fluent colors
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        // Calculate position
        const x = col * cellSize
        const y = row * cellSize

        // Get the position number for this cell
        const positionNumber = getPositionNumber(row, col)

        // Alternate colors with Fluent dark theme
        if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
          ctx.fillStyle = "#0B0B0B" // Dark grey
        } else {
          ctx.fillStyle = "#000000" // Black
        }

        // Draw cell
        ctx.fillRect(x, y, cellSize, cellSize)

        // Draw cell border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)" // Lighter border
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, cellSize, cellSize)

        // Draw number
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "14px Bossa" // Updated font
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(positionNumber.toString(), x + cellSize / 2, y + cellSize / 2)
      }
    }

    // Draw snakes with Fluent pink gradient
    snakes.forEach((snake) => {
      const start = getCoordinates(snake.start)
      const end = getCoordinates(snake.end)

      // Create gradient for snake
      const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
      gradient.addColorStop(0, "#FF8FDA") // Pink
      gradient.addColorStop(1, "#8B0142") // Murrey

      ctx.beginPath()
      ctx.moveTo(start.x, start.y)

      // Draw a curved line for the snake
      const controlX = (start.x + end.x) / 2 + (Math.random() * 40 - 20)
      const controlY = (start.y + end.y) / 2 + (Math.random() * 40 - 20)

      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y)

      ctx.lineWidth = 5
      ctx.strokeStyle = gradient
      ctx.stroke()

      // Draw snake head
      ctx.beginPath()
      ctx.arc(start.x, start.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#FF8FDA" // Pink
      ctx.fill()
    })

    // Draw ladders with Fluent green gradient
    ladders.forEach((ladder) => {
      const start = getCoordinates(ladder.start)
      const end = getCoordinates(ladder.end)

      // Create gradient for ladder
      const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
      gradient.addColorStop(0, "#32FE6B") // Spring Green
      gradient.addColorStop(1, "#3700FF") // Blue

      // Draw ladder sides
      const offset = 5

      // Left side
      ctx.beginPath()
      ctx.moveTo(start.x - offset, start.y)
      ctx.lineTo(end.x - offset, end.y)
      ctx.lineWidth = 3
      ctx.strokeStyle = gradient
      ctx.stroke()

      // Right side
      ctx.beginPath()
      ctx.moveTo(start.x + offset, start.y)
      ctx.lineTo(end.x + offset, end.y)
      ctx.lineWidth = 3
      ctx.strokeStyle = gradient
      ctx.stroke()

      // Draw rungs
      const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
      const steps = Math.floor(distance / 20)

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        const x1 = start.x - offset + (end.x - start.x) * ratio
        const y1 = start.y + (end.y - start.y) * ratio
        const x2 = start.x + offset + (end.x - start.x) * ratio
        const y2 = y1

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineWidth = 2
        ctx.strokeStyle = "#FFFFFF"
        ctx.stroke()
      }
    })

    // Draw player
    const playerCoords = getCoordinates(playerPosition)
    ctx.beginPath()
    ctx.arc(playerCoords.x - 10, playerCoords.y, 12, 0, Math.PI * 2)
    ctx.fillStyle = playerColor || "#32FE6B" // Use selected color or default to Spring Green
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw bot
    const botCoords = getCoordinates(botPosition)
    ctx.beginPath()
    ctx.arc(botCoords.x + 10, botCoords.y, 12, 0, Math.PI * 2)
    ctx.fillStyle = "#FECD07" // Jonquil
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.stroke()
  }, [playerPosition, botPosition, playerColor])

  return (
    <div className="flex flex-col">
      {/* Color indicator legend - now above the game board */}
      <div className="flex justify-center gap-6 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: playerColor || "#32FE6B" }}></div>
          <span className="text-sm text-white">You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-fluent-jonquil"></div>
          <span className="text-sm text-white">Bot</span>
        </div>
      </div>

      {/* Game board */}
      <div className="rounded-lg shadow-lg relative mx-auto max-w-full">
        <canvas ref={canvasRef} width={boardSize} height={boardSize} className="rounded-lg mx-auto block" />
      </div>
    </div>
  )
}
