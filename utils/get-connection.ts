import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {Connection} from "@solana/web3.js";

export const getRPC = (network?: string | WalletAdapterNetwork | undefined): string => {
    return (network === WalletAdapterNetwork.Mainnet ? process.env.NEXT_PUBLIC_RPC_MAINNET_BETA : process.env.NEXT_PUBLIC_RPC_DEVNET)!;
}

export const getConnection = (network?: string | WalletAdapterNetwork | undefined): Connection => {

    // return connection for the requested network
    if (network !== undefined) {
        const nw = network === 'mainnet-beta'
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Devnet

        return new Connection(getRPC(nw));
    }

    // by default, return mainnet for production and devnet otherwise
    return process.env.VERCEL_ENV === 'production'
        ? new Connection(process.env.NEXT_PUBLIC_RPC_MAINNET_BETA!)
        : new Connection(process.env.NEXT_PUBLIC_RPC_DEVNET!)

}