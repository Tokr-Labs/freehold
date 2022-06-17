import type {NextPage} from 'next'
import {Card, Container, Grid, Image, Text} from "@nextui-org/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";
import PageWrapper from "../components/page-wrapper";

const Home: NextPage = () => {

    return (
        <PageWrapper>

            <Navbar/>

            <Container>

                <Grid.Container alignItems={"center"}>

                    <Grid xs={6}>

                        <Grid.Container gap={2}>

                            <Grid xs={12}>

                                <Text
                                    h1
                                    size={60}
                                    weight={"bold"}
                                    css={{
                                        textGradient: "0deg, $purple600 -20%, $pink600 100%"
                                    }}
                                >
                                    NFT creation made easy&nbsp;
                                </Text>

                            </Grid>

                            <Grid xs={6}>

                                <Link href={"/create"}>

                                    <Card isHoverable={true} isPressable={true}>

                                        <Card.Header>
                                            <Text h3 weight={"bold"}>Create</Text>
                                        </Card.Header>

                                        <Card.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            sed do eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </Card.Body>

                                    </Card>

                                </Link>

                            </Grid>

                            <Grid xs={6}>

                                {/*<Link href={"/explore"}>*/}

                                    <Card isHoverable={true} isPressable={false}>

                                        <Card.Header>
                                            <Text h3 weight={"bold"}>Explore</Text>
                                        </Card.Header>

                                        <Card.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            sed do eiusmod tempor incididunt ut labore et dolore magna
                                            aliqua.
                                        </Card.Body>

                                    </Card>

                                {/*</Link>*/}

                            </Grid>

                        </Grid.Container>

                    </Grid>

                    <Grid xs={6}>
                        <Image
                            src={"/solana-shape1-full.png"}
                            alt={"background image"}
                            objectFit={"contain"}
                            showSkeleton={true}
                        />
                    </Grid>

                </Grid.Container>

            </Container>

            <Footer/>

        </PageWrapper>
    )

}

export default Home
