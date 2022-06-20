// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft, PrintNewEditionOutput } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { metaplex, signable_metaplex } from "../../constants";

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
    res: NextApiResponse<Data>
) {
    const { query: { masterEdition }, method } = req;
    const masterEditionKey = new PublicKey(masterEdition);
    switch (method) {
        case 'GET':
            // @TODO: this route should actually return all print editions
            // we may need to crawl the chain, or use `findAllByCreator(adminWallet)`
            const nft: Nft = await metaplex.nfts().findByMint(masterEditionKey);
            res.status(200).json({ masterEdition, nft });
            break;
        case 'POST':
            // @TODO: perform security checks as priveleged users will be spending admin SOL to mint the prints
            const printNft: any = await signable_metaplex.nfts().printNewEdition(masterEditionKey);
            res.status(200).json({ masterEdition, nft: printNft });
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
