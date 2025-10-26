import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TouchGrass - Nature Scavenger Hunt',
  description: 'Get active and reconnect with nature through our interactive scavenger hunt game.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-black">
        {children}
      </body>
    </html>
  )
}