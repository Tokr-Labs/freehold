import {GetCreatedNftsRequest} from "../_requests";
import {NextApiResponse} from "next";
import {corsMiddleware} from "../../../utils/middleware";
import {CreatedNftsResponse, methodNotAllowedResponse, MissingArgsResponse} from "../_responses";
import {getConnection} from "../../../utils/get-connection";
import {getMetaplex} from "../../../utils/get-metaplex";
import {StatusCodes} from "http-status-codes";
import {Metadata, Nft} from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";

export default async function handler(
    req: GetCreatedNftsRequest,
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

// TODO - lots of duplicated code
async function get(
    req: GetCreatedNftsRequest,
    res: NextApiResponse<CreatedNftsResponse | MissingArgsResponse>
){

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
        .findAllByCreator(new PublicKey(user))
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

    const responseBody: CreatedNftsResponse = {
        user,
        nfts: metadata === "true" ? loadedNfts : nfts
    }
    return res.status(StatusCodes.OK).json(responseBody);

}
