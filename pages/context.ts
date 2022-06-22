import { Metaplex } from "@metaplex-foundation/js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import React, { createContext } from "react";

// context for network string
export const NetworkContext = createContext<{ network: WalletAdapterNetwork; setNetwork: React.Dispatch<React.SetStateAction<WalletAdapterNetwork>>; }>({
    network: WalletAdapterNetwork.Devnet,
    setNetwork: () => null
});

// context for Solana connection
export const ConnectionContext = createContext<{ connection: Connection }>({
    connection: new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet))
});

// context for Metaplex
export const MetaplexContext = createContext<{ metaplex: Metaplex }>({
    metaplex: new Metaplex(new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet)))
});