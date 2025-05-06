import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t border-gray-800 bg-black bg-opacity-70 z-10 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/0xmohi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-fluent-cyan transition-colors"
            >
              <Twitter size={18} />
              <span>@0xmohi</span>
            </a>
            <a
              href="https://github.com/mohsenboo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-fluent-cyan transition-colors"
            >
              <Github size={18} />
              <span>mohsenboo</span>
            </a>
          </div>

          <div>
            <a
              href="https://faucet.dev.gblend.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-fluent-blue to-fluent-pink rounded-md text-white hover:opacity-90 transition-opacity"
            >
              Get Fluent Testnet ETH
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
