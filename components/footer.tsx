import React from "react";
import {Container, Grid, theme, Text} from "@nextui-org/react";

const Footer = () => {

    return (
        <div style={{background: theme.colors.accents1.computedValue, marginTop: "auto"}}>

            <Container>

                <Grid.Container gap={2} style={{marginBottom: 0, paddingBottom: 0}}>

                    <Grid>
                        <Text>Built with 💜 by Tokr Labs</Text>
                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Footer