import React from "react";
import {Container, Grid} from "@nextui-org/react";

const Footer = () => {

    return (
        <Container fluid={true} style={{background: "lightyellow"}}>

            <Container>

                <Grid.Container gap={2}>

                    <Grid>
                        Footer
                    </Grid>

                </Grid.Container>

            </Container>

        </Container>
    )

}

export default Footer