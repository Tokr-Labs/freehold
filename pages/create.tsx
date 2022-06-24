import React, {useContext, useState} from "react";
import {NextPage} from "next";
import {Button, Card, Checkbox, Container, Grid, Image, Input, Spacer, Text, Textarea} from "@nextui-org/react";
import {useWallet} from "@solana/wallet-adapter-react";
import {CreateNftInput, Nft, useMetaplexFileFromBrowser, walletAdapterIdentity} from "@metaplex-foundation/js";
import PageWrapper from "../components/page-wrapper";
import {MetaplexContext} from "../contexts/metaplex-context";

const Create: NextPage = () => {

    const walletAdapter = useWallet();

    // TODO - why does the wallet adapter identity need to be set again here?
    const mx = useContext(MetaplexContext).use(walletAdapterIdentity(walletAdapter));

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

            <Container style={{marginTop: "auto"}}>

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
                                    <Text size={14}>Updatable</Text>
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

                                <input
                                    type={"file"}
                                    accept={"image/png, image/jpeg"}
                                    onChange={e => {
                                        if (!e.target.files) return;
                                        setImage(e.target.files[0])
                                    }}
                                />

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

        </PageWrapper>
    )

}

export default Create