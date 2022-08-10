// A place for defining constants or reusable objects
// an API should NOT be defined, otherwise it will be exposed publicly
import {keypairIdentity} from "@metaplex-foundation/js";
import {Keypair} from "@solana/web3.js";
import * as bs58 from "bs58";
import {getMetaplex} from "../../utils/get-metaplex";

export const adminWallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
export const signable_metaplex = getMetaplex().use(keypairIdentity(adminWallet));

