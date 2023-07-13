import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import request from 'request';

const client_id = process.env.AUTH0_CLIENT_ID_TOKEN;
const client_secret = process.env.AUTH0_CLIENT_SECRET_TOKEN;

const settingsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { imageLink, userId } = req.body;
    console.log(imageLink, userId);

    try {
        const options = {
            method: 'POST',
            url: 'https://poyo.jp.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: `{"client_id":"${client_id}","client_secret":"${client_secret}","audience":"https://poyo.jp.auth0.com/api/v2/","grant_type":"client_credentials"}`,
        };

        request(options, async function (error, response: any, body) {
            if (error) throw new Error(error);

            const api_key = JSON.parse(body).access_token;

            // Send change picture request
            const changePictureOptions = {
                method: 'PATCH',
                url: `https://poyo.jp.auth0.com/api/v2/users/${encodeURIComponent(
                    userId
                )}`,
                headers: {
                    authorization: `Bearer ${api_key}`,
                    'content-type': 'application/json',
                },
                data: {
                    user_metadata: { picture: `${imageLink}` },
                },
            };

            axios(changePictureOptions)
                .then((changePictureResponse) => {
                    // Handle the response from the Auth0 API
                    res.status(200).json({
                        message: 'Profile picture updated successfully',
                    });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({
                        error: 'Failed to update profile picture',
                    });
                });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default settingsHandler;
