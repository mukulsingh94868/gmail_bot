import "./globals.css";
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: 'RecruitLoop',
  description: 'Automate your job outreach with smart email templates',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  )
}
