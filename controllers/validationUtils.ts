import { Request, ResponseToolkit } from "hapi";
import { Error, ValidationError, ValidationErrorItem } from "sequelize";
import boom from "@hapi/boom"
import validator from "validator";


export default class ValidationUtils {
    
    private propertiesToNotEscape: {[key: string]: unknown} = {
        "password": true,
    }

    public escapeInputs(input: {[key: string]: unknown}): void {
        for (const key in input){
            if (this.propertiesToNotEscape[key] || typeof input[key] !== "string") {
                continue;
            }
            input[key] = validator.escape((input[key] as string) ?? "")
        }
    }

    public getSequelizeErrors(err: ValidationError, h: ResponseToolkit) {
        // if no validation errors, then standard error
        if (!err.errors) {
            console.log(err)
            return boom.badImplementation(err.message)
        }

        type apiErr = { message: string, field: string|null }
        let errorList: apiErr[] = []

        errorList = err.errors.map((item: ValidationErrorItem) => ({ field: item.path, message: item.message }) )
        return h.response({
            statusCode: 422,
            statusName: "Unprocessable Entity",
            errors: errorList
        })
        .code(422)
    }

    public no_handler_get_sequelize_error(err: ValidationError) {
        // if no validation errors, then standard error
        if (!err.errors) {
            console.log(err)
            return [err.message]
        }

        type apiErr = { message: string, field: string|null }
        let errorList: apiErr[] = []

        errorList = err.errors.map((item: ValidationErrorItem) => ({ field: item.path, message: item.message }) )
        return errorList
    }

    public validatePassword(password: string): [boolean, (boom.Boom|void)] {
        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[\wÀ-ÖØ-öø-ÿ@$!%*#?&µ£~|\-\.]{10,255}$/) // pour char spécial requis, à mettre derrière le 2ème lookahead : (?=.*[@$!%*#?&µ£\.\/\\~|\-])

        if (!password.match(regex)) {
            return [false, boom.badData('Votre mot de passe doit contenir une lettre, un chiffre, un caractère spécial, et faire au moins 10 caractères')]
        }

        return [true, undefined]
    }
}