import React, {useContext, useState} from "react";
import {Dropdown, Spacer, theme} from "@nextui-org/react";
import {FiServer} from "react-icons/fi";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {NetworkContext} from "../../contexts/network-context";

export const NavbarRpcNetworkDropdown = () => {

    const {setNetwork} = useContext(NetworkContext)

    const [selected, setSelected] = useState("devnet");
    const [selectedKeys, setSelectedKeys] = useState(new Set(["devnet"]));

    return (

        <Dropdown disableAnimation={true}>

            <Dropdown.Button
                flat
                ripple={false}
                animated={false}
                css={{
                    tt: "capitalize",
                    color: theme.colors.text.computedValue,
                    backgroundColor: theme.colors.neutralLight.computedValue
                }}
            >

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
    )

}