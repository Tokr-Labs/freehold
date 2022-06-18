import React from "react";
import {Container, Grid, Image, Switch, Text, theme, useTheme} from "@nextui-org/react";
import {useTheme as useNextTheme} from "next-themes";

const Footer = () => {

    const {setTheme} = useNextTheme()
    const isDark = useTheme().isDark

    return (
        <div style={{background: theme.colors.accents0.computedValue, marginTop: "auto"}}>

            <Container>

                <Grid.Container gap={2} style={{marginBottom: 0, paddingBottom: 0}}>

                    <Grid xs={3}>
                        <Switch
                            checked={isDark}
                            onChange={e => {
                                setTheme(e.target.checked ? "dark" : "light")
                            }}
                        />
                    </Grid>

                    <Grid xs={3}>
                        <Text>
                            Built with 💜 by&nbsp;
                            <a href={"https://tokrlabs.xyz"}
                               target={"_blank"}
                               rel="noreferrer"
                               style={{color: theme.colors.primary.computedValue, fontWeight: "bold"}}
                            >
                                Tokr Labs
                            </a>
                        </Text>
                    </Grid>

                    <Grid xs={6} justify={"flex-end"} alignItems={"center"}>
                        <span>Powered by</span>
                        <Image
                            src={`../metaplex_logo_${isDark ? "dark.png" : "light.png"}`}
                            alt={"Metaplex logo"}
                            height={20}
                            width={"auto"}
                            style={{display: "inline"}}
                        />
                        <span>on</span>
                        <Image
                            src={`../solana_logo_${isDark ? "dark.png" : "light.png"}`}
                            alt={"Solana logo"}
                            height={30}
                            width={"auto"}
                            style={{display: "inline"}}
                        />
                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Footer