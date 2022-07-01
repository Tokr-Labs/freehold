import {Connection} from "@solana/web3.js";
import {Metaplex} from "@metaplex-foundation/js";
import {getConnection} from "./get-connection";

export const getMetaplex = (connection?: Connection): Metaplex => {
    connection = connection || getConnection();
    return new Metaplex(connection);
}