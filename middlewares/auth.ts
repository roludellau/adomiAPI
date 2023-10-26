import * as fs from 'fs/promises';
import {Request, ResponseToolkit} from '@hapi/hapi'


const jwtParams = {
    //keys: async () => fs.readFile('../key/key.txt'),
    keys: 'IceTea',
    verify: {
        aud: ['adomi', /(.*localhost.*)/, /(.*adomi.*)/, /(.*)/],
        iss: 'api.adomi.fr',
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 86400, // 24 hours
        timeSkewSec: 15
    },
    validate: (artifacts:any, request: Request, h: ResponseToolkit) => {
        return {
            isValid: true,
            credentials: { user: artifacts.decoded.payload }
        }
    }
}

export default jwtParams