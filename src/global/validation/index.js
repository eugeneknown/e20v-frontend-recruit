import * as yup from "yup";

export const generateYupSchema = (schema, config) => {
    const { id, validationType, validations = [] } = config;
    // validation
    if (!yup[validationType]) {
        return schema;
    }

    let validator = yup[validationType]();
    validations.forEach(validation => {
        const { params, type } = validation;
        // validation
        if (!validator[type]) {
            return;
        }
        validator = validator[type](...params);
    });

    schema[id] = validator;
    return schema;
}



export const generateObjectSchema = (data) => {
    var object = []

    Object.keys(data).map((item, index) => {
        var tempObject = {...data[item]}
        var tempValidations = 'validations' in data[item] ? data[item]['validations'] : []

        // is required
        if (data[item]['required']) {
            tempValidations.push({
                type: "required",
                params: ["This field is required"],
            })
        }

        switch (data[item]['type']) {
            case 'select':
            case 'checkbox':
            case 'text':
                tempObject['validationType'] = 'string'
                break;

            case 'number':
                tempObject['validationType'] = 'number'
                tempValidations.push({
                    type: "positive",
                    params: ['Number must be positive'],
                })
                break;

            case 'tel':
                tempObject['validationType'] = 'string'
                tempValidations.push({
                    type: "min",
                    params: [11, "Contact cannot be less than 11 digit" ],
                })
                tempValidations.push({
                    type: "max",
                    params: [11, "Contact cannot be more than 11 digit" ],
                })
                tempValidations.push({
                    type: "matches",
                    params: [/^09\d{9}$/, { message: 'It must be started with (09)' }],
                })
                break;

            case 'email':
                tempObject['validationType'] = 'string'
                tempValidations.push({
                    type: "matches",
                    params: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { message: 'Invalid email format' }],
                })
                break;

            case 'date':
                tempObject['validationType'] = 'date'
                break;
        }

        tempObject['validations'] = tempValidations
        object.push(tempObject)

    })

    return object
}