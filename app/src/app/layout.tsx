import { NavBar } from '@/components/NavBar';
import '@/styles/globals.css';
import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'

const inter = Roboto_Mono({ subsets: ['latin'] })


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
        <NavBar />
        {children}
      </body>
    </html>
  )
}
