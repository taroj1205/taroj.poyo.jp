import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_FILE = /\.(.*)$/;

// Trigger this middleware to run on the `/secret-page` route
export const config = {
    matcher: '/chat',
};

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });
    await (supabase.auth as any).getSession();

    // Extract country. Default to US if not found.
    const country = (req.geo && req.geo.country) || 'Unknown';

    console.log(`Visitor from ${country}`);

    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return;
    }

    if (req.nextUrl.locale === 'default') {
        const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';

        return NextResponse.redirect(
            new URL(
                `/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`,
                req.url
            )
        );
    }

    // Rewrite to URL
    return NextResponse.rewrite(req.nextUrl);
}
