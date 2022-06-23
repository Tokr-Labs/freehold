// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { metaplex, MissingArgs } from "../constants";
import { getMetaplex, getSolanaConnection } from '../util';
import {runMiddleware} from "../../../utils/run-middleware";

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
    // parse query params into variables
    const { query: { user, collection }, method } = req;
    const metadata: boolean = req.query.metadata === 'true';
    const network = req.query.network as string;

    // use specific network, if provided by the request. otherwise use the default
    const mx = network ? getMetaplex(getSolanaConnection(network)) : metaplex;

    await runMiddleware(["GET"], req, res)
    
    // handle the request -- fetching user's NFTs w/ optional collection filter
    switch (method) {
        case 'GET':
            // validate that a user was provided
            if (!user) {
                res.status(400).json({ args: ["user"], error: "Must specify publickey (owner of NFTs to look-up)" });
                return;
            }
            
            // obtain user's list of metaplex NFTs
            let nfts: Nft[] = await mx.nfts().findAllByOwner(new PublicKey(user));

            // if a collection was provided, filter the list of NFTs for the collection
            if (collection) {
                nfts = nfts.filter(nft => { return nft.collection?.key.equals(new PublicKey(collection)) });
            }

            if (metadata) {
                // fetch metadata for each NFT
                for (let i = 0; i < nfts.length; i++) {
                    await nfts[i].metadataTask.run();
                }
            }

            res.status(200).json({ user: user as string, nfts });
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
