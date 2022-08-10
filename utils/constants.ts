import {Keypair} from "@solana/web3.js";
import * as bs58 from "bs58";

export const adminWallet = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
