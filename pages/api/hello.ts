// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { basicAuthMiddleware } from '../../utils/middleware';
import { adminWallet, AuthorizationFailure, AUTHORIZATION_FAILED, connection } from './constants';

type Data = {
    public_key: string,
    rpc_url: string,
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AuthorizationFailure>
) {
    const authorized = basicAuthMiddleware(req);
    if (authorized) {
        res.status(200).json({
            public_key: adminWallet.publicKey.toBase58(),
            rpc_url: connection.rpcEndpoint,
        });
    } else {
        res.status(401).json(AUTHORIZATION_FAILED)
    }
}
