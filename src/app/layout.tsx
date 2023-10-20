import '@/styles/globals.css';
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'

const inter = Roboto_Mono({ subsets: ['latin'] })

// const oxygen = Oxygen({
//   weight: '400',
//   subsets: ['latin'],
// })

export const metadata: Metadata = {
  title: 'Type Fighters',
  description: 'Battle to see who is the ultimate typer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter.className} dark`}>
        {children}
      </body>
    </html>
  )
}
