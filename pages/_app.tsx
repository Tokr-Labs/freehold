import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {NextUIProvider} from "@nextui-org/react";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {useMemo} from "react";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";

require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({Component, pageProps}: AppProps) {

    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            // new GlowWalletAdapter(),
            // new SlopeWalletAdapter(),
            // new SolflareWalletAdapter({network}),
            // new TorusWalletAdapter(),
        ],
        []
    );

    return (
        <NextUIProvider>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <Component {...pageProps} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </NextUIProvider>
    )
}

export default MyApp
