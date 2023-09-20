import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
const dbConfig = process.env.DATABASE_URL || '';
const mailgun_api = process.env.MAILGUN_PRIVATE_API || '';
const mailgun_domain = process.env.MAILGUN_DOMAIN || '';
const mailgun_address = process.env.MAILGUN_ADDRESS || '';

const codeHandler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;
    console.log(email);

    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }

    const connection = mysql.createConnection(dbConfig);

    try {

        const checkEmailQuery = `SELECT * FROM verification WHERE email = ? AND code IS NOT NULL AND expiration_date > NOW()`;
        connection.query(checkEmailQuery, [email], (error: mysql.MysqlError | null, results: any[]) => {
            if (error) {
                console.error('Error checking email:', error);
                connection.end();
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Generate a new verification code
            const newVerificationCode = generateVerificationCode();

            // Update the email table with the new verification code and expiration date
            const updateEmailQuery = `
                UPDATE verification
                SET code = ?, expiration_date = NOW() + INTERVAL 10 MINUTE
                WHERE email = ?
                `;

            connection.query(updateEmailQuery, [newVerificationCode, email], async (error: mysql.MysqlError | null) => {
                connection.end();
                if (error) {
                    console.error('Error updating verification code:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                await sendVerificationEmail(email, newVerificationCode);
                console.log(`Verification code sent to ${email}`);

                // Send the new verification code to the user's email
                // You can implement the email sending logic here, similar to the sendVerificationEmail function in the previous code
                // For simplicity, we'll just return the new verification code in the response
                return res.status(200).json({
                    message: 'Code Generated Successfully'
                });
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
    return Math.floor(100000 + Math.random() * 900000);
};

// Function to send the verification email
const sendVerificationEmail = async (email: string, verificationCode: number) => {
    try {
        const mailgun = new Mailgun(formData);
        console.log(mailgun_api);
        const mg = mailgun.client({ username: 'api', key: mailgun_api });

        const mailData = {
            from: mailgun_address, // Replace with your sender email address
            to: email,
            subject: 'Email Verification Code - taroj.poyo.jp',
            text: `Your verification code is: ${verificationCode}`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
                    <h2 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Email Verification Code</h2>
                    <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                    <div style="background-color: #FFFFFF; border-radius: 8px; padding: 10px 20px; margin-top: 10px; display: inline-block;">
                        <code style="font-size: 20px; font-weight: bold; color: #4F46E5;">${verificationCode}</code>
                    </div>
                </div>
            `,
        };

        // Send the email through the Mailgun API
        mg.messages
            .create(mailgun_domain, mailData)
            .then(() => {
                console.log('Verification email sent successfully.');

                // Insert the verification code into the "email" table
                const connection = mysql.createConnection(dbConfig);

                const insertVerificationCodeQuery = `
                    INSERT INTO verification (email, code, expiration_date)
                    VALUES (?, ?, NOW() + INTERVAL 10 MINUTE)
                `;

                const params = [email, verificationCode];

                connection.query(insertVerificationCodeQuery, params, (error: mysql.MysqlError | null, result: mysql.OkPacket) => {
                    if (error) {
                        console.error('Error inserting verification code:', error);
                        throw new Error('Failed to insert verification code');
                    }
                    console.log('Verification code inserted into the email table.');
                });
            })
            .catch((error) => {
                console.error('Error sending verification email:', error);
                throw new Error('Failed to send verification email');
            });
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

export default codeHandler;
