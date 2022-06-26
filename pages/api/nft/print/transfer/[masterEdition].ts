// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft, PrintNewEditionOutput } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import { adminWallet, AuthorizationFailure, connection, metaplex, signable_metaplex } from "../../../constants";
import { transferAdminNftTransaction } from '../../../../../library/nft/transfer';
import { basicAuthMiddleware } from '../../../../../utils/middleware';

type Data = {
    success: boolean,
    message: string,
    nft: Nft,
    error?: string
}

// example POST:
// api/nft/print/transfer/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// { to: 6k7PDpk7QsRJQAspUvFiaDCoe5GQDe96vmWx1L3Gy39H }
// creates a print NFT (copy) of the provided master NFT and transfers it to a new owner
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AuthorizationFailure>
) {
    const { query: { masterEdition }, body: { to }, method } = req;
    const masterEditionKey = new PublicKey(masterEdition);
    switch (method) {
        case 'POST':
            const authorized = basicAuthMiddleware(req);
            if (authorized) {
                // TODO: atomically mint the print NFT & transfer it to the new owner, to prevent excess prints
                const printNft: any = await signable_metaplex.nfts().printNewEdition(masterEditionKey);
                const tx = await transferAdminNftTransaction(printNft.nft.mint, new PublicKey(to));
                sendAndConfirmTransaction(connection, tx, [adminWallet]);

                res.status(200).json({ success: true, message: `Minted ${printNft.nft.mint} to ${to}`, nft: printNft });
            } else {
                res.status(401).json({ message: 'Authorization Failed', error: 'Invalid authorization' });
            }
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
