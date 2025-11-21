import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要保護的路徑（管理頁面）
const PROTECTED_PATHS = [
    '/trip-settings',
    '/people',
    '/groups',
    '/announcements',
    '/meals',
    '/transport',
    '/tasks'
]

// 這些路徑下的 API 也需要保護（這裡先簡單處理頁面，API 保護通常在 API Route 內部做）
// 但為了安全，我們可以攔截對應的 API
const PROTECTED_API_PATHS = [
    '/api/people',
    '/api/ski-groups',
    // 注意：有些 GET 請求可能是公開的（例如 /view 頁面需要讀取資料）
    // 所以 API 的保護策略比較複雜，建議在 API Route 內部做細粒度控制
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. 檢查是否為受保護的頁面
    const isProtectedPage = PROTECTED_PATHS.some(path => pathname.startsWith(path))

    if (isProtectedPage) {
        // 檢查是否有 trip_token (團主) 或 admin_token (系統管理員)
        const tripToken = request.cookies.get('trip_token')?.value
        const adminToken = request.cookies.get('admin_token')?.value

        if (!tripToken && !adminToken) {
            // 未登入，重定向到團主登入頁
            const loginUrl = new URL('/organizer/login', request.url)
            // 帶上原本想去的頁面，登入後跳轉回來 (Optional)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - view (public view pages)
         * - apply (application page)
         * - organizer/login (login page)
         * - admin/login (super admin login)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|view|apply|organizer/login|admin/login|$).*)',
    ],
}
