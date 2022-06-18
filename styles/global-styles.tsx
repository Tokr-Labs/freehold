import React from "react";
import {globalCss} from "@nextui-org/react";

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
    }
})
