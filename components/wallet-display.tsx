"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, LogOut } from "lucide-react"

export default function WalletDisplay({ wallet, playerInfo, disconnectWallet }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = (e) => {
    e.stopPropagation() // Prevent dropdown toggle
    disconnectWallet()
    // Force page refresh on disconnect
    window.location.reload()
  }

  const formatBalance = (balance) => {
    if (!balance) return "0.00 ETH"
    return `${Number(balance).toFixed(4)} ETH`
  }

  // Format address to show only first 4 and last 4 characters
  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-black bg-opacity-70 px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: playerInfo?.color || "#32FE6B" }}></div>
        <span className="text-white font-medium">{playerInfo?.name || "Anonymous.fluent"}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black bg-opacity-90 rounded-md shadow-lg z-50">
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
              <div className="flex items-center justify-between bg-black bg-opacity-50 p-2 rounded">
                <span className="text-white text-sm font-mono">{formatAddress(wallet?.address)}</span>
                <button
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <span className="text-fluent-spring-green text-xs">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Balance</p>
              <div className="bg-black bg-opacity-50 p-2 rounded">
                <span className="text-white font-medium">{formatBalance(wallet?.balance)}</span>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-center gap-2 bg-fluent-murrey text-white py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
