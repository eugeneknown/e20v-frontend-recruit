export default [
    {
        id: 'salary',
        label: 'Salary Expectation (in Peso)',
        type: 'text',
        required: true,
    },
    {
        id: 'us_time',
        label: 'Amenable to US Time (Night Shift)',
        type: 'text',
        required: true,
    },
    {
        id: 'work_in_office',
        label: 'Amenable to work in the office (Matina, Davao)',
        type: 'text',
        required: true,
    },
    {
        id: 'transpo',
        label: 'If Yes, do you have own transpo or commute?',
        type: 'text',
        required: true,
    },
    {
        id: 'application',
        label: 'Pending Application with other Company',
        type: 'text',
        required: true,
    },
    {
        id: 'platforms_id',
        label: 'Source (where did you find us)',
        type: 'select',
        required: true,
    },
    {
        id: 'start',
        label: 'Availability to Start',
        type: 'text',
        required: true,
    },
    {
        id: 'travel',
        label: 'Any plan/booked travel for the next 30 days? (pls specify the date and where)',
        type: 'text',
        required: true,
    },
    {
        id: 'condition',
        label: 'Any underlying health/medical conditions? (pls specify)',
        type: 'text',
        required: true,
    },
    {
        id: 'part_time',
        label: 'Any part time work at the moment (pls specify)',
        type: 'text',
        required: true,
    },
]