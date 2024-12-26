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
        label: 'Amenable to work in the office (Matina, Davao)',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
    },
    {
        id: 'transpo',
        label: 'If Yes, do you have own transpo or commute?',
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
        label: 'Any part time work at the moment? (Pls specify)',
        type: 'text',
        required: true,
    },
    {
        id: 'government_requirements',
        label: 'Pre-Employment Requirement (check if applicable or available)',
        type: 'check',
        required: true,
        options: ['SSS ID', 'PHIC ID', 'HDMF ID', '2316 from previous employer', 'Birth Certificate (preferably PSA)', 'Picture with white background (for ID)',
            'Certificate of Employment (recent previous employer', 'TOR'
        ],
    },
  
]