'use client'

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-8 py-10 text-white">
                    <h1 className="text-4xl font-bold mb-4">🏂 DIY Ski Trip Planner 系統功能介紹</h1>
                    <p className="text-blue-100 text-lg">
                        專為滑雪團設計的協作工具，解決分組、交通、餐飲等協調痛點。
                        <br />以下為系統功能展示與使用說明。
                    </p>
                </div>

                <div className="p-8 space-y-12">
                    {/* 1. Sitemap Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-3xl">🗺️</span> 網站地圖 (Sitemap)
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-blue-800 border-b border-blue-100 pb-2">🏠 公共區域</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/</span>
                                        <div>
                                            <span className="font-bold text-gray-900">首頁 (Dashboard)</span>
                                            <p className="text-sm text-gray-600">系統入口。包含功能導航、當前行程看板。</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/apply</span>
                                        <div>
                                            <span className="font-bold text-gray-900">申請使用</span>
                                            <p className="text-sm text-gray-600">申請開通新的滑雪團行程。</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/view/page</span>
                                        <div>
                                            <span className="font-bold text-gray-900">訪客唯讀模式</span>
                                            <p className="text-sm text-gray-600">模擬一般參加者看到的畫面。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-green-800 border-b border-green-100 pb-2">📋 行程管理 (團主)</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/people</span>
                                        <div>
                                            <span className="font-bold text-gray-900">人員管理</span>
                                            <p className="text-sm text-gray-600">設定名單與親子關係（父/母）。</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/groups</span>
                                        <div>
                                            <span className="font-bold text-gray-900">滑雪分組</span>
                                            <p className="text-sm text-gray-600">核心功能！按時段分組，支援快速複製。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-purple-800 border-b border-purple-100 pb-2">📢 協調與溝通</h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/announcements</span>
                                        <div>
                                            <span className="font-bold text-gray-900">公告系統</span>
                                            <p className="text-sm text-gray-600">發布集合時間、注意事項。</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/meals</span>
                                        <div>
                                            <span className="font-bold text-gray-900">餐飲安排</span>
                                            <p className="text-sm text-gray-600">登記餐廳訂位與座位分配。</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 h-fit">/transport</span>
                                        <div>
                                            <span className="font-bold text-gray-900">交通協調</span>
                                            <p className="text-sm text-gray-600">安排車輛與乘客分配。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* 2. Tutorial Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-3xl">🚀</span> 快速上手教學
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-xl font-bold text-blue-900 mb-4">👑 對於團主 (Organizer)</h3>
                                <ol className="space-y-4 list-decimal list-inside text-blue-800">
                                    <li className="pl-2">
                                        <span className="font-bold">建立名單</span>：
                                        <p className="ml-6 text-sm mt-1 text-blue-700">
                                            進入 <span className="font-mono bg-blue-100 px-1 rounded">/people</span> 新增參加者。如有小孩，記得設定「父親」或「母親」，分組時會顯示家庭關係。
                                        </p>
                                    </li>
                                    <li className="pl-2">
                                        <span className="font-bold">開始分組</span>：
                                        <p className="ml-6 text-sm mt-1 text-blue-700">
                                            進入 <span className="font-mono bg-blue-100 px-1 rounded">/groups</span>，選擇日期和時段。將「未分組人員」拉入組別。下午時段可直接用「複製」功能。
                                        </p>
                                    </li>
                                    <li className="pl-2">
                                        <span className="font-bold">發布資訊</span>：
                                        <p className="ml-6 text-sm mt-1 text-blue-700">
                                            用公告發布集合地點，用餐飲頁面登記晚上餐廳。
                                        </p>
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <h3 className="text-xl font-bold text-green-900 mb-4">⛷️ 對於參加者 (Participant)</h3>
                                <ol className="space-y-4 list-decimal list-inside text-green-800">
                                    <li className="pl-2">
                                        <span className="font-bold">查看分組</span>：
                                        <p className="ml-6 text-sm mt-1 text-green-700">
                                            每天早上打開首頁，點擊「滑雪分組」查看自己今天的教練是誰。
                                        </p>
                                    </li>
                                    <li className="pl-2">
                                        <span className="font-bold">確認行程</span>：
                                        <p className="ml-6 text-sm mt-1 text-green-700">
                                            查看「公告」確認集合時間，查看「餐飲安排」知道晚上吃哪家餐廳。
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* 3. FAQ Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-3xl">❓</span> 常見問題 (FAQ)
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Q: 為什麼我看不到某個人？</h4>
                                <p className="text-gray-600">A: 請確認該人員是否已在 <span className="font-mono bg-gray-100 px-1 rounded">/people</span> 列表中建立，且狀態為「確認參加」。</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Q: 如何修改分組？</h4>
                                <p className="text-gray-600">A: 進入 <span className="font-mono bg-gray-100 px-1 rounded">/groups</span>，找到該時段，直接移除或新增成員即可。系統會自動計算誰還沒被分組。</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Q: 我可以建立多個行程嗎？</h4>
                                <p className="text-gray-600">A: 可以。請透過 <span className="font-mono bg-gray-100 px-1 rounded">/apply</span> 申請新的行程，管理員核准後會提供專屬連結。</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer Action */}
                    <div className="mt-12 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            ← 返回首頁
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
