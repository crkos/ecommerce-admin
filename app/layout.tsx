import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import { ModalProvider } from '@/providers/ModalProvider'
import {ToasterProvider} from '@/providers/ToastProvider'
import ThemeProvider from '@/providers/ThemeProvider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard',
  description: 'E-Commerce Dashboard',
}

export default async function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode
}) {

  return (
      <ClerkProvider >
        <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
          <ToasterProvider />
          <ModalProvider />
          {children}
        </ThemeProvider>
        </body>
        </html>
      </ClerkProvider>
  )
}