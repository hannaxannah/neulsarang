import type { Metadata } from 'next'
import { Noto_Sans_KR, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})


export const metadata: Metadata = {
  title: '늘사랑교회',
  description: '늘사랑교회에 오신 것을 환영합니다. 언제나, 변함없이, 사랑으로.',
  openGraph: {
    title: '늘사랑교회',
    description: '늘사랑교회에 오신 것을 환영합니다.',
    url: 'https://neulsarang.vercel.app',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${dmSerif.variable}`}>
      <body style={{ fontFamily: 'var(--font-sans)' }}>{children}</body>
    </html>
  )
}
