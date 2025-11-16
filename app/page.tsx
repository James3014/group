export default function HomePage() {
  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🏂 神居雪場滑雪團</h1>
        <p className="text-gray-600">聖誕節 30人團隊行程管理</p>
      </header>

      <nav className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <a href="/people" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">👥</div>
          <h2 className="font-bold">人員管理</h2>
        </a>
        <a href="/announcements" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">📢</div>
          <h2 className="font-bold">公告</h2>
        </a>
        <a href="/groups" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">🏂</div>
          <h2 className="font-bold">滑雪分組</h2>
        </a>
        <a href="/meals" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">🍽️</div>
          <h2 className="font-bold">餐飲安排</h2>
        </a>
        <a href="/transport" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">🚗</div>
          <h2 className="font-bold">交通協調</h2>
        </a>
        <a href="/tasks" className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">✅</div>
          <h2 className="font-bold">任務清單</h2>
        </a>
      </nav>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="font-bold mb-1">⏰ 倒數計時</p>
        <p className="text-gray-700">距離聖誕節出發還有 XX 天</p>
      </div>
    </div>
  )
}
