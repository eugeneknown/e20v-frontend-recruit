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
        id: 'religion',
        label: 'Religion',
        type: 'text',
        required: true,
    },
    {
        id: 'civil_status',
        label: 'Civil Status',
        type: 'select',
        required: true,
        options: ['Single', 'Married', 'Widowed', 'Separated'],
    },
    {
        id: 'contact_number',
        label: 'Mobile Number',
        type: 'tel',
        required: true,
    },
    {
        id: 'alternative_number',
        label: 'Alternative Mobile Number',
        type: 'tel',
        required: true,
    },
    {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Others'],
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
        options: { 
            disableFuture: true,
        },
    },
    {
        id: 'children',
        label: 'Dependents / Children',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
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