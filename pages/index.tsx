import type {NextPage} from 'next'
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import {Card, Container, Grid, Input, Spacer, Textarea, Text, Radio, Checkbox, Button} from "@nextui-org/react";
import {bundlrStorage, Metaplex, walletAdapterIdentity} from "@metaplex-foundation/js";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Home: NextPage = () => {

    const {connection} = useConnection();
    const walletAdapter = useWallet();

    const mx = Metaplex.make(connection)
        .use(walletAdapterIdentity(walletAdapter))
        .use(bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: clusterApiUrl(WalletAdapterNetwork.Devnet),
            timeout: 60000,
        }))

    return (
        <>

            <Navbar/>

            <Container>

                <Grid.Container gap={2}>

                    <Grid xs={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Set Metadata</Text>
                            </Card.Header>

                            <Card.Body>

                                <Input label={"Name"}/>

                                <Spacer y={1}/>

                                <Input label={"Symbol"}/>

                                <Spacer y={1}/>

                                <Textarea label={"Description"}/>

                                <Spacer y={1}/>

                                <Checkbox defaultSelected={true}>
                                    Updatable
                                </Checkbox>

                            </Card.Body>

                        </Card>

                    </Grid>

                    <Grid xs={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Upload Image</Text>
                            </Card.Header>

                            <Card.Body>

                                <input type={"file"}/>

                            </Card.Body>

                        </Card>

                    </Grid>

                    <Grid xs={12} justify={"flex-end"}>

                        <Button>Create NFT</Button>

                    </Grid>

                </Grid.Container>

            </Container>

            <Footer/>

        </>
    )
}

export default Home
