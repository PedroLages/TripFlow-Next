import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check user authentication (validates JWT server-side)
  const { data: { user }, error } = await supabase.auth.getUser()

  // Protected route prefixes
  const protectedPrefixes = ['/trips', '/settings', '/profile', '/dashboard']
  const isProtectedRoute = protectedPrefixes.some(prefix =>
    request.nextUrl.pathname.startsWith(prefix)
  )

  // Add debug header to verify proxy execution
  supabaseResponse.headers.set('X-Proxy-Ran', 'true')
  supabaseResponse.headers.set('X-Has-User', user ? 'yes' : 'no')
  supabaseResponse.headers.set('X-Is-Protected', isProtectedRoute ? 'yes' : 'no')

  // Redirect to login if no user and accessing protected routes
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    redirectResponse.headers.set('X-Proxy-Redirected', 'yes')
    return redirectResponse
  }

  // Auth pages that logged-in users shouldn't access
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(request.nextUrl.pathname)

  // Redirect to dashboard if already logged in and accessing auth pages
  if (user && isAuthPage) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/trips/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/dashboard',
    '/login',
    '/signup',
    '/',
  ],
}
