import type {NextApiResponse} from "next";
import {Nft} from "@metaplex-foundation/js";
import {PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import {transferAdminNftTransaction} from "../../../library/nft/transfer";
import {basicAuthMiddleware, corsMiddleware} from "../../../utils/middleware";
import {PostTransferRequest} from "../_requests";
import {
    AuthorizationFailureResponse,
    methodNotAllowedResponse,
    SuccessResponse,
    unauthorizedResponse
} from "../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../utils/get-connection";
import {getMetaplex} from "../../../utils/get-metaplex";
import {adminWallet} from "../../../utils/constants";

export default async function handler(
    req: PostTransferRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["POST"], req, res)

    switch (req.method) {

        case "POST":
            return basicAuthMiddleware(req)
                ? post(req, res)
                : unauthorizedResponse(res)

        default:
            methodNotAllowedResponse(res, req.method, ["POST"])

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

    // obtain NFT to transfer
    const nft: Nft = await mx.nfts()
        .findByMint(new PublicKey(token))
        .run()

    // construct tx for transferring it to the destination
    const tx: Transaction = await transferAdminNftTransaction(
        nft.address,
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
        message: `Successfully transferred ${nft.address} to ${to}`
    }
    return res.status(StatusCodes.OK).json(responseBody);

}
