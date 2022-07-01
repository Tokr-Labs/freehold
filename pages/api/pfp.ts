import {NextApiRequest, NextApiResponse} from "next";
import {getSolanaConnection} from "./_util";
import {PublicKey} from "@solana/web3.js";
import {corsMiddleware} from "../../utils/middleware";
import {getProfilePicture} from "@solflare-wallet/pfp";
import {GetPfpRequest} from "./_requests";

export default async function handler(
    req: GetPfpRequest,
    res: NextApiResponse
){
    // query params -> variables
    const user = req.query.user
    const network= req.query.network

    const connection = getSolanaConnection(network);

    // CORS
    await corsMiddleware(["GET"], req, res)

    switch (req.method) {

        case "GET":

            if (!user) {
                res.status(400).json({
                    args: ["user"],
                    error: "Must specify user's publickey"
                });
                return;
            }

            const pfp = await getProfilePicture(connection, new PublicKey(user))

            res.status(200).json(pfp)
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);

    }

}