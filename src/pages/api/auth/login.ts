import {NextApiHandler} from 'next';
import {createClient, AuthTokenResponse} from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(url, anonkey, {auth: {persistSession: false}});

const loginHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        // Sign in the user using Supabase authentication
        const { data, error: signInError }: AuthTokenResponse = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error('Error signing in:', signInError);
            return res.status(401).json({error: 'Invalid credentials'});
        }

        console.log(data);

        // User successfully signed in
        return res.status(200).json({message: 'User signed in successfully', data});
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
};

export default loginHandler;
