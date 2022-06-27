// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { AuthorizationFailure, AUTHORIZATION_FAILED, metaplex, signable_metaplex } from "../../constants";
import {basicAuthMiddleware, corsMiddleware} from '../../../../utils/middleware';

type Data = {
    masterEdition: string | string[],
    nft: Nft,
    error?: string
}

// example POST:
// api/nft/print/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// creates a print NFT (copy) of the provided master NFT
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AuthorizationFailure>
) {
    const { query: { masterEdition }, method } = req;
    const masterEditionKey = new PublicKey(masterEdition);

    await corsMiddleware(["GET", "POST"], req, res)

    switch (method) {

        case 'GET':
            // @TODO: this route should actually return all print editions
            // we may need to crawl the chain, or use `findAllByCreator(adminWallet)`
            const nft: Nft = await metaplex.nfts().findByMint(masterEditionKey);
            res.status(200).json({ masterEdition, nft });
            break;

        case 'POST':
            const authorized = basicAuthMiddleware(req);

            if (authorized){
                const printNft: any = await signable_metaplex.nfts().printNewEdition(masterEditionKey);
                res.status(200).json({ masterEdition, nft: printNft });
            } else {
                res.status(401).json(AUTHORIZATION_FAILED);
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
