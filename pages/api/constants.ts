// A place for defining constants or reusable objects
// an API should NOT be defined, otherwise it will be exposed publicly
import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import * as bs58 from "bs58";

export const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet));
export const metaplex = new Metaplex(connection);

const adminWallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
export const signable_metaplex = new Metaplex(connection).use(keypairIdentity(adminWallet));

// generic response types
export type MissingArgs = {
    args: string[],
    error: string
}