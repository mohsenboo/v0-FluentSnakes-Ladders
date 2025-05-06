"use client"

import { useState } from "react"
import { ExternalLink, ChevronUp, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TransactionHistory({ transactions, explorerUrl }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return "Just now"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`
    } else {
      return `${Math.floor(diff / 3600000)}h ago`
    }
  }

  const openExplorer = (hash) => {
    window.open(`${explorerUrl}/tx/${hash}`, "_blank")
  }

  // Truncate hash for display
  const truncateHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="transaction-panel rounded-lg shadow-lg overflow-hidden w-64">
        <div
          className="bg-black bg-opacity-90 p-2 flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-fluent-cyan" />
            <span className="text-sm font-medium text-fluent-cyan">Transaction History</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-white" /> : <ChevronUp className="h-4 w-4 text-white" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="max-h-60 overflow-y-auto bg-black bg-opacity-90">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="p-2 border-t border-gray-900 hover:bg-black hover:bg-opacity-70 transition-colors cursor-pointer"
                onClick={() => openExplorer(tx.hash)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-fluent-cyan">Dice Roll</span>
                    <span className="text-xs text-white">{formatTime(tx.timestamp)}</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white" />
                </div>
                <div className="text-xs font-mono text-white mt-1">{truncateHash(tx.hash)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
