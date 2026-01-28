export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-lg text-gray-600">
          This is a test page outside the [locale] directory.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          If you can see this, the issue is with the [locale] directory setup.
        </p>
      </div>
    </div>
  );
}
