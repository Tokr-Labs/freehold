// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Metaplex, Nft } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { metaplex, MissingArgs } from "../constants";

type Data = {
    user: string,
    nfts: Nft[],
    error?: string
}

// example GET:
// api/nft/owned?publickey=3y1FhWu7XwyRxjfwqCD2JtuC9adf1dG4CSjijWb8iAMw
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | MissingArgs>
) {
    const { query: { publickey } } = req;
    if (!publickey) {
        res.status(400).json({ args: ["publickey"], error: "Must specify publickey (owner of NFTs to look-up)" });
        return;
    }

    const nfts: Nft[] = await metaplex.nfts().findAllByOwner(new PublicKey(publickey));

    res.status(200).json({ user: publickey as string, nfts });
}
