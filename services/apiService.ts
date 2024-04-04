import axios, { AxiosResponse } from 'axios';

interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

const AUTH_ENDPOINT = 'https://api.petfinder.com/v2/oauth2/token';

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
        return access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
        return null;
    }
};

export default getAccessToken;
