import * as yup from 'yup';


export default [
    {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true,
    },
    {
        id: 'birthday',
        label: 'Day of Birth',
        type: 'date',
        required: true,
        options: { 
            disableFuture: true,
            views: ['month', 'day', 'year'],
            openTo: 'month',
        },
    },
    {
        id: 'relationship',
        label: 'Relationship',
        type: 'text',
        required: true,
    },
]