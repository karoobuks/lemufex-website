export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] text-white p-8">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-[#00C853]">Access Denied</h1>
        <p className="text-lg mb-6 text-gray-300">
          You don’t have permission to view this page. Please check your account or contact support if you believe this is an error.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#00C853] text-[#121212] font-semibold rounded-lg hover:opacity-90 transition"
        >
          Go Back Home
        </a>
      </div>
    </main>
  );
}
