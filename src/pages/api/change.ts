import { NextApiHandler } from 'next';
import mysql from 'mysql';

const dbConfig = process.env.DATABASE_URL || '';

const changeHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const connection = mysql.createConnection(dbConfig);

    try {
        // Fetch the user ID from the user_tokens table using the token
        const selectUserIdQuery = 'SELECT user_id FROM user_tokens WHERE token = ?';
        connection.query(selectUserIdQuery, [token], async (error: mysql.MysqlError | null, rows: any[]) => {
            if (error) {
                console.error('Error fetching user ID:', error);
                return res.status(500).json({ error: 'Internal server error' });
            } else {
                if (rows.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const userId = rows[0].user_id;
                console.log(userId);

                const newPictureURL = req.body.url;

                try {
                    // Update the user's profile picture in the database with the new image URL
                    const updateUserQuery = 'UPDATE users SET profile_picture = ? WHERE id = ?';
                    connection.query(updateUserQuery, [newPictureURL, userId], (error: mysql.MysqlError | null) => {
                        if (error) {
                            console.error('Error updating user profile picture:', error);
                            return res.status(500).json({ error: 'Internal server error' });
                        } else {
                            return res.status(200).json({ message: 'Profile picture updated successfully' });
                        }
                    });
                } catch (error) {
                    console.error('Error validating image URL:', error);
                    return res.status(400).json({ error: 'Invalid image URL' });
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default changeHandler;
