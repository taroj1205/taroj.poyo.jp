import { NextApiRequest, NextApiResponse } from 'next';
import request from 'request';

const base_url = process.env.AUTH0_ISSUER_BASE_URL;

interface ProfileData {
    email: string;
    username: string;
    picture: string;
    name: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ProfileData | { error: string }>
) {
    try {
        const options = {
            method: 'POST',
            url: 'https://poyo.jp.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: '{"client_id":"iuNeYwRJKZh3IO1jrAu69ztPE3o7AV9m","client_secret":"XefJ4_QS2gR2IptiooWSem6Y3qFu8-yvV60AU-SQ5BylRaAE6wTGTiQS-Bltq5fW","audience":"https://poyo.jp.auth0.com/api/v2/","grant_type":"client_credentials"}',
        };

        request(options, async function (error, response: any, body) {
            if (error) throw new Error(error);

            const api_key = JSON.parse(body).access_token;
            console.log(req.query);
            const userId = req.query.user as string;
            const fields = 'email,username,picture';
            const includeFields = true;
            const url = `${base_url}/api/v2/users/${userId}?fields=${encodeURIComponent(
                fields
            )}&include_fields=${encodeURIComponent(includeFields)}`;

            const headers = {
                Authorization: `Bearer ${api_key}`,
            };

            const responseData = await fetch(url, { headers });
            const data = await responseData.json();

            res.status(200).json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch profile data' });
    }
}
