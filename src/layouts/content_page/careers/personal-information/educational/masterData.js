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
                params: [['present', 'undergrad', 'end_date'], {
                    is: (present, undergrad, end_date) => {
                        return !present && !undergrad && typeof end_date !== 'undefined'; 
                    },
                    then: (schema) =>
                        schema.max(yup.ref('end_date'), 'Year attended cannot be later than year graduated.'),
                }],
            },
        ],
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
                  .min(yup.ref('start_date'), 'Year graduated cannot be earlier than year attended.')
                  .test(
                    'min-2-years',
                    'Year graduated must be at least 2 years after the year attended for master’s programs.',
                    function (value) {
                      const { start_date } = this.parent;
                      if (!start_date || !value) return true; 
                      const startYear = new Date(start_date).getFullYear();
                      const endYear = new Date(value).getFullYear();
                      return endYear >= startYear + 2; 
                    }
                  ),
              otherwise: (schema) => schema.notRequired(),
            }],
          },
        ],
    },
];
