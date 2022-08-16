import {Metadata, Nft} from "@metaplex-foundation/js";
import {NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";

export interface MissingArgsResponse {
    args: string[],
    error: string
}

export interface AuthorizationFailureResponse {
    message: string,
    error: string
}

export interface PrintNftResponse {
    masterEdition: string | string[],
    nft: Nft,
    success?: boolean,
    message?: string,
    error?: string
}

export interface OwnedNftsResponse {
    user: string,
    nfts: Nft[] | Metadata[],
    error?: string
}

export interface CreatedNftsResponse {
    user: string,
    nfts: Nft[] | Metadata[],
    error?: string
}

export const unauthorizedResponse = (
    res: NextApiResponse,
) => {
    const AUTHORIZATION_FAILED: AuthorizationFailureResponse = {
        message: "Authorization Failed",
        error: "Invalid authorization",
    }
    return res.status(StatusCodes.UNAUTHORIZED).json(AUTHORIZATION_FAILED)
}

export const methodNotAllowedResponse = (
    res: NextApiResponse,
    method: string | undefined,
    allowed: Array<string>
) => {

    res.setHeader("Allow", allowed);
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
    return res

}

