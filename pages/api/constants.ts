// A place for defining constants or reusable objects
// an API should not be defined, otherwise it will be exposed publicly
import type { NextApiRequest, NextApiResponse } from 'next';
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet));
export const metaplex = new Metaplex(connection);

// generic response types
export type MissingArgs = {
    args: string[],
    error: string
}