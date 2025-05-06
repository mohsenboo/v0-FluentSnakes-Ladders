"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, ExternalLink } from "lucide-react"

export default function NetworkCheck({ isCorrectNetwork, switchNetwork, networkName }) {
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSwitchNetwork = async () => {
    setIsSwitching(true)
    try {
      await switchNetwork()
      // We'll let the chain changed event handle the state update
    } catch (error) {
      console.error("Error switching network:", error)
    } finally {
      // Add a delay before resetting the switching state
      setTimeout(() => setIsSwitching(false), 2000)
    }
  }

  const goToChainlist = () => {
    window.open("https://chainlist.org/chain/20993", "_blank")
  }

  if (isCorrectNetwork) {
    return (
      <div className="w-full max-w-md p-3 bg-black bg-opacity-80 rounded-lg text-center">
        <p className="text-fluent-spring-green text-sm">✓ Connected to {networkName}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-4 bg-black bg-opacity-80 rounded-lg flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-fluent-pink" />
        <p className="text-fluent-pink text-sm">Wrong network detected. Please switch to {networkName}.</p>
      </div>

      <Button
        onClick={handleSwitchNetwork}
        disabled={isSwitching}
        className="w-full bg-gradient-to-r from-fluent-blue to-fluent-pink text-white"
      >
        {isSwitching ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Switching...
          </>
        ) : (
          "Switch Network"
        )}
      </Button>

      <div className="mt-2 pt-3 border-t border-gray-800">
        <p className="text-sm text-gray-300 mb-2">
          Can't switch automatically? Add Fluent Developer Preview to your wallet:
        </p>
        <Button
          onClick={goToChainlist}
          className="w-full flex items-center justify-center gap-2 bg-black border border-fluent-cyan text-fluent-cyan"
        >
          <ExternalLink className="h-4 w-4" />
          Add Fluent Developer Preview
        </Button>
      </div>
    </div>
  )
}
