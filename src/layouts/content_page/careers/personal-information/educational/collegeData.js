import * as yup from 'yup';
import educationalAttainment from './educational-attainment';
import courses from './courses';


export default [
    {
        id: 'education',
        label: 'Educational Attainment',
        type: 'select',
        required: true,
        options: educationalAttainment,
        hidden: true,
    },
    {
        id: 'school',
        label: 'Name of School',
        type: 'text',
        required: true,
    },
    {
        id: 'course',
        label: 'Course',
        type: 'select',
        required: true,
        options: courses,
    },
    {
        id: 'start_date',
        label: 'Year Attended',
        type: 'date',
        required: true,
        options: { 
            views: ['year'],
            disableFuture: true,
        },
            validations: [
            {
                type: 'when',
                params: [['present', 'end_date'], {
                    is: ((present, end_date) => {
                        return typeof present == 'undefined' || (!(present)) && typeof end_date != 'undefined'
                    }),
                    then: (schema) => schema.max(yup.ref('end_date'), 'Start date cannot be more than End date'),
                }]
            },
        ]
    },
    {
        id: 'end_date',
        label: 'Year Graduated',
        type: 'date',
        required: true,
        options: {
            views: ['year'],
            disableFuture: true,
        },
        validations: [
            {
                type: 'when',
                params: ['present', {
                    is: (present => typeof present == 'undefined' || (!(present))),
                    then: (schema) => schema.min(yup.ref('start_date'), 'End date cannot be less than Start date'),
                    otherwise: (schema) => schema.notRequired()
                }]
            },
        ]
    },
    {
        id: 'present',
        label: 'Presently Enrolled',
        type: 'switch',
        required: false,
    },
    {
        id: 'undergrad',
        label: 'Undergraduate',
        type: 'switch',
        required: false,
    },
]