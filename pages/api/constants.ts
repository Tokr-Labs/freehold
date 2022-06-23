// A place for defining constants or reusable objects
// an API should NOT be defined, otherwise it will be exposed publicly
import { keypairIdentity } from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import { getMetaplex, getSolanaConnection } from "./util";

// init'd objects to be used in API (and not Pages, which should use contexts)
// assumes that APIs using the objects will use default networks (production -> mainnet, otherwise devnet)
// if an API needs to use a specific network, it should call the getters itself
export const connection = getSolanaConnection();
export const metaplex = getMetaplex();

export const adminWallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
export const signable_metaplex = getMetaplex().use(keypairIdentity(adminWallet));

// generic response types
export type MissingArgs = {
    args: string[],
    error: string
}