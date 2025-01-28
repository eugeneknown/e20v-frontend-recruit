import * as yup from 'yup';


export default [
    {
        id: 'name',
        label: 'Name',
        type: 'text',
        required: true,
    },
    {
        id: 'company',
        label: 'Company Name',
        type: 'text',
        required: true,
    },
    {
        id: 'position',
        label: 'Position',
        type: 'text',
        required: true,
    },
    {
        id: 'company_email',
        label: 'Company Email',
        type: 'email',
        required: true,
    },
    {
        id: 'email',
        label: 'Personal Email',
        type: 'email',
        required: true,
    },
    {
        id: 'contact_number',
        label: 'Contact Number',
        type: 'tel',
        required: true,
    },
]