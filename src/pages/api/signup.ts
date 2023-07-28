import { NextApiHandler } from 'next';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import gravatarUrl from 'gravatar-url';

const dbConfig = process.env.DATABASE_URL || '';

const signupHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    const connection = mysql.createConnection(dbConfig);

    try {
        // Create the tables if they do not exist
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                profile_picture VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                email VARCHAR(255) NOT NULL UNIQUE
            )
        `;

        const createUserTokenTableQuery = `
            CREATE TABLE IF NOT EXISTS user_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                token VARCHAR(32) NOT NULL,
                expiration_date TIMESTAMP NOT NULL
            )
        `;

        connection.query(createUsersTableQuery, async (error: mysql.MysqlError | null) => {
            if (error) {
                console.error('Error creating users table:', error);
                throw new Error('Failed to create users table');
            }

            connection.query(createUserTokenTableQuery, async (error: mysql.MysqlError | null) => {
                if (error) {
                    console.error('Error creating user_tokens table:', error);
                    throw new Error('Failed to create user_tokens table');
                }

                try {
                    // Hash the email, username, and password using bcrypt
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const profile_picture = gravatarUrl(email, { size: 200, default: 'identicon' });

                    // Insert the user into the database
                    const insertUserQuery = `
                    INSERT INTO users (username, password, email, profile_picture)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE username=username
                    `;

                    const params = [username, hashedPassword, email, profile_picture];

                    connection.query(insertUserQuery, params, (error: mysql.MysqlError | null, result: mysql.OkPacket) => {
                        if (error) {
                            console.error('Error inserting user:', error);
                            throw new Error('Failed to insert user');
                        }
                        const userId = result.insertId;

                        // Generate random token for the user
                        const token = nanoid(32);

                        // Calculate the token expiration date
                        const expirationDate = new Date();
                        expirationDate.setDate(expirationDate.getDate() + 7);

                        // Insert the user_tokens into the database
                        const insertTokenQuery = `
                        INSERT INTO user_tokens (user_id, token, expiration_date)
                        VALUES (?, ?, ?)
                        `;

                        const tokenParams = [userId, token, expirationDate];

                        console.log(tokenParams);

                        connection.query(insertTokenQuery, tokenParams, (error: mysql.MysqlError | null) => {
                            if (error) {
                                console.error('Error inserting user token:', error);
                                throw new Error('Failed to insert user token');
                            }

                            // User and token insertion successful
                            res.status(201).json({ message: 'User created successfully', token });
                        });
                    });
                } catch (error) {
                    console.error('Error during signup:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            });
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default signupHandler;
