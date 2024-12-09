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
    },
    {
        id: 'course',
        label: 'Course',
        type: 'select',
        required: true,
        options: courses,
    },
    {
        id: 'school',
        label: 'School',
        type: 'text',
        required: true,
    },
    {
        id: 'present',
        label: 'Currently Enrolled',
        type: 'switch',
        required: false,
    },
    {
        id: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        options: { 
            views: ['month', 'year'],
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
        label: 'End Date',
        type: 'date',
        required: true,
        options: { 
            views: ['month', 'year'],
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
    // {
    //     id: 'description',
    //     label: 'Description',
    //     type: 'textfield',
    //     required: false,
    // },
]