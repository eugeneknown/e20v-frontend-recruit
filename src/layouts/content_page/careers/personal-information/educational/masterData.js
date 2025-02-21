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
          params: [['present', 'undergrad', 'course'], {
            is: (present, undergrad, course) => !present && !undergrad,
            then: (schema) =>
              schema
                .min(yup.ref('start_date'), 'Year graduated cannot be earlier than year attended.')
                .test(
                  'min-years',
                  function (value) {
                    const { start_date, course } = this.parent;
                    if (!start_date || !value) return true;
  
                    const startYear = new Date(start_date).getFullYear();
                    const endYear = new Date(value).getFullYear();
                    const isDoctorate = /Doctor/i.test(course); // Check if course includes "Doctor"
                    const requiredYears = isDoctorate ? 3 : 2; // Doctorate: 3 years, Master’s: 2 years
  
                    if (endYear < startYear + requiredYears) {
                      return this.createError({
                        message: `Year graduated must be at least ${requiredYears} years after the year attended for ${isDoctorate ? 'doctoral' : 'master’s'} course.`
                      });
                    }
                    return true;
                  }
                ),
            otherwise: (schema) => schema.notRequired(),
          }],
        },
      ],
   },
  
];
