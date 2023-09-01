import { Request, ResponseToolkit } from "hapi";
import { Error, ValidationError, ValidationErrorItem } from "sequelize";
import boom from "@hapi/boom"
import validator from "validator";



export default class ValidationUtils {
    
    private propertiesToNotEscape: {[key: string]: unknown} = {
        "password": true,
    }

    public escapeInputs(input: {[key: string]: string|void}): void{
        for (const key in input){
            if (this.propertiesToNotEscape[key]) {
                continue;
            }
            input[key] = validator.escape(input[key] ?? "")
        }
    }

    public getSequelizeErrors(err: ValidationError, h: ResponseToolkit){
        if (!err.errors) {
            console.log(err)
            return boom.badImplementation(err.message)
        }

        type apiErr = { message: string, field: string|null }
        let errorList: apiErr[] = []

        errorList = err.errors.map((item: ValidationErrorItem) => { return { field: item.path, message: item.message } })
        return h.response({
            statusCode: 422,
            statusName: "Unprocessable Entity",
            errors: errorList
        })
        .code(422)
    }

    public validatePassword(password: string): [boolean, boom.Boom|void] {
        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[\wÀ-ÖØ-öø-ÿ@$!%*#?&µ£~|\-\.]{10,255}$/) // pour char spécial requis, à mettre derrière le 2ème lookahead : (?=.*[@$!%*#?&µ£\.\/\\~|\-])

        if (!password.match(regex)) {
            return [false, boom.badData('Votre mot de passe doit contenir une lettre, un chiffre, un caractère spécial, et faire au moins 10 caractères')]
        }

        return [true, undefined]
    }
}