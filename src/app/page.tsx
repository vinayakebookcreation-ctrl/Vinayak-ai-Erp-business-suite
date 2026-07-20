export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          Vinayak AI Business Suite 🚀
        </h1>

        <p className="mt-3 text-gray-600">
          Clean Next.js 16 + TypeScript setup
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <a
            href="/login"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Login
          </a>

          <a
            href="/branches"
            className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Branches
          </a>
        </div>
      </div>
    </div>
  );
}