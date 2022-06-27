
import { PublicKey, TransactionInstruction, Connection, Keypair } from '@solana/web3.js';
import {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction
} from '@solana/spl-token';


/** Parameters for {@link sendToken} **/
export interface SendTokenParams {
    connection: Connection;
    /** Source wallet address **/
    admin: Keypair;
    /** Source wallet's associated token account address **/
    source: PublicKey;
    /** Destination wallet address **/
    destination: PublicKey;
    /** Mint address of the tokento transfer **/
    mint: PublicKey;
    /** Amount of tokens to transfer.
     * Be aware of variable decimals when sending non-NFT SPL tokens **/
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
    admin,
    source,
    destination,
    mint,
    amount,
}: SendTokenParams): Promise<TransactionInstruction[]> => {
    const txs = [];

    // @TODO: we may need to allow for off-curve (PDA) addresses?
    // Be aware of atomicity: function call will send & confirm a transaction if the ATA does not exist
    const destAta = await getOrCreateAssociatedTokenAccount(connection, admin, mint, destination);

    txs.push(createTransferInstruction(
        source,
        destAta.address,
        admin.publicKey,
        amount
    ))

    return txs;
};