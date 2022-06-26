import {NextApiRequest, NextApiResponse} from "next";
import {getSolanaConnection} from "./util";
import {PublicKey, Signer} from "@solana/web3.js";
import {getAssociatedTokenAddress} from "@solana/spl-token";
import {corsMiddleware} from "../../utils/middleware";
import {createSetProfilePictureTransaction, getProfilePicture} from "@solflare-wallet/pfp";
import * as bs58 from "bs58";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const { query: {user}, method } = req
    const network = req.query.network as string;

    const connection = getSolanaConnection(network);

    // CORS
    await corsMiddleware(["GET"], req, res)

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
        // create a transaction for setting a PFP on solflare's pfp-program
        // the transaction is encoded in base58 and returned to the client
        case "POST":
            let { body: { owner, mint } } = req;
            owner = new PublicKey(owner);
            mint = new PublicKey(mint);

            const tokenAta = await getAssociatedTokenAddress(mint, owner)
            const tx = await createSetProfilePictureTransaction(owner, mint, tokenAta);
            
            // need to be set otherwise serialization fails
            tx.feePayer = owner;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            
            let tx_serialized = bs58.encode(tx.serializeMessage());
            res.status(200).json({ tx_serialized });
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);

    }

}