import type {AppProps} from 'next/app'
import {NextUIProvider} from "@nextui-org/react";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {useMemo, useState} from "react";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";
import {globalStyles} from "../styles/global-styles";
import {lightTheme} from "../styles/light-theme";
import {darkTheme} from "../styles/dark-theme";
import {ThemeProvider} from "next-themes";
import { bundlrStorage, Metaplex } from '@metaplex-foundation/js';
import { ConnectionContext, MetaplexContext, NetworkContext } from './context';

require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({Component, pageProps}: AppProps) {
    // set initial contexts, to be used in child components
    const [network, setNetwork] = useState<WalletAdapterNetwork>(
        process.env.VERCEL_ENV === 'production' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet
    );

    // TODO: if the network changes (i.e. via UI), do these need to be set again?
    const [connection, setConnection] = useState<Connection>(
        new Connection(clusterApiUrl(network))
    );

    const bundlrAddress = network === WalletAdapterNetwork.Mainnet ? "https://node2.bundlr.network" : "https://devnet.bundlr.network";
    const mx = Metaplex.make(connection)
        .use(bundlrStorage({
            address: bundlrAddress,
            providerUrl: clusterApiUrl(network),
            timeout: 60000,
        }))
    const [metaplex, setMetaplex] = useState<Metaplex>(mx);

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
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets}>
                        <WalletModalProvider>
                            <NetworkContext.Provider value={{network, setNetwork}}>
                                <ConnectionContext.Provider value={{connection}}>
                                    <MetaplexContext.Provider value={{metaplex}}>
                                        <Component {...pageProps} />
                                    </MetaplexContext.Provider>
                                </ConnectionContext.Provider>
                            </NetworkContext.Provider>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </NextUIProvider>
        </ThemeProvider>
    )
}

export default MyApp
