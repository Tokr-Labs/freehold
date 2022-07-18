// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiResponse} from "next";
import {Nft} from "@metaplex-foundation/js";
import {PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import {adminWallet, AUTHORIZATION_FAILED} from "../_constants";
import {transferAdminNftTransaction} from "../../../library/nft/transfer";
import {basicAuthMiddleware, corsMiddleware} from "../../../utils/middleware";
import {PostTransferRequest} from "../_requests";
import {AuthorizationFailureResponse, SuccessResponse} from "../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../utils/get-connection";
import {getMetaplex} from "../../../utils/get-metaplex";


// example POST:
// api/nft/transfer {token: GPKoJbgqY1NgH3bxmGFvoLq3GL39RKqEtCqEDttTNYFU, to: 6k7PDpk7QsRJQAspUvFiaDCoe5GQDe96vmWx1L3Gy39H}
// transfer a print NFT to a new owner
export default async function handler(
    req: PostTransferRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["POST"], req, res)

    switch (req.method) {

        case "POST":
            return post(req, res)

        default:
            res.setHeader("Allow", ["POST"]);
            res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);

    }

}

async function post(
    req: PostTransferRequest,
    res: NextApiResponse<SuccessResponse | AuthorizationFailureResponse>
) {

    const token = req.query.token
    const to = req.query.to

    const connection = getConnection()
    const mx = getMetaplex()

    const authorized = basicAuthMiddleware(req);
    if (!authorized) {
        return res.status(StatusCodes.UNAUTHORIZED).json(AUTHORIZATION_FAILED);
    }

    // obtain NFT to transfer
    const nft: Nft = await mx.nfts().findByMint(new PublicKey(token));

    // construct tx for transferring it to the destination
    const tx: Transaction = await transferAdminNftTransaction(
        nft.mint,
        new PublicKey(to)
    );

    // sign transaction with admin wallet & send it
    await sendAndConfirmTransaction(
        connection,
        tx,
        [adminWallet]
    );

    const responseBody: SuccessResponse = {
        success: true,
        message: `Successfully transferred ${nft.mint} to ${to}`
    }
    return res.status(StatusCodes.OK).json(responseBody);

}
