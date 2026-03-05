import './globals.css'

export const metadata = {
  title: 'TripOS',
  description: 'Collaborative group trip planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
