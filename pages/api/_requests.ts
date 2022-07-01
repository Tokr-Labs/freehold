import {NextApiRequest} from "next";

export interface GetOwnedNftsRequest extends NextApiRequest {
    query: {
        user: string,
        collection?: string,
        metadata?: string,
        network?: string
    };
}

export interface GetPfpRequest extends NextApiRequest {
    query: {
        user: string,
        network?: string
    }
}

export interface GetPrintNft extends NextApiRequest {
    query: {
        masterEdition: string,
        to?: string
    }
}

export interface PostPrintNft extends NextApiRequest {
    query: {
        masterEdition: string,
        to?: string
    }
}

export interface PostTransferRequest extends NextApiRequest {
    query: {
        token: string,
        to: string
    }
}
