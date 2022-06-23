import type {AppProps} from 'next/app'
import {NextUIProvider} from "@nextui-org/react";
import {ConnectionProvider, useConnection, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {useEffect, useMemo, useState} from "react";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";
import {globalStyles} from "../styles/global-styles";
import {lightTheme} from "../styles/light-theme";
import {darkTheme} from "../styles/dark-theme";
import {ThemeProvider} from "next-themes";
import {bundlrStorage, Metaplex} from '@metaplex-foundation/js';
import {NetworkContext} from '../contexts/network-context';
import {MetaplexContext} from '../contexts/metaplex-context';

require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({Component, pageProps}: AppProps) {

    const {connection} = useConnection();

    const [network, setNetwork] = useState<WalletAdapterNetwork>(
        process.env.VERCEL_ENV === 'production'
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Devnet
    );

    const [metaplex, setMetaplex] = useState<Metaplex>(Metaplex.make(connection));

    useEffect(() => {

        const bundlrAddress = network === WalletAdapterNetwork.Mainnet
            ? "https://node2.bundlr.network"
            : "https://devnet.bundlr.network";

        // TODO - use wallet adapter identity to access keypair
        const mx = Metaplex.make(connection)
            .use(bundlrStorage({
                address: bundlrAddress,
                providerUrl: clusterApiUrl(network),
                timeout: 60000,
            }))

        setMetaplex(mx)

    }, [connection, network])

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
                    <ConnectionProvider endpoint={clusterApiUrl(network)}>
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
