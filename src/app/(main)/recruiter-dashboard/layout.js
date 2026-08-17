export const metadata = {
  title: 'RecruitLoop - Recruiter Dashboard',
  description: 'Manage your job posts and find the best candidates',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
