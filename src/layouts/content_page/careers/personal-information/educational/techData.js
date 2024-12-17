import * as yup from 'yup';
import educationalAttainment from './educational-attainment';
import strand from './strand';


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
        id: 'course',
        label: 'Strand',
        type: 'text',
        required: true,
    },
    {
        id: 'end_date',
        label: 'Year Completed',
        type: 'date',
        required: true,
        options: { 
            views: ['year'],
            disableFuture: true,
        },
    },
]