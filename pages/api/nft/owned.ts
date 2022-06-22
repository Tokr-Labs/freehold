// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { metaplex, MissingArgs } from "../constants";

type Data = {
    user: string,
    nfts: Nft[],
    error?: string
}

// example GET:
// api/nft/owned?user=3y1FhWu7XwyRxjfwqCD2JtuC9adf1dG4CSjijWb8iAMw
// optional `collection` query param for filtering by collection
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | MissingArgs>
) {
    const { query: { user, collection }, method } = req;
    switch (method) {
        case 'GET':
            // validate that a user was provided
            if (!user) {
                res.status(400).json({ args: ["user"], error: "Must specify publickey (owner of NFTs to look-up)" });
                return;
            }
            
            // obtain user's list of metaplex NFTs
            var nfts: Nft[] = await metaplex.nfts().findAllByOwner(new PublicKey(user));
            
            // if a collection was provided, filter the list of NFTs for the collection
            if (collection) {
                nfts = nfts.filter(nft => { return nft.collection?.key.equals(new PublicKey(collection)) });
            }

            // fetch metadata for each NFT
            for (let i = 0; i < nfts.length; i++) {
                await nfts[i].metadataTask.run();
            }

            res.status(200).json({ user: user as string, nfts });
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
