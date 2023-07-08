import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

// Trigger this middleware to run on the `/secret-page` route
export const config = {
    matcher: '/chat',
};

export function middleware(request: NextRequest) {
    // Extract country. Default to US if not found.
    const country = (request.geo && request.geo.country) || 'Unknown';

    console.log(`Visitor from ${country}`);

    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(request.nextUrl.pathname)
    ) {
        return;
    }

    if (request.nextUrl.locale === 'default') {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

        return NextResponse.redirect(
            new URL(
                `/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`,
                request.url
            )
        );
    }

    // Rewrite to URL
    return NextResponse.rewrite(request.nextUrl);
}
