import {NextApiRequest, NextApiResponse} from "next";
import {getSolanaConnection} from "./util";
import {PublicKey} from "@solana/web3.js";
import {runMiddleware} from "../../utils/run-middleware";
import {getProfilePicture} from "@solflare-wallet/pfp";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const { query: {user}, method } = req
    const network = req.query.network as string;

    const connection = getSolanaConnection(network);

    // CORS
    await runMiddleware(["GET"], req, res)

    switch (method) {

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
            res.status(405).end(`Method ${method} Not Allowed`);

    }

}