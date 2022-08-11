// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiResponse} from "next";
import {Metadata, Nft} from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
import {corsMiddleware} from "../../../utils/middleware";
import {GetOwnedNftsRequest} from "../_requests";
import {methodNotAllowedResponse, MissingArgsResponse, OwnedNftsResponse} from "../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../utils/get-connection";
import {getMetaplex} from "../../../utils/get-metaplex";

export default async function handler(
    req: GetOwnedNftsRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["GET"], req, res)

    switch (req.method) {

        case "GET":
            return get(req, res)

        default:
            methodNotAllowedResponse(res, req.method, ["GET"])

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

    // fetching NFTs without json, edition, or mint info loaded
    let nfts: Metadata[] = await mx.nfts()
        .findAllByOwner(new PublicKey(user))
        .run()

    // if a collection was provided, filter the list of NFTs for the collection
    if (collection) {
        nfts = nfts.filter(nft => {
            return nft.collection?.address.equals(new PublicKey(collection))
        });
    }

    // if requested, loading the json, edition, and mint info
    let loadedNfts: Nft[] = []
    if (metadata === "true") {
        for (const nft of nfts) {
            let loaded = await mx.nfts().load(nft).run()
            loadedNfts.push(loaded)
        }
    }

    const responseBody: OwnedNftsResponse = {
        user,
        nfts: metadata === "true" ? loadedNfts : nfts
    }
    return res.status(StatusCodes.OK).json(responseBody);

}
