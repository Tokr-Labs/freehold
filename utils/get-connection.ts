import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl, Connection} from "@solana/web3.js";

export const getConnection = (network?: string | WalletAdapterNetwork | undefined): Connection => {

    // return connection for the requested network
    if (network !== undefined) {
        const nw = network === 'mainnet-beta'
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Devnet

        return new Connection(clusterApiUrl(nw))
    }

    // return mainnet connection for production otherwise default to devnet
    return process.env.VERCEL_ENV === 'production'
        ? new Connection(clusterApiUrl(WalletAdapterNetwork.Mainnet))
        : new Connection(clusterApiUrl(WalletAdapterNetwork.Devnet))

}