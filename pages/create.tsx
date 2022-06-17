import React, {useState} from "react";
import {NextPage} from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {Button, Card, Checkbox, Container, Grid, Image, Input, Spacer, Text, Textarea} from "@nextui-org/react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {
    bundlrStorage,
    CreateNftInput,
    Metaplex,
    Nft,
    useMetaplexFileFromBrowser,
    walletAdapterIdentity
} from "@metaplex-foundation/js";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import PageWrapper from "../components/page-wrapper";

const Create: NextPage = () => {

    const {connection} = useConnection();
    const walletAdapter = useWallet();

    const mx = Metaplex.make(connection)
        .use(walletAdapterIdentity(walletAdapter))
        .use(bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: clusterApiUrl(WalletAdapterNetwork.Devnet),
            timeout: 60000,
        }))

    const [name, setName] = useState<string>()
    const [symbol, setSymbol] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [isMutable, setIsMutable] = useState<boolean>(true)
    const [image, setImage] = useState<File>()
    const [nft, setNft] = useState<Nft>()

    const createNft = async () => {

        const {uri} = await mx.nfts().uploadMetadata({
            name,
            symbol,
            description,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            image: await useMetaplexFileFromBrowser(image!),
            seller_fee_basis_points: 0,
        })

        const {nft} = await mx.nfts().create({
            uri: uri,
            isMutable
        } as CreateNftInput)

        setNft(nft)

    }

    const handleClick = async () => {

        if (!walletAdapter.connected) {
            await walletAdapter.connect()
        }

        await createNft()

    }

    return (
        <PageWrapper>

            <Navbar/>

            <Container>

                <Grid.Container gap={2}>

                    <Grid xs={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Set Metadata</Text>
                            </Card.Header>

                            <Card.Body>

                                <Input label={"Name"} onChange={e => {
                                    setName(e.target.value)
                                }}/>

                                <Spacer y={1}/>

                                <Input label={"Symbol"} onChange={e => {
                                    setSymbol(e.target.value)
                                }}/>

                                <Spacer y={1}/>

                                <Textarea label={"Description"} onChange={e => {
                                    setDescription(e.target.value)
                                }}/>

                                <Spacer y={1}/>

                                <Checkbox defaultSelected={true} onChange={setIsMutable}>
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

                                <input type={"file"} onChange={e => {
                                    if (!e.target.files) return;
                                    setImage(e.target.files[0])
                                }}/>

                                {image && (
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt={"Uploaded image"}
                                        height={200}
                                        width={200}
                                        showSkeleton={true}
                                    />
                                )}

                            </Card.Body>

                        </Card>

                    </Grid>

                    <Grid xs={12} justify={"flex-end"}>

                        <Button
                            disabled={!(name && symbol && description && image && walletAdapter.connected)}
                            onClick={handleClick}
                        >
                            Create NFT
                        </Button>

                    </Grid>

                </Grid.Container>

            </Container>

            <Footer/>

        </PageWrapper>
    )

}

export default Create