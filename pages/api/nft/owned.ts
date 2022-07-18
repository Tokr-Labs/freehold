// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiResponse} from "next";
import {Nft} from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
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
    res: NextApiResponse
) {
    await corsMiddleware(["GET"], req, res)

    switch (req.method) {

        case "GET":
            return get(req, res)

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);

    }
}

async function get(
    req: GetOwnedNftsRequest,
    res: NextApiResponse<OwnedNftsResponse | MissingArgsResponse>
) {

    const user = req.query.user
    const collection = req.query.collection
    const metadata = req.query.metadata
    const network = req.query.network

    const connection = getConnection(network)
    const mx = getMetaplex(connection);

    // validate that a user was provided
    if (!user) {
        const responseBody: MissingArgsResponse = {
            args: ["user"],
            error: "Must specify the user's publickey"
        }
        return res.status(StatusCodes.BAD_REQUEST).json(responseBody);
    }

    // obtain user"s list of metaplex NFTs
    let nfts: Nft[] = await mx.nfts().findAllByOwner(new PublicKey(user));

    // if a collection was provided, filter the list of NFTs for the collection
    if (collection) {
        nfts = nfts.filter(nft => {
            nft.collection?.key.equals(new PublicKey(collection))
        });
    }

    if (metadata === "true") {
        // fetch metadata for each NFT
        for (const nft of nfts) {
            await nft.metadataTask.run().catch(console.error);
        }
    }

    const responseBody: OwnedNftsResponse = {
        user,
        nfts
    }
    return res.status(StatusCodes.OK).json(responseBody);

}
