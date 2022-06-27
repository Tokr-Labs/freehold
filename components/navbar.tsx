import React, {useContext, useState} from "react";
import {Button, Container, Dropdown, Grid, Modal, Spacer, Switch, Text, theme, useTheme} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import {NetworkContext} from "../contexts/network-context";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {FiHome, FiMenu, FiPlus, FiSearch, FiServer} from "react-icons/fi";
import {useTheme as useNextTheme} from "next-themes";

const Navbar = () => {

    const {setNetwork} = useContext(NetworkContext)

    const [selected, setSelected] = useState("devnet");
    const [selectedKeys, setSelectedKeys] = useState(new Set(["devnet"]));

    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const openHandler = () => setIsModalVisible(true);
    const closeHandler = () => setIsModalVisible(false);

    const {setTheme} = useNextTheme()
    const isDark = useTheme().isDark

    return (
        <div style={{background: theme.colors.accents0.computedValue}}>

            <Container>

                <Grid.Container gap={2} style={{margin: "0 -12px", padding: "0 12px"}}>

                    <Grid xs={4}>
                        <Link href={"/"}>
                            <Button auto>Logo Placeholder</Button>
                        </Link>
                    </Grid>

                    <Grid xs={8} md={0} justify={"flex-end"}>

                        <FiMenu size={40} onClick={openHandler} style={{cursor: "pointer"}}/>

                        <Modal
                            closeButton
                            open={isModalVisible}
                            aria-label={"mobile menu modal"}
                            onClose={closeHandler}
                        >

                            <Modal.Header>
                                <Text h3>Menu</Text>
                            </Modal.Header>

                            <Modal.Body>

                                <Link href={"/"}>
                                    <Button>
                                        <FiHome/>
                                        <Spacer x={0.5}/>
                                        <Text color={"white"}>Home</Text>
                                    </Button>
                                </Link>

                                <Link href={"/create"}>
                                    <Button>
                                        <FiPlus/>
                                        <Spacer x={0.5}/>
                                        <Text color={"white"}>Create</Text>
                                    </Button>
                                </Link>

                                <Link href={"/explore"}>
                                    <Button>
                                        <FiSearch/>
                                        <Spacer x={0.5}/>
                                        <Text color={"white"}>Explore</Text>
                                    </Button>
                                </Link>

                                <WalletMultiButton onClick={closeHandler}/>

                            </Modal.Body>

                            <Modal.Footer justify={"space-between"}>

                                <Dropdown>
                                    <Dropdown.Button flat css={{tt: "capitalize"}}>
                                        <FiServer/>
                                        <Spacer x={0.5}/>
                                        {selected}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="network selection"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={keys => {
                                            // @ts-ignore
                                            setSelectedKeys(keys)

                                            // @ts-ignore
                                            const [selection] = keys
                                            setSelected(selection)

                                            selection === "devnet"
                                                ? setNetwork(WalletAdapterNetwork.Devnet)
                                                : setNetwork(WalletAdapterNetwork.Mainnet)
                                        }}
                                    >
                                        <Dropdown.Item key="devnet">Devnet</Dropdown.Item>
                                        <Dropdown.Item key="mainnet-beta">Mainnet-beta</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Switch
                                    checked={isDark}
                                    onChange={e => {
                                        setTheme(e.target.checked ? "dark" : "light")
                                    }}
                                />
                            </Modal.Footer>

                        </Modal>

                    </Grid>

                    <Grid xs={0} md={8} justify={"flex-end"}>

                        <Dropdown>
                            <Dropdown.Button flat css={{tt: "capitalize"}}>
                                <FiServer/>
                                <Spacer x={0.5}/>
                                {selected}
                            </Dropdown.Button>
                            <Dropdown.Menu
                                aria-label="network selection"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedKeys}
                                onSelectionChange={keys => {
                                    // @ts-ignore
                                    setSelectedKeys(keys)

                                    // @ts-ignore
                                    const [selection] = keys
                                    setSelected(selection)

                                    selection === "devnet"
                                        ? setNetwork(WalletAdapterNetwork.Devnet)
                                        : setNetwork(WalletAdapterNetwork.Mainnet)
                                }}
                            >
                                <Dropdown.Item key="devnet">Devnet</Dropdown.Item>
                                <Dropdown.Item key="mainnet-beta">Mainnet-beta</Dropdown.Item>
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