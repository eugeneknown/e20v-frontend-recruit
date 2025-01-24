import * as yup from 'yup';
import moment from 'moment';


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
        openTo: 'month',
    },
    // component: (props) => {
    //     const value = moment(props.value);
    //     return (
    //         <LocalizationProvider dateAdapter={AdapterMoment}>
    //             <DesktopDatePicker
    //                 {...props}
    //                 value={value.isValid() ? value : null}
    //                 renderInput={(params) => <TextField {...params} />}
    //             />
    //         </LocalizationProvider>
    //     );
    // },
    validations: [
        {
            type: 'when',
            params: [['present', 'end_date'], {
                is: (present, end_date) => {
                    return typeof present == 'undefined' || (!(present)) && typeof end_date != 'undefined'
                },
                then: (schema) => schema.max(yup.ref('end_date'), 'Start date cannot be more than End date'),
            }]
        },
    ]
},
{
    id: 'end_date',
    label: 'End Date',
    type: 'date',
    required: true,
    options: {
        views: ['month', 'year'],
        openTo: 'month',
        // maxDate: new Date(new Date().getFullYear() + 1, 11, 31), // still keeping the max date as before
    },
    // component: (props) => {
    //     const value = moment(props.value);
    //     const startDate = moment(props.formValues.start_date); // Get start date from the form values
    //     return (
    //         <LocalizationProvider dateAdapter={AdapterMoment}>
    //             <DesktopDatePicker
    //                 {...props}
    //                 value={value.isValid() ? value : null}
    //                 minDate={startDate.isValid() ? startDate : null} // Set minimum date as start date
    //                 renderInput={(params) => <TextField {...params} />}
    //             />
    //         </LocalizationProvider>
    //     );
    // },
    validations: [
        {
            type: 'when',
            params: ['present', {
                is: (present) => typeof present === 'undefined' || !present,
                then: (schema) => 
                    schema
                        .min(yup.ref('start_date'), 'End date cannot be less than Start date')
                        .max(moment().endOf('year'), 'End date cannot exceed December 31 of the current year'),
                        // .max(moment().endOf('year')), 'End date cannot exceed December 31 of the current year'),
                otherwise: (schema) => schema.notRequired(),
            }]
        },
    ],
},
    {
        id: 'description',
        label: 'Description',
        type: 'textfield',
        required: false,
    },
]