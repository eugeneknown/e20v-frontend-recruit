export default [
    {
        id: 'company',
        label: 'Company',
        type: 'text',
        required: true,
    },
    {
        id: 'position_held',
        label: 'Position Held',
        type: 'text',
        required: true,
    },
    {
        id: 'department',
        label: 'Department',
        type: 'text',
        required: true,
    },
    {
        id: 'handled',
        label: 'Account/s Handled (if BPO experience)',
        type: 'text',
        required: true,
    },
    {
        id: 'leave_reason',
        label: 'Reason of leaving',
        type: 'text',
        required: true,
    },
    {
        id: 'salary',
        label: 'Last Salary',
        type: 'text',
        required: true,
    },
    {
        id: 'present',
        label: 'Currently Working',
        type: 'switch',
        required: false,
    },
    {
        id: 'start_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        options: { 
            views: ['month', 'year'],
            disableFuture: true,
        },
    },
    {
        id: 'end_date',
        label: 'End Date',
        type: 'date',
        required: true,
        options: { 
            views: ['month', 'year'],
            disableFuture: true,
        },
    },
    {
        id: 'description',
        label: 'Description',
        type: 'textfield',
        required: false,
    },
]