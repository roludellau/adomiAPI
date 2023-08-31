import { Request, ResponseToolkit } from "hapi";
import { Error, ValidationError, ValidationErrorItem } from "sequelize";
import boom from "@hapi/boom"
import validator from "validator";



export default class ValidationUtils {
    
    private propertiesToNotEscape: {[key: string]: unknown} = {
        "password": true,
    }

    public escapeInputs(input: {[key: string]: string|void}){
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

}