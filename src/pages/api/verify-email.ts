import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';

const dbConfig = process.env.DATABASE_URL || '';

const verifyEmailHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Extract the email, verificationCode, and token from the request body
        const { email, verificationCode, token } = req.body;

        console.log(email, verificationCode, token);

        // Create a MySQL connection
        const connection = mysql.createConnection(dbConfig);
        
        // Check if verification code and email match in the verification table
        const checkVerificationQuery = `SELECT users.id FROM verification JOIN users ON verification.email = users.email WHERE verification.email = ? AND verification.code = ?`;
        connection.query(checkVerificationQuery, [email, verificationCode], (verificationErr, verificationResult) => {
            if (verificationErr) {
                console.log(verificationErr);
                connection.end();
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (verificationResult.length === 0) {
                console.log(verificationResult);
                connection.end();
                return res.status(401).json({ error: 'Invalid verification code or token' });
            }

            // Get the user_id from the verificationResult array
            const user_id = verificationResult[0].id as Number;

            console.log(user_id);

            // Check if the token matches with the user's table email
            const checkUserTokenQuery = `SELECT * FROM user_tokens WHERE user_id = ? AND token = ?`;
            connection.query(checkUserTokenQuery, [user_id, token], (userErr, userResult) => {
                if (userErr) {
                    console.log(userErr);
                    connection.end();
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                // If verification and user token are valid, update the user's verified column to true
                if (verificationResult.length > 0 && userResult.length > 0) {
                    const updateUserQuery = `UPDATE users SET verified = true WHERE email = ?`;
                    connection.query(updateUserQuery, [email], (updateErr) => {
                        if (updateErr) {
                            connection.end();
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }

                        // Delete the verification row for the user
                        const deleteVerificationQuery = `DELETE FROM verification WHERE email = ?`;
                        connection.query(deleteVerificationQuery, [email], (deleteErr) => {
                            connection.end();
                            if (deleteErr) {
                                return res.status(500).json({ error: 'Internal Server Error' });
                            }

                            return res.status(200).json({ message: 'Email verified successfully' });
                        });
                    });
                } else {
                    connection.end();
                    return res.status(401).json({ error: 'Invalid verification code or token' });
                }
            });
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default verifyEmailHandler;
