// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {Nft} from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
import {metaplex, MissingArgs} from "../_constants";
import {getMetaplex, getSolanaConnection} from '../_util';
import {corsMiddleware} from "../../../utils/middleware";
import {STATUS_CODES} from "http";
import {GetOwnedNftsRequest} from "../_requests";

type Data = {
    user: string,
    nfts: Nft[],
    error?: string
}

// example GET:
// api/nft/owned?user=3y1FhWu7XwyRxjfwqCD2JtuC9adf1dG4CSjijWb8iAMw
// optional `collection` query param for filtering by collection
export default async function handler(
    req: GetOwnedNftsRequest,
    res: NextApiResponse<Data | MissingArgs>
) {
    // query params -> variables
    const user = req.query.user
    const collection = req.query.collection
    const metadata = req.query.metadata
    const network = req.query.network

    // use specific network, if provided by the request. otherwise use the default
    const mx = network
        ? getMetaplex(getSolanaConnection(network))
        : metaplex;

    await corsMiddleware(["GET"], req, res)

    // handle the request -- fetching user's NFTs w/ optional collection filter
    switch (req.method) {

        case 'GET':
            // validate that a user was provided
            if (!user) {
                res.status(400).json({args: ["user"], error: "Must specify publickey (owner of NFTs to look-up)"});
                return;
            }

            // obtain user's list of metaplex NFTs
            let nfts: Nft[] = await mx.nfts().findAllByOwner(new PublicKey(user));

            // if a collection was provided, filter the list of NFTs for the collection
            if (collection) {
                nfts = nfts.filter(nft => nft.collection?.key.equals(new PublicKey(collection)));
            }

            if (metadata === 'true') {
                // fetch metadata for each NFT
                for (let i = 0; i < nfts.length; i++) {
                    await nfts[i].metadataTask.run().catch(console.error);
                }
            }

            res.status(200).json({user, nfts});
            break;

        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);

    }
}
