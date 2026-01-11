function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <span className="text-6xl">🐞</span>
        </div>
        <h1 className="text-4xl font-bold text-red-600 text-center mb-2">
          LadyBug
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Bug Tracking Application
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-center font-medium">
            ✅ Tailwind CSS is working perfectly!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App