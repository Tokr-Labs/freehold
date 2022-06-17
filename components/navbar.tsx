import React from "react";
import {Container, Grid, theme} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";

const Navbar = () => {

    return (
        <div style={{background: theme.colors.accents9.computedValue}}>

            <Container>

                <Grid.Container gap={2}>

                    <Grid xs={12} justify={"flex-end"}>

                        <WalletMultiButton/>

                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Navbar