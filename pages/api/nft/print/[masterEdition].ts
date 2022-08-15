import type {NextApiResponse} from "next";
import {PublicKey} from "@solana/web3.js";
import {basicAuthMiddleware, corsMiddleware} from "../../../../utils/middleware";
import {PostPrintNftRequest} from "../../_requests";
import {
    AuthorizationFailureResponse,
    methodNotAllowedResponse,
    PrintNftResponse,
    unauthorizedResponse
} from "../../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../../utils/get-connection";
import {getAdminMetaplex} from "../../../../utils/get-admin-metaplex";
import {Nft} from "@metaplex-foundation/js";

export default async function handler(
    req: PostPrintNftRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["GET", "POST"], req, res)

    switch (req.method) {

        case "POST":
            return basicAuthMiddleware(req)
                ? post(req, res)
                : unauthorizedResponse(res)

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
    const adminMetaplex = getAdminMetaplex(connection)

    // TODO - better error handling
    const toAddress = to ? new PublicKey(to) : adminMetaplex.identity().publicKey

    const masterEditionNft: Nft = await adminMetaplex.nfts()
        .findByMint(new PublicKey(masterEdition))
        .run()

    const printNft = await adminMetaplex.nfts()
        .printNewEdition(masterEditionNft.address, {
            newUpdateAuthority: masterEditionNft.updateAuthorityAddress,
            newOwner: toAddress
        })
        .run()

    const responseBody: PrintNftResponse = {
        masterEdition,
        nft: printNft.nft,
        success: true,
        message: `Minted ${printNft.nft.address} to ${to}`
    }

    return res.status(StatusCodes.OK).json(responseBody);

}
