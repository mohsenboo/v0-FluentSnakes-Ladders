"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import GameBoard from "@/components/game-board"
import WalletConnect from "@/components/wallet-connect"
import GameStatus from "@/components/game-status"
import MintNFT from "@/components/mint-nft"
import NetworkCheck from "@/components/network-check"
import TransactionHistory from "@/components/transaction-history"
import FluentBackground from "@/components/background"
import Footer from "@/components/footer"
import PlayerSetup from "@/components/player-setup"
import WalletDisplay from "@/components/wallet-display"
import RollHistorySection from "@/components/roll-history-section"
import DiceAnimation from "@/components/dice-animation"
import GameOverModal from "@/components/game-over-modal"

// Fluent Developer Preview network configuration
export const fluentNetwork = {
  chainId: "0x5201", // 20993 in hex
  chainName: "Fluent Developer Preview",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.dev.gblend.xyz"],
  blockExplorerUrls: ["https://blockscout.dev.gblend.xyz"],
}

export default function Home() {
  const [wallet, setWallet] = useState(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [gameState, setGameState] = useState({
    playerPosition: 1,
    botPosition: 1,
    currentTurn: "player", // "player" or "bot"
    gameOver: false,
    winner: null,
    playerBonusRoll: false, // Track if player gets a bonus roll
    botBonusRoll: false, // Track if bot gets a bonus roll
    consecutiveSixes: 0, // Track consecutive sixes for display purposes
  })
  const [lastRoll, setLastRoll] = useState(0)
  const [botLastRoll, setBotLastRoll] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [isBotRolling, setIsBotRolling] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [userRollHistory, setUserRollHistory] = useState([])
  const [botRollHistory, setBotRollHistory] = useState([])
  const [playerInfo, setPlayerInfo] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const [gameSetupComplete, setGameSetupComplete] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()

        // Get balance
        const balanceWei = await provider.getBalance(address)
        const balanceEth = ethers.formatEther(balanceWei)

        setWallet({
          address,
          signer,
          provider,
          balance: balanceEth,
        })

        // Check if on correct network
        checkNetwork(provider)
      } else {
        alert("Please install MetaMask or another EVM compatible wallet")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  // Check if connected to Fluent network
  const checkNetwork = async (provider) => {
    try {
      // Add a small delay to ensure provider is ready after network changes
      if (provider._networkChanged) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const network = await provider.getNetwork()
      const currentChainId = Number(network.chainId)
      const isCorrect = currentChainId === 20993
      setIsCorrectNetwork(isCorrect)
      return isCorrect
    } catch (error) {
      console.error("Error checking network:", error)
      setIsCorrectNetwork(false)
      return false
    }
  }

  // Switch to Fluent network
  const switchToFluentNetwork = async () => {
    if (!wallet || !window.ethereum) return false

    try {
      // Try to switch to the Fluent network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: fluentNetwork.chainId }],
        })

        // Don't set network state here - let the chainChanged event handler do it
        return true
      } catch (switchError) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [fluentNetwork],
            })

            // Don't set network state here - let the chainChanged event handler do it
            return true
          } catch (addError) {
            console.error("Error adding network:", addError)
            return false
          }
        } else {
          console.error("Error switching network:", switchError)
          return false
        }
      }
    } catch (error) {
      console.error("Error switching to Fluent network:", error)
      return false
    }
  }

  // Disconnect wallet function - completely reset the state
  const disconnectWallet = () => {
    setWallet(null)
    setIsCorrectNetwork(false)
    setTransactions([])
    setUserRollHistory([])
    setBotRollHistory([])
    setPlayerInfo(null)
    setGameSetupComplete(false)
    resetGame()

    // Note: The actual page refresh is handled in the WalletDisplay component
    // This ensures all state is properly cleared before the refresh
  }

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum && wallet) {
      const handleChainChanged = async (chainId) => {
        // Convert hex chainId to decimal for comparison
        const newChainId = Number.parseInt(chainId, 16)
        const isCorrect = newChainId === 20993
        setIsCorrectNetwork(isCorrect)

        // Instead of reloading, we'll reconnect the wallet
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()

          // Get balance
          const balanceWei = await provider.getBalance(address)
          const balanceEth = ethers.formatEther(balanceWei)

          setWallet({
            address,
            signer,
            provider,
            balance: balanceEth,
          })
        } catch (error) {
          console.error("Error reconnecting after network change:", error)
        }
      }

      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [wallet])

  // Function to roll dice with blockchain transaction
  const rollDice = async () => {
    // Check if it's player's turn or they have a bonus roll
    if (
      !wallet ||
      isRolling ||
      !isCorrectNetwork ||
      (gameState.currentTurn !== "player" && !gameState.playerBonusRoll) ||
      gameState.gameOver
    )
      return

    setIsRolling(true)

    try {
      // Create a transaction to represent the dice roll
      // We'll send a tiny amount of ETH to our own address with data representing the dice roll
      const signer = wallet.signer
      const address = wallet.address

      // Create transaction data that includes game information
      const gameData = ethers.toUtf8Bytes(`SnakesAndLadders:DiceRoll:${Date.now()}`)

      // Create transaction
      const tx = await signer.sendTransaction({
        to: address, // Send to self
        value: ethers.parseEther("0.0001"), // Tiny amount of ETH
        data: ethers.hexlify(gameData),
      })

      console.log("Transaction sent:", tx.hash)

      // Add transaction to history
      const newTx = {
        hash: tx.hash,
        description: "Dice Roll",
        timestamp: Date.now(),
      }

      setTransactions((prev) => [newTx, ...prev].slice(0, 10)) // Keep only the 10 most recent transactions

      // Wait for transaction to be mined
      await tx.wait()

      // Use the transaction hash to generate a pseudo-random number between 1-6
      const hash = ethers.keccak256(ethers.toUtf8Bytes(tx.hash))
      const bigNum = ethers.toBigInt(hash)
      const diceRoll = Number((bigNum % 6n) + 1n)

      setLastRoll(diceRoll)

      // Add to roll history
      const now = new Date()
      const timeString = now.toLocaleTimeString()
      const isBonusRoll = gameState.playerBonusRoll

      setUserRollHistory((prev) =>
        [
          {
            roller: playerInfo?.name || "User",
            value: diceRoll,
            time: timeString,
            bonus: isBonusRoll,
          },
          ...prev,
        ].slice(0, 10),
      )

      // Move player and check for bonus roll
      movePlayer(diceRoll, isBonusRoll)
    } catch (error) {
      console.error("Error rolling dice:", error)
    } finally {
      setIsRolling(false)
    }
  }

  // Function to move player based on dice roll
  const movePlayer = (diceRoll, isBonusRoll = false) => {
    setGameState((prevState) => {
      // Calculate new position
      let newPosition = prevState.playerPosition + diceRoll

      // Check for snakes and ladders
      newPosition = checkSnakesAndLadders(newPosition)

      // Check if player won
      if (newPosition >= 100) {
        // Show game over modal after a short delay
        setTimeout(() => setShowGameOverModal(true), 1000)

        return {
          ...prevState,
          playerPosition: 100,
          gameOver: true,
          winner: "player",
          playerBonusRoll: false,
        }
      }

      // Check if player gets a bonus roll (rolled a 6)
      const getsBonus = diceRoll === 6

      // Update consecutive sixes count
      const newConsecutiveSixes = getsBonus ? prevState.consecutiveSixes + 1 : 0

      // Determine whose turn it is next
      // If player rolled a 6, they get another turn (bonus roll)
      // Otherwise, it's the bot's turn
      return {
        ...prevState,
        playerPosition: newPosition,
        currentTurn: getsBonus ? "player" : "bot",
        playerBonusRoll: getsBonus,
        botBonusRoll: false,
        consecutiveSixes: newConsecutiveSixes,
      }
    })
  }

  // Bot's turn - automatically triggered after player's turn
  useEffect(() => {
    if ((gameState.currentTurn === "bot" || gameState.botBonusRoll) && !gameState.gameOver) {
      const botTurn = setTimeout(() => {
        triggerBotRoll()
      }, 1500)

      return () => clearTimeout(botTurn)
    }
  }, [gameState.currentTurn, gameState.botBonusRoll, gameState.gameOver])

  // Function to handle bot roll
  const triggerBotRoll = () => {
    if ((gameState.currentTurn !== "bot" && !gameState.botBonusRoll) || gameState.gameOver || isBotRolling) return

    setIsBotRolling(true)

    setTimeout(() => {
      // Generate random number for bot (1-6)
      const botRoll = Math.floor(Math.random() * 6) + 1
      setBotLastRoll(botRoll)

      // Add to roll history
      const now = new Date()
      const timeString = now.toLocaleTimeString()
      const isBonusRoll = gameState.botBonusRoll

      setBotRollHistory((prev) =>
        [
          {
            roller: "Bot",
            value: botRoll,
            time: timeString,
            bonus: isBonusRoll,
          },
          ...prev,
        ].slice(0, 10),
      )

      moveBotPlayer(botRoll, isBonusRoll)
      setIsBotRolling(false)
    }, 1000)
  }

  // Function to move bot based on dice roll
  const moveBotPlayer = (diceRoll, isBonusRoll = false) => {
    setGameState((prevState) => {
      // Calculate new position
      let newPosition = prevState.botPosition + diceRoll

      // Check for snakes and ladders
      newPosition = checkSnakesAndLadders(newPosition)

      // Check if bot won
      if (newPosition >= 100) {
        // Show game over modal after a short delay
        setTimeout(() => setShowGameOverModal(true), 1000)

        return {
          ...prevState,
          botPosition: 100,
          gameOver: true,
          winner: "bot",
          botBonusRoll: false,
        }
      }

      // Check if bot gets a bonus roll (rolled a 6)
      const getsBonus = diceRoll === 6

      // Update consecutive sixes count
      const newConsecutiveSixes = getsBonus ? prevState.consecutiveSixes + 1 : 0

      // Determine whose turn it is next
      // If bot rolled a 6, they get another turn (bonus roll)
      // Otherwise, it's the player's turn
      return {
        ...prevState,
        botPosition: newPosition,
        currentTurn: getsBonus ? "bot" : "player",
        playerBonusRoll: false,
        botBonusRoll: getsBonus,
        consecutiveSixes: newConsecutiveSixes,
      }
    })
  }

  // Function to check snakes and ladders
  const checkSnakesAndLadders = (position) => {
    // Ladders
    const ladders = {
      3: 57,
      14: 25,
      9: 31,
      21: 42,
      28: 84,
      36: 44,
      51: 67,
      71: 91,
      80: 100,
    }

    // Snakes
    const snakes = {
      16: 6,
      47: 26,
      49: 11,
      56: 53,
      62: 19,
      64: 60,
      87: 24,
      93: 73,
      95: 75,
      98: 78,
    }

    if (ladders[position]) return ladders[position]
    if (snakes[position]) return snakes[position]
    return position
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      playerPosition: 1,
      botPosition: 1,
      currentTurn: "player",
      gameOver: false,
      winner: null,
      playerBonusRoll: false,
      botBonusRoll: false,
      consecutiveSixes: 0,
    })
    setLastRoll(0)
    setBotLastRoll(0)
    setUserRollHistory([])
    setBotRollHistory([])
    setShowGameOverModal(false)
  }

  // Handle player setup completion
  const handlePlayerSetup = (info) => {
    setPlayerInfo(info)
    setGameSetupComplete(true)
  }

  // Handle game over modal actions
  const handleReplay = () => {
    resetGame()
  }

  const handleCloseModal = () => {
    setShowGameOverModal(false)
  }

  // Determine if the player can roll
  const canPlayerRoll = () => {
    return (
      (gameState.currentTurn === "player" || gameState.playerBonusRoll) &&
      !gameState.gameOver &&
      isCorrectNetwork &&
      !isRolling
    )
  }

  // Determine if the bot can roll
  const canBotRoll = () => {
    return (
      (gameState.currentTurn === "bot" || gameState.botBonusRoll) &&
      !gameState.gameOver &&
      isCorrectNetwork &&
      !isBotRolling
    )
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <FluentBackground />

      <header className="w-full py-4 z-10 flex justify-between items-center px-4 md:px-8">
        <div className="inline-block px-6 py-3">
          <h1 className="text-4xl font-bold text-white">Fluent Snakes & Ladders</h1>
        </div>

        {wallet && isCorrectNetwork && playerInfo && (
          <div className="flex items-center">
            <WalletDisplay wallet={wallet} playerInfo={playerInfo} disconnectWallet={disconnectWallet} />
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-between p-4 md:p-8 relative z-10">
        <div className="w-full max-w-6xl flex flex-col items-center gap-8">
          {!wallet ? (
            <WalletConnect wallet={wallet} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
          ) : !isCorrectNetwork ? (
            <NetworkCheck
              isCorrectNetwork={isCorrectNetwork}
              switchNetwork={switchToFluentNetwork}
              networkName="Fluent Developer Preview"
            />
          ) : !gameSetupComplete ? (
            <PlayerSetup onComplete={handlePlayerSetup} />
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
              <GameStatus gameState={gameState} lastRoll={lastRoll} resetGame={resetGame} />

              <div className="w-full flex flex-col md:flex-row justify-center gap-10 items-start">
                {/* Bot Roll Button and History - Left Side */}
                <div className="w-full md:w-1/5 order-1 z-10">
                  <div className="bg-black bg-opacity-80 p-4 mb-4 rounded-lg">
                    <div className="flex flex-col items-center mb-3">
                      <div className="dice-container flex items-center justify-center p-4 w-20 h-20 mb-2">
                        <DiceAnimation isRolling={isBotRolling} value={botLastRoll} isBonus={gameState.botBonusRoll} />
                      </div>
                      <button
                        onClick={triggerBotRoll}
                        disabled={!canBotRoll()}
                        className={`w-full py-3 rounded-md font-semibold ${
                          canBotRoll()
                            ? "bg-gradient-to-r from-fluent-jonquil to-fluent-pink text-black"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {isBotRolling ? "Rolling..." : gameState.botBonusRoll ? "Bot Bonus Roll!" : "Bot Roll Dice"}
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white font-medium">Last Roll:</p>
                      <p className="text-xl font-bold text-white">{botLastRoll || "-"}</p>
                    </div>
                  </div>

                  {/* Bot Roll History */}
                  <RollHistorySection rolls={botRollHistory} title="Bot" textColor="text-fluent-jonquil" />
                </div>

                {/* Game Board - Center */}
                <div className="w-full md:w-3/5 order-2 z-0 mx-auto">
                  <div className="mx-auto">
                    <GameBoard
                      playerPosition={gameState.playerPosition}
                      botPosition={gameState.botPosition}
                      playerColor={playerInfo?.color}
                    />
                  </div>
                </div>

                {/* User Roll Button and History - Right Side */}
                <div className="w-full md:w-1/5 order-3 z-10">
                  <div className="bg-black bg-opacity-80 p-4 mb-4 rounded-lg">
                    <div className="flex flex-col items-center mb-3">
                      <div className="dice-container flex items-center justify-center p-4 w-20 h-20 mb-2">
                        <DiceAnimation isRolling={isRolling} value={lastRoll} isBonus={gameState.playerBonusRoll} />
                      </div>
                      <button
                        onClick={rollDice}
                        disabled={!canPlayerRoll()}
                        className={`w-full py-3 rounded-md font-semibold ${
                          canPlayerRoll()
                            ? "bg-gradient-to-r from-fluent-spring-green to-fluent-blue text-black"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {isRolling ? "Rolling..." : gameState.playerBonusRoll ? "Bonus Roll!" : "User Roll Dice"}
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white font-medium">Last Roll:</p>
                      <p className="text-xl font-bold text-white">{lastRoll || "-"}</p>
                    </div>
                  </div>

                  {/* User Roll History */}
                  <RollHistorySection rolls={userRollHistory} title="User" textColor="text-fluent-spring-green" />
                </div>
              </div>

              {/* NFT Section - Below Game Board */}
              <div className="w-full max-w-md mx-auto">
                <MintNFT
                  wallet={wallet}
                  isCorrectNetwork={isCorrectNetwork}
                  networkConfig={fluentNetwork}
                  transactionCount={transactions.length}
                />
              </div>
            </div>
          )}
        </div>

        {/* Transaction History Panel */}
        {wallet && transactions.length > 0 && (
          <TransactionHistory transactions={transactions} explorerUrl={fluentNetwork.blockExplorerUrls[0]} />
        )}
      </main>

      <Footer />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        winner={gameState.winner}
        onReplay={handleReplay}
        onClose={handleCloseModal}
      />
    </div>
  )
}
