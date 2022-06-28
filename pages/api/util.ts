import { Connection, clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Metaplex } from "@metaplex-foundation/js";

export const getSolanaConnection = (network?: string | WalletAdapterNetwork | undefined): Connection => {
    // return connection for the requested network
    if (network !== undefined) {
        const nw = network === 'mainnet-beta' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
        return new Connection(clusterApiUrl(nw));
    } else {
        // return mainnet connection for production otherwise default to devnet
        return process.env.VERCEL_ENV === 'production' ? 
            new Connection(clusterApiUrl(WalletAdapterNetwork.Mainnet))
            :
            new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet));
    }
}

export const getMetaplex = (connection?: Connection): Metaplex => {
    connection = connection || getSolanaConnection();
    return new Metaplex(connection);
}