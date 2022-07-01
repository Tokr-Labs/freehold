// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { connection, metaplex, adminWallet, Success, AuthorizationFailure, AUTHORIZATION_FAILED } from "../_constants";
import { transferAdminNftTransaction } from '../../../library/nft/transfer';
import {basicAuthMiddleware, corsMiddleware} from '../../../utils/middleware';
import {PostTransferRequest} from "../_requests";


// example POST:
// api/nft/transfer {token: GPKoJbgqY1NgH3bxmGFvoLq3GL39RKqEtCqEDttTNYFU, to: 6k7PDpk7QsRJQAspUvFiaDCoe5GQDe96vmWx1L3Gy39H}
// transfer a print NFT to a new owner
export default async function handler(
    req: PostTransferRequest,
    res: NextApiResponse<Success | AuthorizationFailure>
) {
    // query params -> variables
    const token = req.query.token
    const to = req.query.to

    await corsMiddleware(["POST"], req, res)

    switch (req.method) {

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
            res.status(405).end(`Method ${req.method} Not Allowed`);

    }

}
