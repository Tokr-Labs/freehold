import {createContext} from "react";
import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

export const MetaplexContext = createContext<Metaplex>(
    new Metaplex(new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet)))
);
