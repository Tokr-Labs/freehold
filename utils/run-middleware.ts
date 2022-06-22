import Cors from "cors"
import {NextApiRequest, NextApiResponse} from "next";


export const runMiddleware = (
    methods: string[],
    req: NextApiRequest,
    res: NextApiResponse
) => {

    const cors = Cors({methods})

    return new Promise((resolve, reject) => {
        cors(req, res, (result: unknown) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })

}
