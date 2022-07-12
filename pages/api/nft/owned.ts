// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiResponse} from 'next';
import {Nft} from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
import {metaplex} from "../_constants";
import {corsMiddleware} from "../../../utils/middleware";
import {GetOwnedNftsRequest} from "../_requests";
import {MissingArgsResponse, OwnedNftsResponse} from "../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../utils/get-connection";
import {getMetaplex} from "../../../utils/get-metaplex";

// example GET:
// api/nft/owned?user=3y1FhWu7XwyRxjfwqCD2JtuC9adf1dG4CSjijWb8iAMw
// optional `collection` query param for filtering by collection
export default async function handler(
    req: GetOwnedNftsRequest,
    res: NextApiResponse<OwnedNftsResponse | MissingArgsResponse>
) {
    // query params -> variables
    const user = req.query.user
    const collection = req.query.collection
    const metadata = req.query.metadata
    const network = req.query.network

    // use specific network, if provided by the request. otherwise use the default
    const mx = network
        ? getMetaplex(getConnection(network))
        : metaplex;

    await corsMiddleware(["GET"], req, res)

    // handle the request -- fetching user's NFTs w/ optional collection filter
    switch (req.method) {

        case 'GET':
            // validate that a user was provided
            if (!user) {
                const responseBody: MissingArgsResponse = {
                    args: ["user"],
                    error: "Must specify the user's publickey"
                }
                res.status(StatusCodes.BAD_REQUEST).json(responseBody);
                break;
            }

            // obtain user's list of metaplex NFTs
            let nfts: Nft[] = await mx.nfts().findAllByOwner(new PublicKey(user));

            // if a collection was provided, filter the list of NFTs for the collection
            if (collection) {
                nfts = nfts.filter(nft => {
                    nft.collection?.key.equals(new PublicKey(collection))
                });
            }

            if (metadata === 'true') {
                // fetch metadata for each NFT
                for (let i = 0; i < nfts.length; i++) {
                    await nfts[i].metadataTask.run().catch(console.error);
                }
            }

            const responseBody: OwnedNftsResponse = {
                user,
                nfts
            }
            res.status(StatusCodes.OK).json(responseBody);
            break;

        default:
            res.setHeader('Allow', ['GET']);
            res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);

    }
}
