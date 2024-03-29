import type {AppProps} from 'next/app'
import {NextUIProvider} from "@nextui-org/react";
import {ConnectionProvider, useConnection, useWallet, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {Connection} from "@solana/web3.js";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {useEffect, useMemo, useState} from "react";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";
import {globalStyles} from "../styles/global-styles";
import {lightTheme} from "../styles/light-theme";
import {darkTheme} from "../styles/dark-theme";
import {ThemeProvider} from "next-themes";
import {bundlrStorage, Metaplex, walletAdapterIdentity} from '@metaplex-foundation/js';
import {NetworkContext} from '../contexts/network-context';
import {MetaplexContext} from '../contexts/metaplex-context';
import { getRPC } from '../utils/get-connection';

require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({Component, pageProps}: AppProps) {
    const [network, setNetwork] = useState<WalletAdapterNetwork>(
        process.env.VERCEL_ENV === 'production'
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Devnet
    );

    const connection = useMemo(
        () => new Connection(getRPC(network)),
        [network]
    )

    const walletAdapter = useWallet();

    const [metaplex, setMetaplex] = useState<Metaplex>(Metaplex.make(connection));

    useEffect(() => {
        const bundlrAddress = network === WalletAdapterNetwork.Mainnet
            ? "https://node2.bundlr.network"
            : "https://devnet.bundlr.network";

        const mx = Metaplex.make(connection)
            .use(walletAdapterIdentity(walletAdapter))
            .use(bundlrStorage({
                address: bundlrAddress,
                providerUrl: getRPC(network),
                timeout: 60000,
            }))

        setMetaplex(mx)

    }, [connection, network, walletAdapter])

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

    // Instantiates global styles
    globalStyles()

    return (
        <ThemeProvider
            defaultTheme={"system"}
            attribute={"class"}
            value={{
                light: lightTheme.className,
                dark: darkTheme.className
            }}
        >
            <NextUIProvider>
                <NetworkContext.Provider value={{network, setNetwork}}>
                    <ConnectionProvider endpoint={getRPC(network)}>
                        <WalletProvider wallets={wallets}>
                            <WalletModalProvider>
                                <MetaplexContext.Provider value={metaplex}>
                                    <Component {...pageProps} />
                                </MetaplexContext.Provider>
                            </WalletModalProvider>
                        </WalletProvider>
                    </ConnectionProvider>
                </NetworkContext.Provider>
            </NextUIProvider>
        </ThemeProvider>
    )
}

export default MyApp
