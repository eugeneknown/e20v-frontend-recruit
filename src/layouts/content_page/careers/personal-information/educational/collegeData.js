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
                params: [['present', 'end_date', 'undergrad'], {
                    is: ((present, end_date, undergrad) => {
                        return ((typeof present == 'undefined' || (!(present))) ?? (typeof undergrad == 'undefined' || (!(undergrad)))) && typeof end_date != 'undefined'
                    }),
                    then: (schema) => schema.max(yup.ref('end_date'), 'Year attended cannot be more than year graduated'),
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
            params: [['present', 'undergrad'], {
              is: (present, undergrad) => !present && !undergrad,
              then: (schema) =>
                schema
                  .min(
                    yup.ref('start_date'),
                    'Year Graduated cannot be less than Year Attended'
                  )
                  .test(
                    'min-4-years',
                    'Year Graduated must be at least 4 years after Year Attended',
                    function (value) {
                      const { start_date } = this.parent; // Access sibling field
                      if (!start_date || !value) return true; // Skip validation if either is missing
                      const startYear = new Date(start_date).getFullYear();
                      const endYear = new Date(value).getFullYear();
                      return endYear >= startYear + 4;
                    }
                  ),
              otherwise: (schema) => schema.notRequired(),
            }],
          },
        ],
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