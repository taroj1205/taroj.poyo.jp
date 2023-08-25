import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { code } = req.query

    if (code) {
        const supabase = createClient(url, anonkey);
        await supabase.auth.exchangeCodeForSession(String(code))
    }

    res.redirect('/auth/login')
}

export default handler