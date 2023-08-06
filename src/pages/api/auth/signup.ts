import { NextApiHandler } from 'next';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import gravatarUrl from 'gravatar-url';
import Filter from 'bad-words';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const filter = new Filter();
const dbConfig = process.env.DATABASE_URL || '';
const mailgun_api = process.env.MAILGUN_PRIVATE_API || '';
const mailgun_domain = process.env.MAILGUN_DOMAIN || '';
const mailgun_address = process.env.MAILGUN_ADDRESS || '';

const signupHandler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (filter.isProfane(email) || filter.isProfane(username) || filter.isProfane(password)) {
        return res.status(400).json({ error: 'Please avoid using inappropriate language' });
    }

    // Additional state variables for password validation
    let isPasswordValid = true;
    let passwordValidationMessage = '';

    const validatePassword = (password: string) => {
        // Check if the password contains the email or username
        if (password.includes(email) || password.includes(username)) {
            isPasswordValid = false;
            passwordValidationMessage = 'Password cannot contain email or username';
            return;
        }

        // Check if the password is at least 8 characters long
        if (password.length < 8) {
            isPasswordValid = false;
            passwordValidationMessage = 'Password must be at least 8 characters long';
            return;
        }

        // Check if the password contains at least one uppercase letter, one lowercase letter, and one digit
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!password.match(passwordRegex)) {
            isPasswordValid = false;
            passwordValidationMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one digit';
            return;
        }

        isPasswordValid = true;
        passwordValidationMessage = '';
    };

    validatePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({ error: passwordValidationMessage });
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
                email VARCHAR(255) NOT NULL UNIQUE,
                verified BOOLEAN DEFAULT FALSE
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

        const createEmailTableQuery = `
            CREATE TABLE IF NOT EXISTS verification (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                code VARCHAR(32) NOT NULL,
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

                connection.query(createEmailTableQuery, async (error: mysql.MysqlError | null) => {
                    if (error) {
                        console.error('Error creating email table:', error);
                        throw new Error('Failed to create email table');
                    }

                    const checkExistingUserQuery = `
        SELECT id FROM users WHERE email = ? OR username = ?
    `;

                    const checkExistingUserParams = [email, username];

                    connection.query(checkExistingUserQuery, checkExistingUserParams, async (error: mysql.MysqlError | null, results: any[]) => {
                        if (error) {
                            console.error('Error checking existing user:', error);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        if (results.length > 0) {
                            // User with the same email or username already exists
                            return res.status(409).json({ error: 'User with this email or username already exists' });
                        }
                        // Hash the email, username, and password using bcrypt
                        const hashedPassword = await bcrypt.hash(password, 10);

                        const profile_picture = gravatarUrl(email, { size: 200, default: 'identicon' });

                        // Insert the user into the database
                        const insertUserQuery = `
                            INSERT INTO users (username, password, email, profile_picture)
                            VALUES (?, ?, ?, ?)
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

                                sendVerificationEmail(email);

                                // User and token insertion successful
                                return res.status(201).json({ message: 'User created successfully', token });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to send the verification email
const sendVerificationEmail = async (email: string) => {
    try {
        const verificationCode = generateVerificationCode(); // Generate a 6-digit verification code
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

// Function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default signupHandler;
