// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiResponse} from "next";
import {Nft} from "@metaplex-foundation/js";
import {PublicKey, sendAndConfirmTransaction} from "@solana/web3.js";
import {adminWallet, AUTHORIZATION_FAILED, signable_metaplex} from "../../_constants";
import {basicAuthMiddleware, corsMiddleware} from "../../../../utils/middleware";
import {transferAdminNftTransaction} from "../../../../library/nft/transfer";
import {GetPrintNftRequest, PostPrintNftRequest} from "../../_requests";
import {AuthorizationFailureResponse, PrintNftResponse} from "../../_responses";
import {StatusCodes} from "http-status-codes";
import {getConnection} from "../../../../utils/get-connection";
import {getMetaplex} from "../../../../utils/get-metaplex";

// example POST:
// api/nft/print/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// creates a print NFT (copy) of the provided master NFT
export default async function handler(
    req: GetPrintNftRequest | PostPrintNftRequest,
    res: NextApiResponse
) {
    await corsMiddleware(["GET", "POST"], req, res)

    switch (req.method) {

        case "GET":
            return get(req, res)

        case "POST":
            return post(req, res)

        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${req.method} Not Allowed`);

    }

}

async function get(
    req: GetPrintNftRequest,
    res: NextApiResponse<PrintNftResponse | AuthorizationFailureResponse>
) {

    const masterEdition = req.query.masterEdition

    const mx = getMetaplex()

    // @TODO: this route should actually return all print editions
    const nft: Nft = await mx.nfts()
        .findByMint(new PublicKey(masterEdition));

    const responseBody: PrintNftResponse = {
        masterEdition,
        nft
    }
    return res.status(StatusCodes.OK).json(responseBody);

}

async function post(
    req: PostPrintNftRequest,
    res: NextApiResponse<PrintNftResponse | AuthorizationFailureResponse>
) {

    const masterEdition = req.query.masterEdition
    const to = req.query.to

    const connection = getConnection()

    const authorized = basicAuthMiddleware(req);
    if (!authorized) {
        return res.status(StatusCodes.UNAUTHORIZED).json(AUTHORIZATION_FAILED);
    }

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
