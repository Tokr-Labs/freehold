// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction, Transaction, TransactionInstruction } from "@solana/web3.js";
import { connection, metaplex, adminWallet } from "../constants";
import { getTokenTransferInstructions } from '../../library/nft/transfer';
import { getAssociatedTokenAddress } from '@solana/spl-token';

require("buffer");

type Data = {
    msg: string
}

// example POST:
// api/nft/print/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// creates a print NFT (copy) of the provided master NFT
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { body: { token, to }, method } = req;
    switch (method) {
        case 'POST':
            const nft: Nft = await metaplex.nfts().findByMint(new PublicKey(token));
            // @TODO: perform security checks as priveleged users will be spending admin SOL to transfer the prints
            const ata = await getAssociatedTokenAddress(nft.mint, adminWallet.publicKey);
            const ixs: TransactionInstruction[] = await getTokenTransferInstructions({
                connection,
                payer: adminWallet.publicKey,
                source: ata,
                destination: new PublicKey(to),
                mint: nft.mint,
                amount: 1
            });
            const tx = new Transaction().add(...ixs);
            sendAndConfirmTransaction(connection, tx, [adminWallet]);
            res.status(200).json({ msg: "yeehaw" });
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
