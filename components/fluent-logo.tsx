import Image from "next/image"

export default function FluentLogo({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Image src="/images/fluent-logo.png" alt="Fluent" width={200} height={80} className="h-12 w-auto" />
    </div>
  )
}
