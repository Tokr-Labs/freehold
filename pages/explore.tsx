import {NextPage} from "next";
import PageWrapper from "../components/page-wrapper";
import {Card, Container, Grid, Image, Spacer, Text} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {Nft} from "@metaplex-foundation/js";


const Explore: NextPage = () => {

    const {connected, publicKey} = useWallet()

    const [ownedNfts, setOwnedNfts] = useState<Nft[]>()
    console.log(ownedNfts)

    useEffect(() => {

        if (!connected) {
            console.log("Wallet not connected")
            return;
        }

        fetch(`/api/nft/owned?user=${publicKey}&metadata=true`)
            .then(response => response.json())
            .then(json => setOwnedNfts(json.nfts))
            .catch(console.error)

    }, [connected, publicKey])

    return (
        <PageWrapper>

            <Container>

                <Spacer y={1}/>

                <Grid.Container gap={2}>

                    <Grid xs={12} md={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Owned</Text>
                            </Card.Header>

                            <Card.Body>
                                {
                                    !connected
                                        ? <div>Connect your wallet!</div>
                                        : ownedNfts &&
                                        <Grid.Container gap={2}>
                                            {ownedNfts.map((nft, index) => {
                                                // @ts-ignore
                                                const imageUri = nft.metadataTask.result?.image
                                                if (imageUri) {
                                                    return (
                                                        <Grid key={index} direction={"column"}>
                                                            <Image
                                                                src={imageUri}
                                                                alt={"NFT image"}
                                                                height={100}
                                                                width={100}
                                                                showSkeleton={true}
                                                            />
                                                            <p style={{textAlign: "center"}}>{nft.name}</p>
                                                        </Grid>
                                                    )
                                                }

                                                console.log("Could not fetch image for:", nft.name)
                                                return;
                                            })}
                                        </Grid.Container>
                                }
                            </Card.Body>

                            <Card.Footer/>

                        </Card>

                    </Grid>

                    <Grid xs={12} md={6}>

                        <Card>

                            <Card.Header>
                                <Text h2 weight={"bold"}>Created</Text>
                            </Card.Header>

                            <Card.Body>Coming soon</Card.Body>

                            <Card.Footer/>

                        </Card>

                    </Grid>

                </Grid.Container>

            </Container>

        </PageWrapper>
    )

}

export default Explore