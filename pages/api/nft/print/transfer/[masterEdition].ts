// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft, PrintNewEditionOutput } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import { adminWallet, connection, metaplex, signable_metaplex } from "../../../constants";
import { transferAdminNftTransaction } from '../../../../../library/nft/transfer';

type Data = {
    success: boolean,
    message: string,
    nft: Nft,
    error?: string
}

// example POST:
// api/nft/print/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// creates a print NFT (copy) of the provided master NFT
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { query: { masterEdition }, body: { to }, method } = req;
    const masterEditionKey = new PublicKey(masterEdition);
    switch (method) {
        case 'POST':
            // @TODO: perform security checks as priveleged users will be spending admin SOL to mint the prints
            const printNft: any = await signable_metaplex.nfts().printNewEdition(masterEditionKey);
            const tx = await transferAdminNftTransaction(printNft.nft.mint, new PublicKey(to));
            sendAndConfirmTransaction(connection, tx, [adminWallet]);

            res.status(200).json({ success: true, message: `Minted ${printNft.nft.mint} to ${to}`, nft: printNft });
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
