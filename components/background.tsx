"use client"

import Image from "next/image"

export default function FluentBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Image
        src="/images/fluent-background-new.jpeg"
        alt="Fluent Background"
        fill
        priority
        className="object-cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
    </div>
  )
}
