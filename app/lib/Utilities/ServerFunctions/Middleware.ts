import jwt from 'jsonwebtoken';
import ErrorCodes from "~/lib/json/errorCodes.json";
import { ServerFunctions } from "~/lib/Utilities/init"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const authenticateToken = async (request : Request) : Promise<ServerFunctions.Authentication.UserAccessParameters> => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        throw Response.json({ error: 'Unauthorized' }, { status: ErrorCodes.UNAUTHORIZED });
    }

    try {
        const user = jwt.verify(token, ACCESS_TOKEN_SECRET) as ServerFunctions.Authentication.UserAccessParameters;
        return user;
    } catch (err) {
        throw Response.json({ error: 'Forbidden' }, { status: ErrorCodes.FORBIDDEN });
    }
};