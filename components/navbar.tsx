import React from "react";
import {Container, Grid} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";

const Navbar = () => {

    return (
        <div style={{background: "lightcyan"}}>

            <Container>

                <Grid.Container gap={2} style={{paddingBottom: 0}}>

                    <Grid xs={12} justify={"flex-end"}>

                        <WalletMultiButton/>

                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Navbar