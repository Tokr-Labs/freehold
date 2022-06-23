import React, {useContext, useState} from "react";
import {Button, Container, Dropdown, Grid, Spacer, theme} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import {NetworkContext} from "../contexts/network-context";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";

const Navbar = () => {

    const {setNetwork} = useContext(NetworkContext)

    const [selected, setSelected] = useState("devnet");

    return (
        <div style={{background: theme.colors.accents0.computedValue}}>

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

                        <Dropdown>
                            <Dropdown.Button flat css={{tt: "capitalize"}}>
                                {selected}
                            </Dropdown.Button>
                            <Dropdown.Menu
                                aria-label="network selection"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selected}
                                onSelectionChange={keys => {
                                    // @ts-ignore
                                    const [selection] = keys
                                    setSelected(selection)

                                    selection === "devnet"
                                        ? setNetwork(WalletAdapterNetwork.Devnet)
                                        : setNetwork(WalletAdapterNetwork.Mainnet)
                                }}
                            >
                                <Dropdown.Item key="devnet">Devnet</Dropdown.Item>
                                <Dropdown.Item key="mainnet">Mainnet</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Spacer x={1}/>

                        <WalletMultiButton/>

                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Navbar