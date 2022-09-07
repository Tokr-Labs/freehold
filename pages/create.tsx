import React, {useContext, useState} from "react";
import {NextPage} from "next";
import {
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    Grid,
    Image,
    Input,
    Loading,
    Modal,
    Spacer,
    Text,
    Textarea,
    theme
} from "@nextui-org/react";
import {useWallet} from "@solana/wallet-adapter-react";
import {
    findMasterEditionV2Pda,
    findMetadataPda,
    Nft,
    toMetaplexFileFromBrowser,
    walletAdapterIdentity
} from "@metaplex-foundation/js";
import PageWrapper from "../components/page-wrapper";
import {MetaplexContext} from "../contexts/metaplex-context";
import {PublicKey, Transaction} from "@solana/web3.js";
import {createSetAndVerifyCollectionInstruction} from "@metaplex-foundation/mpl-token-metadata";
import {BsFillCheckCircleFill, BsXCircleFill} from "react-icons/bs";
import Link from "next/link";
import {NetworkContext} from "../contexts/network-context";

enum ProgressStatus {
    Pending,  // Not yet submitted
    InProgress,  // Processing and awaiting response
    Succeeded,  // Success response
    Failed  // Error response
}

const ProgressItem = (props: { progress: ProgressStatus, text: string }) => {

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            color: props.progress === ProgressStatus.Pending
                ? "gray"
                : "inherit",
            fontWeight: props.progress === ProgressStatus.Succeeded || props.progress === ProgressStatus.Failed
                ? "bold"
                : "inherit"
        }}>

            {
                props.progress === ProgressStatus.InProgress
                    ? <Loading size={"xs"}/>

                    : props.progress === ProgressStatus.Succeeded
                        ? <BsFillCheckCircleFill fill={theme.colors.success.computedValue}/>

                        : props.progress === ProgressStatus.Failed
                            ? <BsXCircleFill fill={theme.colors.error.computedValue}/>

                            : <Loading size={"xs"} style={{visibility: "hidden"}}/>
            }

            <Spacer x={0.5}/>

            {props.text}

        </div>
    )

}

const Create: NextPage = () => {

    const walletAdapter = useWallet();
    const {network} = useContext(NetworkContext)

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

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [metadataUploadProgress, setMetadataUploadProgress] = useState<ProgressStatus>(ProgressStatus.Pending)
    const [nftCreationProgress, setNftCreationProgress] = useState<ProgressStatus>(ProgressStatus.Pending)
    const [collectionVerificationProgress, setCollectionVerificationProgress] = useState<ProgressStatus>(ProgressStatus.Pending)

    const createNft = async () => {

        // Uploading metadata
        const {uri} = await mx.nfts()
            .uploadMetadata({
                name,
                symbol,
                description,
                image: await toMetaplexFileFromBrowser(image!),
                seller_fee_basis_points: 0,
            })
            .run()
            .catch(() => {
                console.error("Metadata upload failed")
                setMetadataUploadProgress(ProgressStatus.Failed)
                throw new Error("Metadata upload failed")
            })

        if (uri) {
            console.log(`Uploaded metadata (URI: ${uri})`)
            setMetadataUploadProgress(ProgressStatus.Succeeded)
            setNftCreationProgress(ProgressStatus.InProgress)
        }

        // Creating NFT
        const {nft} = await mx.nfts()
            .create({
                uri,
                name,
                isMutable,
                maxSupply: unlimitedSupply ? null : maxSupply
            })
            .run()
            .catch(() => {
                console.error("NFT creation failed")
                setNftCreationProgress(ProgressStatus.Failed)
                throw new Error("NFT creation failed")
            })

        if (nft) {
            console.log(`Created NFT: ${nft.address}`)
            setNft(nft)
            setNftCreationProgress(ProgressStatus.Succeeded)
            if (collection) {
                setCollectionVerificationProgress(ProgressStatus.InProgress)
            }
        }

        // If a collection was specified, attempting to set and verify it on the NFT
        if (collection) {

            const collectionNft = await mx.nfts()
                .findByMint(new PublicKey(collection))
                .run()

            const nftMetadataAccount = await findMetadataPda(nft.address)
            const masterEditionAccount = await findMasterEditionV2Pda(collectionNft.address)
            const collectionMetadataAccount = await findMetadataPda(collectionNft.address)

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

            const txResponse = await mx.rpc()
                .sendAndConfirmTransaction(tx, [mx.identity()])
                .catch(() => {
                    console.error("Collection setting and verification failed")
                    setCollectionVerificationProgress(ProgressStatus.Failed)
                    throw new Error("Collection setting and verification failed")
                })

            if (txResponse.signature) {
                console.log("Collection set and verified. Signature:", txResponse.signature)
                setCollectionVerificationProgress(ProgressStatus.Succeeded)
            }

        }

    }

    const handleClick = async () => {

        if (!walletAdapter.connected) {
            await walletAdapter.connect()
        }

        setMetadataUploadProgress(ProgressStatus.InProgress)
        openModal()

        await createNft()

    }

    const openModal = () => {
        setIsModalVisible(true)
    }

    // Resetting progress state on modal close
    const closeModal = () => {
        setNft(undefined)
        setMetadataUploadProgress(ProgressStatus.Pending)
        setNftCreationProgress(ProgressStatus.Pending)
        setCollectionVerificationProgress(ProgressStatus.Pending)
        setIsModalVisible(false)
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

                        <Modal
                            preventClose
                            width={"425px"}
                            closeButton={true}
                            open={isModalVisible}
                            onClose={closeModal}
                        >

                            <Modal.Header>
                                <Text h3 weight={"bold"}>Creating NFT ({network})</Text>
                            </Modal.Header>

                            <Modal.Body>

                                <ProgressItem
                                    progress={metadataUploadProgress}
                                    text={"Uploading metadata to Arweave"}
                                />

                                <ProgressItem
                                    progress={nftCreationProgress}
                                    text={"Creating NFT"}
                                />

                                {collection && <ProgressItem
                                    progress={collectionVerificationProgress}
                                    text={"Setting and verifying collection"}
                                />}

                                {nft && <div style={{textAlign: "center"}}>

                                    <Divider/>

                                    <Spacer y={0.5}/>

                                    <Text>NFT Created! View on the explorer:</Text>

                                    <Link
                                        href={`https://explorer.solana.com/address/${nft.address}?cluster=${network}`}>
                                        <a target={"_blank"} style={{
                                            color: theme.colors.primary.computedValue,
                                            fontSize: theme.fontSizes.sm.computedValue
                                        }}>
                                            {nft.address.toString()}
                                        </a>
                                    </Link>

                                </div>}

                            </Modal.Body>

                            <Modal.Footer/>

                        </Modal>

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
