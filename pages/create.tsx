import React, {useContext, useState} from "react";
import {NextPage} from "next";
import {Button, Card, Checkbox, Container, Grid, Image, Input, Spacer, Text, Textarea} from "@nextui-org/react";
import {useWallet} from "@solana/wallet-adapter-react";
import {
    CreateNftInput,
    findMasterEditionV2Pda,
    findMetadataPda,
    Nft,
    useMetaplexFileFromBrowser,
    walletAdapterIdentity
} from "@metaplex-foundation/js";
import PageWrapper from "../components/page-wrapper";
import {MetaplexContext} from "../contexts/metaplex-context";
import {PublicKey, Transaction} from "@solana/web3.js";
import {createSetAndVerifyCollectionInstruction} from "@metaplex-foundation/mpl-token-metadata";

const Create: NextPage = () => {

    const walletAdapter = useWallet();

    // TODO - why does the wallet adapter identity need to be set again here?
    const mx = useContext(MetaplexContext).use(walletAdapterIdentity(walletAdapter));

    const [name, setName] = useState<string>()
    const [symbol, setSymbol] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [maxSupply, setMaxSupply] = useState<number>(1)
    const [unlimitedSupply, setUnlimitedSupply] = useState<boolean>(true)
    const [collection, setCollection] = useState<string>()
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

        console.log(`Uploaded metadata (URI: ${uri})`)

        const {nft} = await mx.nfts().create({
            uri,
            isMutable,
            maxSupply: unlimitedSupply ? undefined : maxSupply
        } as CreateNftInput)

        console.log(`Created NFT: ${nft.mint}`)

        if (collection) {

            const collectionNft = await mx.nfts().findByMint(new PublicKey(collection))

            const nftMetadataAccount = await findMetadataPda(nft.mint)
            const masterEditionAccount = await findMasterEditionV2Pda(collectionNft.mint)
            const collectionMetadataAccount = await findMetadataPda(collectionNft.mint)

            const tx = new Transaction()
            tx.add(
                createSetAndVerifyCollectionInstruction({
                    metadata: nftMetadataAccount,
                    collectionAuthority: collectionNft.updateAuthority,
                    payer: mx.identity().publicKey,
                    updateAuthority: collectionNft.updateAuthority,
                    collectionMint: collectionNft.mint,
                    collection: collectionMetadataAccount,
                    collectionMasterEditionAccount: masterEditionAccount,
                })
            )

            console.log("About to send transaction to set and verify collection")

            await mx.rpc().sendAndConfirmTransaction(tx, [mx.identity()])
                .then(response => console.log("Signature:", response.signature))
                .catch(console.error)

        }

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

                    <Grid xs={12} md={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Set Metadata</Text>
                            </Card.Header>

                            <Card.Body>

                                <div style={{display: "flex", alignItems: "center"}}>

                                    <Input
                                        label={"Name"}
                                        fullWidth={true}
                                        maxLength={32}
                                        onChange={e => {
                                            setName(e.target.value)
                                        }}
                                    />

                                    <Spacer x={1}/>

                                    <Input
                                        label={"Symbol"}
                                        fullWidth={true}
                                        maxLength={10}
                                        onChange={e => {
                                            setSymbol(e.target.value)
                                        }}
                                    />

                                </div>

                                <Spacer y={1}/>

                                <Textarea label={"Description"} onChange={e => {
                                    setDescription(e.target.value)
                                }}/>

                                <Spacer y={1}/>

                                <div style={{display: "flex", alignItems: "center"}}>

                                    <Input
                                        label={"Max Supply"}
                                        type={"number"}
                                        min={0}
                                        step={1}
                                        value={maxSupply}
                                        disabled={unlimitedSupply}
                                        status={Number.isInteger(maxSupply) ? "default" : "error"}
                                        helperText={Number.isInteger(maxSupply) ? "" : "Max supply must be an integer"}
                                        helperColor={"error"}
                                        onChange={e => {
                                            setMaxSupply(Number(e.target.value))
                                        }}
                                    />

                                    <Spacer x={1}/>

                                    <Checkbox
                                        defaultSelected={unlimitedSupply}
                                        onChange={setUnlimitedSupply}
                                        css={{marginTop: "25px"}}
                                    >
                                        <Text size={14}>Unlimited Supply</Text>
                                    </Checkbox>

                                </div>

                                <Spacer y={1}/>

                                <Input
                                    label={"Collection"}
                                    placeholder={"PublicKey of the associated collection NFT (optional)"}
                                    onChange={e => {
                                        setCollection(e.target.value)
                                    }}
                                />

                                <Spacer y={1}/>

                                <Checkbox defaultSelected={true} onChange={setIsMutable}>
                                    <Text size={14}>Updatable</Text>
                                </Checkbox>

                            </Card.Body>

                        </Card>

                    </Grid>

                    <Grid xs={12} md={6}>

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