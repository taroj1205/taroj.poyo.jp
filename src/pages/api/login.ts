import { NextApiHandler } from 'next';

const loginHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // Assuming the request contains JSON data with email and password fields
    const { email, password } = req.body;

    // Perform your login logic here (e.g., check credentials, generate tokens, etc.)
    // Replace this with your actual authentication logic

    try {
        // Check if the email and password are valid
        // For demonstration purposes, we'll just check if the email is 'test@example.com' and the password is 'password'
        if (email === 'test@example.com' && password === 'password') {
            // Mocking a successful login response with a token
            const token = 'your_generated_jwt_token_here';
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        // Handle any errors that might occur during the login process
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default loginHandler;
