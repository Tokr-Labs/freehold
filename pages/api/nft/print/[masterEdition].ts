// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import {Nft} from "@metaplex-foundation/js";
import {PublicKey, sendAndConfirmTransaction} from "@solana/web3.js";
import {
    adminWallet,
    AUTHORIZATION_FAILED,
    AuthorizationFailure,
    connection,
    metaplex,
    signable_metaplex
} from "../../constants";
import {basicAuthMiddleware, corsMiddleware} from '../../../../utils/middleware';
import {transferAdminNftTransaction} from "../../../../library/nft/transfer";

type Data = {
    masterEdition: string | string[],
    nft: Nft,
    success?: boolean,
    message?: string,
    error?: string
}

// example POST:
// api/nft/print/2eqiaDuGJNrBniLR2D9YADJfsC9FzyPnfo159L6LKR6G
// creates a print NFT (copy) of the provided master NFT
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AuthorizationFailure>
) {
    const {query: {masterEdition, to}, method} = req;
    const masterEditionKey = new PublicKey(masterEdition);

    await corsMiddleware(["GET", "POST"], req, res)

    switch (method) {

        case 'GET':
            // @TODO: this route should actually return all print editions
            // we may need to crawl the chain, or use `findAllByCreator(adminWallet)`
            const nft: Nft = await metaplex.nfts().findByMint(masterEditionKey);
            res.status(200).json({masterEdition, nft});
            break;

        case 'POST':
            const authorized = basicAuthMiddleware(req);
            if (!authorized) {
                res.status(401).json(AUTHORIZATION_FAILED);
                break;
            }

            const printNft: any = await signable_metaplex.nfts().printNewEdition(masterEditionKey);

            // TODO - better error handling
            if (to) {
                const tx = await transferAdminNftTransaction(printNft.nft.mint, new PublicKey(to));
                await sendAndConfirmTransaction(connection, tx, [adminWallet]);
                res.status(200).json({
                    masterEdition: masterEdition,
                    nft: printNft,
                    success: true,
                    message: `Minted ${printNft.nft.mint} to ${to}`
                });
                break;
            }

            res.status(200).json({masterEdition, nft: printNft});
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
