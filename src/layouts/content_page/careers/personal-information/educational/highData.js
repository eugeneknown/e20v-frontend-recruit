import * as yup from 'yup';
import educationalAttainment from './educational-attainment';
import courses from './courses';


export default [
    {
        id: 'education',
        label: 'Educational Attainment',
        type: 'select',
        required: false,
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
        id: 'end_date',
        label: 'Year Graduated',
        type: 'date',
        required: true,
        options: { 
            views: ['year'],
            disableFuture: true,
        },
    },
]