import { NextApiHandler } from 'next';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import gravatarUrl from 'gravatar-url';

const dbConfig = process.env.DATABASE_URL || '';

const loginHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        // Wait for 5 seconds before sending back the error response
        await new Promise(resolve => setTimeout(resolve, 5000));
        return res
            .status(400)
            .json({ error: 'Username or email and password are required' });
    }

    const connection = mysql.createConnection(dbConfig);

    try {
        // Check if the user exists based on username or email
        const checkUserQuery = 'SELECT id, username, password, email FROM users WHERE username = ? OR email = ?';
        connection.query(checkUserQuery, [email, email], async (error: mysql.MysqlError | null, rows: any) => {
            if (error) {
                console.error('Error checking user:', error);
                throw new Error('Failed to check user');
            }

            if (rows.length === 0) {
                console.log('User not found');
                // Wait for 5 seconds before sending back the error response
                await new Promise(resolve => setTimeout(resolve, 5000));
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = rows[0];
            const { id, username, password: hashedPassword, email } = user;

            try {
                // Compare the provided password with the hashed password in the database
                const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
                if (!isPasswordMatched) {
                    console.log('Invalid password');
                    // Wait for 5 seconds before sending back the error response
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // User authentication successful, update the last_login timestamp
                const updateLastLoginQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
                connection.query(updateLastLoginQuery, [id], (error: mysql.MysqlError | null) => {
                    if (error) {
                        console.error('Error updating last_login:', error);
                        throw new Error('Failed to update last_login');
                    }

                    // Fetch the token for the user from the user_tokens table
                    const fetchUserTokenQuery = 'SELECT token FROM user_tokens WHERE user_id = ?';
                    connection.query(fetchUserTokenQuery, [id], (error: mysql.MysqlError | null, tokenRows: any) => {
                        if (error) {
                            console.error('Error fetching user token:', error);
                            throw new Error('Failed to fetch user token');
                        }

                        if (tokenRows.length === 0) {
                            console.log('User token not found');
                            return res.status(401).json({ error: 'Invalid credentials' });
                        }

                        const { token } = tokenRows[0];
                        const picture = gravatarUrl(email, { size: 200, default: 'identicon' });
                        const user = {
                            email,
                            username,
                            picture,
                        };
                        return res.status(200).json({ token, user });
                    });
                });
            } catch (error) {
                console.error('Error during login:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        // Wait for 5 seconds before sending back the error response
        await new Promise(resolve => setTimeout(resolve, 5000));
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default loginHandler;
