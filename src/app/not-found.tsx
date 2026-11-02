import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-amber-50/50 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="font-detective text-4xl text-amber-900">404</h1>
            <p className="text-amber-800">Page not found.</p>
            <Link href="/" className="text-amber-700 underline hover:text-amber-900">
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
