import {Nft} from "@metaplex-foundation/js";

export interface MissingArgsResponse {
    args: string[],
    error: string
}
export interface SuccessResponse {
    success: boolean
    message?: string
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
    nfts: Nft[],
    error?: string
}

