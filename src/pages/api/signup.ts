import { NextApiHandler } from 'next';
import mysql from 'mysql';
import bcrypt from 'bcrypt';

const dbConfig = process.env.DATABASE_URL || '';

const signupHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Check if the user with the given email already exists
        const userExists = await checkIfUserExists(connection, email);
        if (userExists) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await insertUser(connection, email, hashedPassword);

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.end();
    }
};

async function checkIfUserExists(connection: mysql.Connection, email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = ?';
    const values = [email];

    try {
        const rows: any = await connection.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
}


async function insertUser(connection: mysql.Connection, email: string, password: string): Promise<void> {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            email VARCHAR(255) NOT NULL UNIQUE
        )
    `;
    const insertUserQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    const values = [email, password, email];

    try {
        await connection.query(createTableQuery);
        await connection.query(insertUserQuery, values);
    } catch (error) {
        throw error;
    }
}

export default signupHandler;