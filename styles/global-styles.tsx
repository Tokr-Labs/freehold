import React from "react";
import {globalCss, theme} from "@nextui-org/react";

export const globalStyles = globalCss({

    body: {
        padding: 0,
        margin: 0,
        fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
         Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`
    },

    a: {
        color: "inherit",
        textDecoration: "none"
    },

    // Modifying the color of input fields for dark mode
    ".dark-theme .nextui-c-eXOOPO": {
        backgroundColor: theme.colors.accents1.computedValue + " !important"
    },

    ".wallet-adapter-button": {
        height: "40px !important",
        borderRadius: theme.radii.md.computedValue + " !important"
    }

})
