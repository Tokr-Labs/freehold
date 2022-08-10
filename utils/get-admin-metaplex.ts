import {Connection} from "@solana/web3.js";
import {keypairIdentity, Metaplex} from "@metaplex-foundation/js";
import {adminWallet} from "./constants";

export const getAdminMetaplex = (connection: Connection) => {
    return new Metaplex(connection).use(keypairIdentity(adminWallet))
}
