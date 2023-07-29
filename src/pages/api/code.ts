import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';
import { nanoid } from 'nanoid';

const dbConfig = process.env.DATABASE_URL || '';

const codeHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, token } = req.body;

    if (!email || !token) {
        return res.status(400).json({ error: 'Email and token are required' });
    }

    const connection = mysql.createConnection(dbConfig);

    try {

        // Check if the email and token match the email in the email table
        const checkEmailQuery = `SELECT * FROM email WHERE email = ? AND code IS NOT NULL AND expiration_date > NOW()`;
        connection.query(checkEmailQuery, [email], (error: mysql.MysqlError | null, results: any[]) => {
            if (error) {
                console.error('Error checking email:', error);
                connection.end();
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                connection.end();
                return res.status(400).json({ error: 'Email verification code not found or expired' });
            }

            // Generate a new verification code
            const newVerificationCode = generateVerificationCode();

            // Update the email table with the new verification code and expiration date
            const updateEmailQuery = `
                UPDATE email
                SET code = ?, expiration_date = NOW() + INTERVAL 10 MINUTE
                WHERE email = ?
                `;

            connection.query(updateEmailQuery, [newVerificationCode, email], (error: mysql.MysqlError | null) => {
                connection.end();
                if (error) {
                    console.error('Error updating verification code:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                // Send the new verification code to the user's email
                // You can implement the email sending logic here, similar to the sendVerificationEmail function in the previous code
                // For simplicity, we'll just return the new verification code in the response
                return res.status(200).json({ code: newVerificationCode });
            });
        });
    } catch (error) {
        console.error('Error generating new verification code:', error);
        connection.end();
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default codeHandler;
