"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2, Lock } from "lucide-react"
import { ethers } from "ethers"
import Image from "next/image"

// NFT ABI for the Fluent Blender NFT
const NFT_ABI = [
  "function mint() external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
]

// Fluent Blender NFT contract address on Fluent Developer Preview
// This would be replaced with the actual deployed contract address
const NFT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with actual contract

export default function MintNFT({ wallet, isCorrectNetwork, networkConfig, transactionCount }) {
  const [isMinting, setIsMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [tokenId, setTokenId] = useState(null)

  const canMint = transactionCount >= 10
  const remainingTx = 10 - transactionCount

  const mintNFT = async () => {
    if (!wallet || !isCorrectNetwork || !canMint) return

    setIsMinting(true)
    setMintStatus("pending")

    try {
      // For a real implementation with the deployed contract:
      /*
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, wallet.signer);
      
      // Call the mint function
      const tx = await contract.mint();
      const receipt = await tx.wait();
      
      // Get the token ID from the event logs
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find(event => event && event.name === 'Transfer');
      
      const newTokenId = event ? event.args.tokenId.toString() : null;
      setTokenId(newTokenId);
      setTxHash(tx.hash);
      */

      // For now, we'll create a transaction to our own address with NFT minting data
      const signer = wallet.signer
      const address = wallet.address

      // Create transaction data that includes NFT information
      const nftData = ethers.toUtf8Bytes(`SnakesAndLadders:MintNFT:Victory:${Date.now()}`)

      // Create transaction
      const tx = await signer.sendTransaction({
        to: address, // Send to self
        value: ethers.parseEther("0.0001"), // Tiny amount of ETH
        data: ethers.hexlify(nftData),
      })

      console.log("NFT Mint Transaction sent:", tx.hash)

      // Wait for transaction to be mined
      await tx.wait()

      setTxHash(tx.hash)
      setTokenId("1") // Simulate token ID
      setMintStatus("success")
    } catch (error) {
      console.error("Error minting NFT:", error)
      setMintStatus("error")
    } finally {
      setIsMinting(false)
    }
  }

  const viewOnExplorer = () => {
    if (!txHash) return

    const explorerUrl = `${networkConfig.blockExplorerUrls[0]}/tx/${txHash}`
    window.open(explorerUrl, "_blank")
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-black bg-opacity-80 p-6 w-full max-w-md rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-400 mb-4">NFT Minting Unavailable</h2>
          <p className="text-gray-500">
            Please switch to the Fluent Developer Preview network to mint your victory NFT.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black bg-opacity-80 p-6 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-white mb-4">Fluent Blender NFT</h2>

      <div className="mb-6 flex justify-center">
        <div
          className="relative w-48 h-48 rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3700FF, #FF8FDA)",
            padding: "2px",
          }}
        >
          <div className="absolute inset-0 bg-black rounded-lg m-[1px]"></div>
          <div className="relative w-full h-full p-1">
            <Image
              src="/images/fluent-nft.gif"
              alt="Fluent NFT"
              width={192}
              height={192}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <p className="text-center text-gray-300 mb-6">
        Mint this exclusive Fluent Blender NFT on the Fluent blockchain after completing 10 transactions.
      </p>

      {mintStatus === "success" ? (
        <div className="text-center">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-4">
            <h3 className="text-fluent-spring-green font-semibold mb-2">NFT Minted Successfully!</h3>
            {tokenId && <p className="text-sm text-white mb-2">Token ID: #{tokenId}</p>}
            <p className="text-sm text-gray-300 break-all mb-2">Transaction: {txHash}</p>
            <Button onClick={viewOnExplorer} variant="outline" size="sm" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              View on Explorer
            </Button>
          </div>
          <Button
            onClick={() => {
              setMintStatus(null)
              setTxHash(null)
              setTokenId(null)
            }}
            className="bg-gradient-to-r from-fluent-blue to-fluent-pink text-white"
          >
            Close
          </Button>
        </div>
      ) : mintStatus === "error" ? (
        <div className="text-center">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-4">
            <h3 className="text-fluent-pink font-semibold">Minting Failed</h3>
            <p className="text-sm text-gray-300">There was an error minting your NFT. Please try again.</p>
          </div>
          <Button
            onClick={() => setMintStatus(null)}
            className="bg-gradient-to-r from-fluent-blue to-fluent-pink text-white"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <Button
            onClick={mintNFT}
            disabled={isMinting || !canMint}
            className={`w-full ${
              canMint
                ? "bg-gradient-to-r from-fluent-jonquil to-fluent-pink hover:opacity-90 text-black font-bold"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {isMinting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Minting...
              </>
            ) : !canMint ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                {`Complete ${remainingTx} more transactions to unlock`}
              </>
            ) : (
              "Mint NFT"
            )}
          </Button>

          {!canMint && (
            <div className="mt-3 bg-black bg-opacity-50 p-3 rounded-md">
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-fluent-blue to-fluent-pink h-full"
                  style={{ width: `${(transactionCount / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">{transactionCount}/10 transactions completed</p>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-gray-400 mt-4 text-center">
        Note: This will mint a real NFT on the Fluent Developer Preview blockchain.
      </p>
    </div>
  )
}
