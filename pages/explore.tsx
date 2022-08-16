import {NextPage} from "next";
import PageWrapper from "../components/page-wrapper";
import {Card, Container, Grid, Image, Loading, Spacer, Text} from "@nextui-org/react";
import {useContext, useEffect, useState} from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {Nft} from "@metaplex-foundation/js";
import {NetworkContext} from "../contexts/network-context";


const Explore: NextPage = () => {

    const {connected, publicKey} = useWallet()
    const {network} = useContext(NetworkContext)

    const [ownedNfts, setOwnedNfts] = useState<Nft[]>()
    const [isOwnedNftsLoading, setIsOwnedNftsLoading] = useState<boolean>(false)

    useEffect(() => {

        if (!connected) {
            console.log("Wallet not connected")
            return;
        }

        setIsOwnedNftsLoading(true)

        fetch(`/api/nft/owned?user=${publicKey}&metadata=true&network=${network}`)
            .then(response => response.json())
            .then(json => setOwnedNfts(json.nfts))
            .then(() => setIsOwnedNftsLoading(false))
            .catch(console.error)

    }, [connected, network, publicKey])

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
                                        : isOwnedNftsLoading
                                            ? <Loading>Wallets with many NFTs may take awhile to load</Loading>
                                            : ownedNfts && ownedNfts.length === 0
                                                ? <Text>This wallet does not contain any {network} NFTs</Text>
                                                : ownedNfts &&
                                                <Grid.Container gap={2}>
                                                    {ownedNfts.map((nft, index) => {
                                                        return (
                                                            <Grid key={index} direction={"column"}>
                                                                <Image
                                                                    src={nft.json?.image || "https://dummyimage.com/100x100/969696/ededed&text=Image+not+found"}
                                                                    alt={"NFT image"}
                                                                    height={100}
                                                                    width={100}
                                                                    showSkeleton={true}
                                                                />
                                                                <p style={{textAlign: "center"}}>{nft.name}</p>
                                                            </Grid>
                                                        )
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
