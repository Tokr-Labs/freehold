// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { connection, metaplex, adminWallet, Success, AuthorizationFailure, AUTHORIZATION_FAILED } from "../constants";
import { transferAdminNftTransaction } from '../../../library/nft/transfer';
import {basicAuthMiddleware, corsMiddleware} from '../../../utils/middleware';


// example POST:
// api/nft/transfer {token: GPKoJbgqY1NgH3bxmGFvoLq3GL39RKqEtCqEDttTNYFU, to: 6k7PDpk7QsRJQAspUvFiaDCoe5GQDe96vmWx1L3Gy39H}
// transfer a print NFT to a new owner
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Success | AuthorizationFailure>
) {
    const { body: { token, to }, method } = req;

    await corsMiddleware(["POST"], req, res)

    switch (method) {
        case 'POST':
            const authorized = basicAuthMiddleware(req);
            if (authorized){
                // obtain NFT to transfer
                const nft: Nft = await metaplex.nfts().findByMint(new PublicKey(token));

                // construct tx for transferring it to the destination
                const tx: Transaction = await transferAdminNftTransaction(nft.mint, new PublicKey(to));

                // sign transaction with admin wallet & send it
                await sendAndConfirmTransaction(connection, tx, [adminWallet]);
                res.status(200).json({
                    success: true,
                    message: `Successfully transferred ${nft.mint} to ${to}`
                });
            } else {
                res.status(401).json(AUTHORIZATION_FAILED);
            }
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
