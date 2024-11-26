export default [
    {
        id: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
    },
    {
        id: 'middle_name',
        label: 'Middle Name',
        type: 'text',
        required: true,
    },
    {
        id: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
    },
    {
        id: 'nickname',
        label: 'Nickname',
        type: 'text',
        required: true,
    },
    {
        id: 'civil_status',
        label: 'Civil Status',
        type: 'select',
        required: true,
        options: ['Single', 'Married', 'Widowed'],
    },
    {
        id: 'contact_number',
        label: 'Mobile Number',
        type: 'tel',
        required: true,
        validations: [
            {
                type: "min",
                params: [11, "Contact number cannot be less than 11 numbers"],
            },
            {
                type: "max",
                params: [11, "Contact number cannot be more than 11 numbers"],
            },
        ],
    },
    {
        id: 'alternative_number',
        label: 'Alternative Mobile Number',
        type: 'tel',
        required: true,
        validations: [
            {
                type: "min",
                params: [11, "Alternative contact cannot be less than 11 numbers"],
            },
            {
                type: "max",
                params: [11, "Alternative contact cannot be more than 11 numbers"],
            },
        ],
    },
    {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Others'],
    },
    {
        id: 'age',
        label: 'Age',
        type: 'number',
        required: true,
    },
    {
        id: 'email',
        label: 'Email',
        type: 'email',
        required: true,
    },
    {
        id: 'birth_place',
        label: 'Birth Place',
        type: 'text',
        required: true,
    },
    {
        id: 'birth_order',
        label: 'Birth Order',
        type: 'number',
        required: true,
    },
    {
        id: 'birthday',
        label: 'Date of Birth',
        type: 'date',
        required: true,
    },
    {
        id: 'children',
        label: 'Children (if applicable)',
        type: 'text',
        required: true,
    },
    {
        id: 'permanent_address',
        label: 'Permanent Address',
        type: 'text',
        required: true,
    },
    {
        id: 'present_address',
        label: 'Present Address',
        type: 'text',
        required: true,
    },
    {
        id: 'education',
        label: 'Educational Attainment',
        type: 'select',
        required: true,
        options: ['College Graduate', 'High School Graduate', 'Senior High', 'College Level', 'Master\'s Degree'],
    },
    {
        id: 'course',
        label: 'Course',
        type: 'text',
        required: true,
    },
]