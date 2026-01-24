import './globals.css'

export const metadata = {
  title: 'NA Step Guide',
  description: 'A compassionate companion for working the first three steps',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✧</text></svg>" />
      </head>
      <body className="bg-stone-900 text-stone-100 antialiased">
        {children}
      </body>
    </html>
  )
}
