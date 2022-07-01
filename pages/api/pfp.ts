import {NextApiResponse} from "next";
import {getSolanaConnection} from "./_util";
import {PublicKey} from "@solana/web3.js";
import {corsMiddleware} from "../../utils/middleware";
import {getProfilePicture, ProfilePicture} from "@solflare-wallet/pfp";
import {GetPfpRequest} from "./_requests";
import {MissingArgsResponse} from "./_responses";

export default async function handler(
    req: GetPfpRequest,
    res: NextApiResponse<ProfilePicture | MissingArgsResponse>
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
                const responseBody: MissingArgsResponse = {
                    args: ["user"],
                    error: "Must specify the user's publickey"
                }
                res.status(400).json(responseBody);
                break;
            }

            const pfp = await getProfilePicture(
                connection,
                new PublicKey(user)
            )

            res.status(200).json(pfp)
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);

    }

}