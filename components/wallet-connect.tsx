"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, AlertTriangle } from "lucide-react"
import { ethers } from "ethers"

export default function WalletConnect({ wallet, connectWallet, disconnectWallet }) {
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet?.provider && wallet?.address) {
        setIsLoading(true)
        try {
          const balanceWei = await wallet.provider.getBalance(wallet.address)
          const balanceEth = ethers.formatEther(balanceWei)
          setBalance(balanceEth)
        } catch (error) {
          console.error("Error fetching balance:", error)
          setBalance("0")
        } finally {
          setIsLoading(false)
        }
      } else {
        setBalance(null)
      }
    }

    fetchBalance()
  }, [wallet])

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
    }
  }

  const hasZeroBalance = balance !== null && Number.parseFloat(balance) === 0

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      <div className="fluent-card p-4">
        {wallet ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Connected Wallet</span>
              <Button onClick={disconnectWallet} className="bg-fluent-murrey hover:bg-opacity-90 text-white" size="sm">
                Disconnect
              </Button>
            </div>
            <div className="flex items-center justify-between bg-fluent-dark-grey p-2 rounded">
              <span className="text-white font-mono">{truncateAddress(wallet.address)}</span>
              <Button variant="ghost" size="icon" onClick={copyAddress} className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-fluent-dark-grey p-2 rounded">
              <span className="text-sm text-gray-400">Balance:</span>
              {isLoading ? (
                <span className="text-white">Loading...</span>
              ) : (
                <span className={`text-white font-mono ${hasZeroBalance ? "text-fluent-pink" : ""}`}>
                  {balance ? `${Number.parseFloat(balance).toFixed(4)} ETH` : "Unknown"}
                </span>
              )}
            </div>

            {hasZeroBalance && (
              <div className="mt-2 p-2 bg-fluent-dark-grey rounded border border-fluent-pink">
                <p className="text-sm text-fluent-pink mb-2">You need ETH to play! Get some from the faucet.</p>
                <a
                  href="https://faucet.dev.gblend.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-white text-sm bg-fluent-pink hover:bg-opacity-90 p-2 rounded w-full"
                >
                  <ExternalLink size={14} />
                  <span>Get Fluent Testnet ETH</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={connectWallet} className="w-full fluent-button">
            Connect Wallet
          </Button>
        )}
      </div>

      {/* Warning message */}
      <div className="fluent-card p-4 border border-fluent-jonquil">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-fluent-jonquil flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white">
            <span className="font-bold text-fluent-jonquil">ATTENTION:</span> Please use a test wallet or create a new
            wallet for this game. Do not connect your main wallet containing valuable assets.
          </p>
        </div>
      </div>
    </div>
  )
}
