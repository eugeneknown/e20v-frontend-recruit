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
        id: 'school',
        label: 'Name of School',
        type: 'text',
        required: true,
    },
    {
        id: 'course',
        label: 'Strand',
        type: 'select',
        required: true,
        options: strand,
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