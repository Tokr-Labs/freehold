import {NextApiResponse} from "next";
import {PublicKey} from "@solana/web3.js";
import {corsMiddleware} from "../../utils/middleware";
import {getProfilePicture, ProfilePicture} from "@solflare-wallet/pfp";
import {GetPfpRequest} from "./_requests";
import {MissingArgsResponse, methodNotAllowedResponse} from "./_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../utils/get-connection";

export default async function handler(
    req: GetPfpRequest,
    res: NextApiResponse
){
    // CORS
    await corsMiddleware(["GET"], req, res)

    switch (req.method) {

        case "GET":
            return get(req, res)

        default:
            methodNotAllowedResponse(res, req.method, ["GET"])

    }

}

async function get(
    req: GetPfpRequest,
    res: NextApiResponse<ProfilePicture | MissingArgsResponse>
) {

    const user = req.query.user
    const network = req.query.network

    const connection = getConnection(network)

    if (!user) {
        const responseBody: MissingArgsResponse = {
            args: ["user"],
            error: "Must specify the user's publickey"
        }
        return res.status(StatusCodes.BAD_REQUEST).json(responseBody);
    }

    const pfp = await getProfilePicture(
        connection,
        new PublicKey(user)
    )

    return res.status(StatusCodes.OK).json(pfp)

}