import {NextApiRequest} from "next";

export interface GetOwnedNftsRequest extends NextApiRequest {
    query: {
        user: string,
        collection?: string,
        metadata?: string,
        editionInfo?: string,
        network?: string
    };
}

export interface GetPfpRequest extends NextApiRequest {
    query: {
        user: string,
        network?: string
    }
}

export interface PostPrintNftRequest extends NextApiRequest {
    query: {
        masterEdition: string,
        to?: string
    }
}
