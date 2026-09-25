import  Providers  from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>LUXOR𓂀ASWAN - Discover Egypt</title>
        <meta
          name="description"
          content="LUXOR𓂀ASWAN is your gateway to Egypt's beauty. Explore tours, cities, and cultural experiences."
        />
        <link rel="icon" href="/brand/luxor-aswan-logo-transparent.png" />
      </head>
      <body style={{overflowX:"hidden"}}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
