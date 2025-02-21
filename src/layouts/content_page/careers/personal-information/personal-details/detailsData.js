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
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
    },
    {
        id: 'work_in_office',
        label: 'Amenable to work in the office (Juna Subd. Matina Davao, Davao)',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
    },
    {
        id: 'transpo',
        label: 'If Yes, do you have own transportation or commute?',
        type: 'text',
        required: true,
    },
    {
        id: 'application',
        label: 'Any pending application with other Company?',
        type: 'select',
        required: true,
        options:['Yes','No'],
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
        label: 'Any plan/booked travel for the next 30 days? (please specify the date and where)',
        type: 'text',
        required: true,
    },
    {
        id: 'condition',
        label: 'Any underlying health/medical conditions? (please specify)',
        type: 'text',
        required: true,
    },
    {
        id: 'part_time',
        label: 'Any part time work at the moment? (please specify)',
        type: 'text',
        required: true,
    },
    {
        id: 'government_requirements',
        label: 'Pre-Employment Requirements (check if applicable or available)',
        type: 'check',
        required: true,
        options: ['SSS ID', 'PHIC ID', 'HDMF ID', 'BIR 2316 (from latest company)', 'Birth Certificate (preferably PSA)', '2x2 picture with white background (for ID purposes)',
            'Certificate of Employment (most recent)', 'TOR', 'None of the Above'
        ],
    },
  
]