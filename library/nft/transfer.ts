
import { PublicKey, TransactionInstruction, Connection, Transaction } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction
} from '@solana/spl-token';
import { Account } from '@metaplex-foundation/mpl-core';
import { adminWallet, connection } from '../../pages/api/constants';


/** Parameters for {@link sendToken} **/
export interface SendTokenParams {
    connection: Connection;
    /** Source wallet address **/
    payer: PublicKey;
    /** Source wallet's associated token account address **/
    source: PublicKey;
    /** Destination wallet address **/
    destination: PublicKey;
    /** Mint address of the tokento transfer **/
    mint: PublicKey;
    /** Amount of tokens to transfer.
     * One important nuance to remember is that
     * each token mint has a different amount of decimals,
     * which need to be accounted while specifying the amount.
     * For instance, to send 1 token with a 0 decimal mint
     * you would provide `1` as the amount, but for a token mint
     * with 6 decimals you would provide `1000000` as the amount
     * to transfer one whole token **/
    amount: number;
}


/**
 * Borrowed from https://github.com/metaplex-foundation/js-deprecated/blob/a4274ec97c6599dbfae8860ae2edc03f49d35d68/src/actions/sendToken.ts#L38
 * Replaced some of the custom metaplex-foundation implementation with the official solana/spl client implementation
 * 
 * Send a token to another account.
 *
 * This action will do the following:
 * 1. Check if the destination account has an associated token account for the SPL token at hand
 * 2. If the associated token account doesn't exist, it will be created
 * 3. The token will be transferred to the associated token account
 *
 * Please take into account that creating an account will [automatically allocate lamports for rent exemption](https://docs.solana.com/implemented-proposals/rent) which will make it a very expensive instruction to run in bulk
 */
export const getTokenTransferInstructions = async ({
    connection,
    payer,
    source,
    destination,
    mint,
    amount,
}: SendTokenParams): Promise<TransactionInstruction[]> => {
    const txs = [];

    // @TODO: we may need to allow for off-curve (PDA) addresses?
    const destAta = await getAssociatedTokenAddress(mint, destination);

    try {
        // check if the account exists
        await Account.load(connection, destAta);
    } catch {
        txs.push(createAssociatedTokenAccountInstruction(
            payer,
            destAta,
            destination,
            mint,
        ));
    }

    txs.push(createTransferInstruction(
        source,
        destAta,
        payer,
        amount
    ))

    return txs;
};

export const transferAdminNftTransaction = async (
    mint: PublicKey, to: PublicKey
    ): Promise<Transaction> => {
    // associated token account for the NFT & admin wallet
    const ata = await getAssociatedTokenAddress(mint, adminWallet.publicKey);

    // creates destination ATA (if it doesn't exist)
    // transfer NFT from admin ATA to destination ATA
    const ixs: TransactionInstruction[] = await getTokenTransferInstructions({
        connection,
        payer: adminWallet.publicKey,
        source: ata,
        destination: new PublicKey(to),
        mint: mint,
        amount: 1
    });

    return new Transaction().add(...ixs);
}