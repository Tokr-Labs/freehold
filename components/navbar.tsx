import React from "react";
import {Button, Container, Grid, theme} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

const Navbar = () => {

    return (
        <div style={{background: theme.colors.accents1.computedValue}}>

            <Container>

                <Grid.Container gap={2} style={{margin: "0 -12px", padding: "0 12px"}}>

                    <Grid xs={4}>
                        <Link href={"/"}>
                            <Button auto>Logo Placeholder</Button>
                        </Link>
                    </Grid>

                    <Grid xs={4}>
                        <Button flat>About</Button>
                        <Button flat>Team</Button>
                    </Grid>

                    <Grid xs={4} justify={"flex-end"}>
                        <WalletMultiButton/>
                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Navbar