import React from "react";

// @ts-ignore
const PageWrapper = ({children}) => {

    return (
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            {children}
        </div>
    )

}

export default PageWrapper