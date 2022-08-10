import type {NextApiResponse} from "next";
import {PublicKey, sendAndConfirmTransaction} from "@solana/web3.js";
import {adminWallet, AUTHORIZATION_FAILED, signable_metaplex} from "../../_constants";
import {basicAuthMiddleware, corsMiddleware} from "../../../../utils/middleware";
import {transferAdminNftTransaction} from "../../../../library/nft/transfer";
import {PostPrintNftRequest} from "../../_requests";
import {AuthorizationFailureResponse, methodNotAllowedResponse, PrintNftResponse} from "../../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../../utils/get-connection";

export default async function handler(
    req: PostPrintNftRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["GET", "POST"], req, res)

    switch (req.method) {

        case "POST":
            return basicAuthMiddleware(req)
                ? post(req, res)
                : res.status(StatusCodes.UNAUTHORIZED).json(AUTHORIZATION_FAILED)

        default:
            methodNotAllowedResponse(res, req.method, ["GET", "POST"])

    }

}

async function post(
    req: PostPrintNftRequest,
    res: NextApiResponse<PrintNftResponse | AuthorizationFailureResponse>
) {

    const masterEdition = req.query.masterEdition
    const to = req.query.to

    const connection = getConnection()

    const printNft: any = await signable_metaplex.nfts()
        .printNewEdition(new PublicKey(masterEdition));

    // TODO - better error handling
    if (to) {
        const tx = await transferAdminNftTransaction(
            printNft.nft.mint,
            new PublicKey(to)
        );

        await sendAndConfirmTransaction(
            connection,
            tx,
            [adminWallet]
        );

        const responseBody: PrintNftResponse = {
            masterEdition,
            nft: printNft,
            success: true,
            message: `Minted ${printNft.nft.mint} to ${to}`
        }

        return res.status(StatusCodes.OK).json(responseBody);
    }

    return res.status(StatusCodes.OK).json({masterEdition, nft: printNft});


}
