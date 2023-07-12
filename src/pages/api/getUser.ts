import { NextApiRequest, NextApiResponse } from 'next';

const api_key = process.env.AUTH0_API_KEY;
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

        const response = await fetch(url, { headers });
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch profile data' });
    }
}
