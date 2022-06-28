import React from "react";
import {Button, Container, Grid, Modal, Spacer, Switch, Text, theme, useTheme} from "@nextui-org/react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import {FiHome, FiMenu, FiPlus, FiSearch} from "react-icons/fi";
import {useTheme as useNextTheme} from "next-themes";
import {NavbarMobileMenuButton} from "./navbar-mobile-menu-button";
import {NavbarRpcNetworkDropdown} from "./navbar-rpc-network-dropdown";

const Navbar = () => {

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
                            <Button auto light>
                                <Text size={40} weight={"extrabold"}>
                                    Freehold
                                </Text>
                            </Button>
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

                                <NavbarMobileMenuButton href={"/"} icon={<FiHome/>} text={"Home"}/>
                                <NavbarMobileMenuButton href={"/create"} icon={<FiPlus/>} text={"Create"}/>
                                <NavbarMobileMenuButton href={"/explore"} icon={<FiSearch/>} text={"Explore"}/>

                                <WalletMultiButton onClick={closeHandler}/>

                            </Modal.Body>

                            <Modal.Footer justify={"space-between"}>

                                <Switch
                                    checked={isDark}
                                    onChange={e => {
                                        setTheme(e.target.checked ? "dark" : "light")
                                    }}
                                />

                                <NavbarRpcNetworkDropdown/>

                            </Modal.Footer>

                        </Modal>

                    </Grid>

                    <Grid xs={0} md={8} justify={"flex-end"}>

                        <NavbarRpcNetworkDropdown/>

                        <Spacer x={1}/>

                        <WalletMultiButton/>

                    </Grid>

                </Grid.Container>

            </Container>

        </div>
    )

}

export default Navbar