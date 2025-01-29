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
        label: 'Birthday',
        type: 'date',
        required: true,
        options: { 
            disableFuture: true,
            views: ['year', 'month', 'day'],
            openTo: 'year',
        },
    },
    {
        id: 'relationship',
        label: 'Relationship',
        type: 'text',
        required: true,
    },
]