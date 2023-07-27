import { NextApiHandler } from 'next';
import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcrypt';

// Replace these database connection details with your own configuration
const dbConfig = {
    user: 'your-postgres-user',
    password: 'your-postgres-password',
    host: 'your-postgres-host',
    database: 'your-postgres-database',
    port: 5432, // PostgreSQL default port is 5432
};

const pool = new Pool(dbConfig);

const signupHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the user with the given email already exists
        const userExists = await checkIfUserExists(email);
        if (userExists) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await insertUser(email, hashedPassword);

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function checkIfUserExists(email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = $1';
    const values = [email];

    try {
        const result: QueryResult = await pool.query(query, values);
        return result.rowCount > 0;
    } catch (error) {
        throw error;
    }
}

async function insertUser(email: string, password: string): Promise<void> {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2)';
    const values = [email, password];

    try {
        await pool.query(query, values);
    } catch (error) {
        throw error;
    }
}

export default signupHandler;
