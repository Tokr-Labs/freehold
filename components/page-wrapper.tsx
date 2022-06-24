import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

// @ts-ignore
const PageWrapper = ({children}) => {

    return (
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <Navbar/>
            {children}
            <Footer/>
        </div>
    )

}

export default PageWrapper