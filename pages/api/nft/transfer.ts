// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Nft } from "@metaplex-foundation/js";
import { PublicKey, sendAndConfirmTransaction, Transaction, TransactionInstruction } from "@solana/web3.js";
import { connection, metaplex, adminWallet, Success } from "../constants";
import { getTokenTransferInstructions } from '../../library/nft/transfer';
import { getAssociatedTokenAddress } from '@solana/spl-token';


// example POST:
// api/nft/transfer {token: GPKoJbgqY1NgH3bxmGFvoLq3GL39RKqEtCqEDttTNYFU, to: 6k7PDpk7QsRJQAspUvFiaDCoe5GQDe96vmWx1L3Gy39H}
// transfer a print NFT to a new owner
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Success>
) {
    const { body: { token, to }, method } = req;
    switch (method) {
        // @TODO: perform security checks as priveleged users will be spending admin SOL to transfer the prints
        case 'POST':
            // obtain NFT to transfer
            const nft: Nft = await metaplex.nfts().findByMint(new PublicKey(token));

            // associated token account for the NFT & admin wallet
            const ata = await getAssociatedTokenAddress(nft.mint, adminWallet.publicKey);

            // creates destination ATA (if it doesn't exist)
            // transfer NFT from admin ATA to destination ATA
            const ixs: TransactionInstruction[] = await getTokenTransferInstructions({
                connection,
                payer: adminWallet.publicKey,
                source: ata,
                destination: new PublicKey(to),
                mint: nft.mint,
                amount: 1
            });

            // sign & send transaction
            const tx = new Transaction().add(...ixs);
            sendAndConfirmTransaction(connection, tx, [adminWallet]);
            res.status(200).json({
                success: true,
                message: `Successfully transferred ${nft.mint} to ${to}`
            });
            break;
        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
