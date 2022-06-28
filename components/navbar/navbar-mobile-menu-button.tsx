import React from "react";
import {Button, Spacer, Text} from "@nextui-org/react";
import Link from "next/link";

interface NavbarMobileMenuButtonProps {
    href: string,
    icon: React.ReactElement,
    text: string
}

export const NavbarMobileMenuButton = (props: NavbarMobileMenuButtonProps) => {

    return (
        <Link href={props.href}>
            <Button>
                {props.icon}
                <Spacer x={0.5}/>
                <Text color={"white"}>{props.text}</Text>
            </Button>
        </Link>
    )

}