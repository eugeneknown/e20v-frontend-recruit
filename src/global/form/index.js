import { Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, Icon, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import MDBox from 'components/MDBox'
import propTypes from 'prop-types'
import moment from 'moment'
import { formatDateTime } from 'global/function'


export const generateFormInput = (props) => {
    // console.log('props', props);
    var sx = { my: 1 }
    props['sx'] = [sx]

    // revise the touched, touched must be pass then init the error and helper for global and custom variables

    switch (props.type) {
        case 'text':
        case 'number':
        case 'tel':
        case 'email':
            return (<TextField {...props} />)

        case 'select':
            props['sx'] = [{ py: '0.75rem' }]
            // console.log('select', props);

            return (
                <FormControl sx={sx} required={props.required} fullWidth={props.fullWidth} error={props?.error}>
                    <InputLabel>{props.label}</InputLabel>
                    <Select
                        {...props}
                    >
                        {props.options.map((item) => (
                            <MenuItem key={item} value={item.toLowerCase()}>{item}</MenuItem>
                        ))}
                    </Select>
                    {props?.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
                </FormControl>
            )

        case 'date':
            let valueProps = {}
            if (props.value) valueProps['value'] = moment(props.value)
            props['closeOnSelect'] = true
            // console.log('date', props, valueProps);
            return (
                <MobileDatePicker
                    onChange={(value) => props.setFieldValue(props.id, formatDateTime(value, 'YYYY-MM-DD'), props.required)}
                    onOpen={() => props.setFieldTouched(props.id, true, props.required)}
                    {...valueProps}
                    label={props.label}
                    name={props.name}
                    sx={props.sx}
                    disabled={props?.disabled ? props.disabled : false}
                    slotProps={{
                        textField: {
                            fullWidth: props.fullWidth,
                            required: props.required,
                            error: props.error,
                            helperText: props.helperText,
                        }
                    }}
                    {...props?.options}
                />
            )

        case 'switch':
            props['sx'] = {
                ...sx,
                display: 'flex',
                alignItems: 'center',
            }
            // console.log('debug switch', props);
            return (
                <FormControlLabel 
                    required={props.required} 
                    label={props.label} 
                    sx={props.sx}
                    control={<Switch
                        name={props.name}
                        checked={props.value}
                        onChange={(value) => props.setFieldValue(props.id, value.target.checked, props.required)}
                    />} 
                />
            )

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