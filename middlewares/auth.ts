import * as fs from 'fs/promises';
import {Request, ResponseToolkit} from '@hapi/hapi'


const jwtParams = {
    keys: async () => fs.readFile('./key/key.txt'),
    verify: {
        aud: 'api.adomi.fr',
        iss: 'api.adomi.fr',
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15
    },
    validate: (artifacts:any, request: Request, h: ResponseToolkit) => {
        console.log(artifacts)
        return {
            isValid: true,
            credentials: { user: artifacts.decoded.payload }
        }
    }
}

export default jwtParams