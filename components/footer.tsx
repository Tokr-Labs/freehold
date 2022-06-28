import React from "react";
import {Container, Grid, Switch, Text, theme, useTheme} from "@nextui-org/react";
import {useTheme as useNextTheme} from "next-themes";

const Footer = () => {

    const {setTheme} = useNextTheme()
    const isDark = useTheme().isDark

    return (
        <div style={{background: theme.colors.accents0.computedValue, marginTop: "auto"}}>

            <Container>

                <Grid.Container gap={2} style={{marginBottom: 0, paddingBottom: 0}}>

                    <Grid xs={0} md={5}>
                        <Switch
                            checked={isDark}
                            onChange={e => {
                                setTheme(e.target.checked ? "dark" : "light")
                            }}
                        />
                    </Grid>

                    <Grid xs={12} md={2} justify={"center"}>
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

                    {/* TODO - figure out how to justify center on xs breakpoint */}
                    <Grid xs={12} md={5} justify={"flex-end"} alignItems={"center"}>
                        <span>Powered by</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`../metaplex_logo_${isDark ? "dark.png" : "light.png"}`}
                            alt={"Metaplex logo"}
                            height={14}
                            width={"auto"}
                            style={{margin: "0 8px"}}
                        />
                        <span>on</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`../solana_logo_${isDark ? "dark.png" : "light.png"}`}
                            alt={"Solana logo"}
                            height={16}
                            width={"auto"}
                            style={{margin: "0 8px"}}
                        />
                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Footer