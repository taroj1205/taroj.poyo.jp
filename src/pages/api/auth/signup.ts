import {NextApiHandler} from 'next';
import {createClient} from '@supabase/supabase-js';
import gravatarUrl from 'gravatar-url';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {auth: {persistSession: false}});

const signupHandler: NextApiHandler = async (req, res) => {
    const url = req.headers.host;
    const protocol = url === 'localhost:3000' ? 'http' : 'https';
    console.log(`${protocol}://${url}/api/auth/callback`);
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {email, username, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    const avatar = gravatarUrl(email, {size: 200, default: 'retro'});

    try {
        console.log(email, password, username, avatar);

        // Sign up the user using Supabase authentication
        const {data: signupData, error: signupError} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    avatar
                },
                emailRedirectTo: `${protocol}://${url}/api/auth/callback`,
            },
        }) as {data: any, error: any};

        if (signupError) {
            console.error('Error signing up:', signupError);
            return res.status(500).json({error: 'Error signing up'});
        }

        console.log(signupData, username, avatar);

        // User and token insertion successful
        return res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default signupHandler;
