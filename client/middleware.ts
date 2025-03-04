// Server components cannot write cookies, hence we'll use middleware to refresh expired auth tokens + store them...
// tokens are refreshed with supabase.auth.getUser()
// refreshed tokens are passed to server components via cookies -- request.cookies.set
// refreshed auth tokens are passed to the browser to replace the expired ones -- response.cookies.set

import { type NextRequest } from 'next/server'
import {updateSession} from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}