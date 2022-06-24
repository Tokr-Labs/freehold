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

export const basicAuthMiddleware = (req: NextApiRequest) => {
    const basicAuth = req.headers.authorization;
    if (basicAuth){
        const auth = basicAuth.split(' ')[1]
        const [user, password] = Buffer.from(auth, 'base64').toString().split(':')
        if (
            user === process.env.BASIC_AUTH_USER &&
            password === process.env.BASIC_AUTH_PASSWORD
        ) {
            return true
        }
    }
    return false
}