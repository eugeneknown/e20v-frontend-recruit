import { Checkbox, Chip, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import MDBox from 'components/MDBox'
import propTypes from 'prop-types'


export const generateFormInput = (props) => {
    // console.log('props', props);
    var sx = { my: 1 }
    props['sx'] = [sx]

    switch (props.type) {
        case 'text':
        case 'number':
        case 'tel':
        case 'email':
            return (<TextField {...props} />)

        case 'select':
            sx['py'] = '0.75rem'
            props['sx'] = [sx]

            return (
                <FormControl required={props.required} fullWidth={props.fullWidth} error={props?.error}>
                    <InputLabel>{props.label}</InputLabel>
                    <Select
                        {...props}
                    >
                        {props.options.map((item) => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                    {props?.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
                </FormControl>
            )

        case 'date':
            console.log('date', props);
            return (<MobileDateTimePicker {...props} />)

        // case 'checkbox':
        //     return (
        //         <FormControl fullWidth={props.fullWidth} error={props.error}>
        //             <InputLabel>{props.label}</InputLabel>
        //             <Select
        //                 {...props}
        //                 input={<OutlinedInput label={props.label} />}
        //                 renderValue={(selected) => (
        //                     <MDBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        //                       {selected.map((value) => (
        //                         <Chip key={value} label={value} />
        //                       ))}
        //                     </MDBox>
        //                 )}
        //                 MenuProps={{
        //                     PaperProps: {
        //                         style: {
        //                             maxHeight: 48 * 4.5 + 8,
        //                             width: 250,
        //                         },
        //                     }
        //                 }}
        //             >
        //                 {Object.keys(props.options).map((item, index) => (
        //                     <MenuItem key={index} value={props.options[item]}>
        //                         <Checkbox checked={props.value.includes(props.options[item])} />
        //                         <ListItemText primary={props.options[item]} />
        //                     </MenuItem>
        //                 ))}
        //             </Select>
        //             {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        //         </FormControl>
        //     )
    }
}

generateFormInput.propTypes = {
    props: {
        type: propTypes.string.isRequired,
    }
}