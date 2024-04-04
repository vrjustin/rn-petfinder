import axios, { AxiosResponse } from 'axios';

interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let jwt_access_token: string | null = null;

const AUTH_ENDPOINT = 'https://api.petfinder.com/v2/oauth2/token';
const TYPES_ENDPOINT = 'https://api.petfinder.com/v2/types';

const getAccessToken = async (): Promise<string | null> => {
    try {
        const response: AxiosResponse<AccessTokenResponse> = await axios.post(
            AUTH_ENDPOINT,
            {
                grant_type: 'client_credentials',
                client_id: process.env.CLIENT_ID!,
                client_secret: process.env.CLIENT_SECRET!,
            },
        );

        const { access_token } = response.data;
        // You can store the access_token for future use here
        jwt_access_token = access_token;
        return access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
        return null;
    }
};

const getPetTypes = async (): Promise<any> => {
    if (!jwt_access_token) {
        await getAccessToken();
    }

    try {
        const response: AxiosResponse<any> = await axios.get(TYPES_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${jwt_access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to get pet types:', error);
        return [];
    }
};

export default getPetTypes;
