import * as yup from 'yup';
import educationalAttainment from './educational-attainment';
import courses from './masterCourses';


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
                    then: (schema) => schema.max(yup.ref('end_date'), 'Start date cannot be more than end date.'),
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
            params: [['present'], {
              is: (present) => typeof present === 'undefined' || !present,
              then: (schema) =>
                schema
                  .min(yup.ref('start_date'), 'End date cannot be less than Start date')
                  .test(
                    'min-2-years',
                    'Year graduated must be at least 2 years after year started for master’s programs.',
                    function (value) {
                      const { start_date } = this.parent;
                      if (!start_date || !value) return true; // Skip validation if fields are missing
                      const startYear = new Date(start_date).getFullYear();
                      const endYear = new Date(value).getFullYear();
                      return endYear >= startYear + 2; // Ensure at least 2 years difference
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
]