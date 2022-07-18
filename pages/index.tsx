import type {NextPage} from 'next'
import {Card, Container, Grid, Image, Text, theme} from "@nextui-org/react";
import Link from "next/link";
import PageWrapper from "../components/page-wrapper";

const Home: NextPage = () => {

    return (
        <PageWrapper>

            <Container>

                <Grid.Container alignItems={"center"}>

                    <Grid xs={12} md={6}>

                        <Grid.Container gap={2}>

                            <Grid xs={12}>

                                <Text
                                    h1
                                    size={60}
                                    weight={"bold"}
                                    css={{
                                        textGradient: "0deg, $purple600 -20%, $pink600 100%",
                                        letterSpacing: theme.letterSpacings.tight.computedValue,
                                        lineHeight: theme.lineHeights.xs.computedValue,
                                        paddingBottom: "4px"
                                    }}
                                >
                                    Solana NFTs made easy&nbsp;
                                </Text>

                            </Grid>

                            <Grid xs={12} md={6}>

                                <Link href={"/create"}>

                                    <Card isHoverable={true} isPressable={true}>

                                        <Card.Header>
                                            <Text h3 weight={"bold"}>Create</Text>
                                        </Card.Header>

                                        <Card.Body>
                                            Seamlessly create NFTs with customizable metadata
                                            and automatic collection verification.
                                        </Card.Body>

                                    </Card>

                                </Link>

                            </Grid>

                            <Grid xs={12} md={6}>

                                <Link href={"/explore"}>

                                    <Card isHoverable={true} isPressable={true}>

                                        <Card.Header>
                                            <Text h3 weight={"bold"}>Explore</Text>
                                        </Card.Header>

                                        <Card.Body>
                                            Easily view your NFT holdings, your personal creations,
                                            specific collection information, and more.
                                        </Card.Body>

                                    </Card>

                                </Link>

                            </Grid>

                        </Grid.Container>

                    </Grid>

                    <Grid xs={12} md={6}>
                        <Image
                            src={"/solana-shape1-full.png"}
                            alt={"background image"}
                            objectFit={"contain"}
                            showSkeleton={true}
                        />
                    </Grid>

                </Grid.Container>

            </Container>

        </PageWrapper>
    )

}

export default Home
