import { Checkbox, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Icon, IconButton, InputLabel, Link, ListItemText, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import MDBox from 'components/MDBox'
import propTypes from 'prop-types'
import moment from 'moment'
import { formatDateTime } from 'global/function'
import FileUpload from 'layouts/content_page/careers/file-upload'
import { MuiFileInput } from 'mui-file-input'
import MDTypography from 'components/MDTypography'


export const generateFormInput = (props) => {
    var sx = { my: 2, display: props?.hidden ? 'none' : 'block' }
    if (typeof props.sx == 'undefined') props['sx'] = [sx]
    // console.log('props', props);

    // revise the touched, touched must be pass then init the error and helper for global and custom variables

    switch (props.type) {
        case 'text':
        case 'input':
        case 'number':
        case 'tel':
        case 'email':
            // console.log('text', props);
            return (<TextField {...props} {...props?.options} />)

        case 'radio':
        case 'select':
            props['sx'] = [{ py: '0.75rem' }]
            // console.log('select', props);

            return (
                <FormControl sx={sx} required={props.required} fullWidth={props.fullWidth} error={props?.error}>
                    <InputLabel>{props.label}</InputLabel>
                    <Select
                        {...props}
                    >
                        {props?.options && props.options.map((item, index) => {
                            if ( typeof item == 'object' ) {
                                return (<MenuItem key={index} value={item.id}>{item.title}</MenuItem>)
                            } else {
                                return (<MenuItem key={item} value={item}>{item}</MenuItem>)
                            }
                        })}
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

        case 'check':
            props['sx'] = [{ py: '0.75rem' }]
            props['value'] = props['value'] ? typeof props['value'] === 'string' ? props['value'].split(', ') : props['value'] : []
            console.log('checkbox', props);

            const checkValue = (data, value) => {
                if (data.indexOf(value)) {
                    var index = data.indexOf(value)
                    data.splice(index, 1)
                } else {
                    data.push(value)
                }
                return data
            }

            const handleChange = (e) => {
                const {
                    target: { value },
                } = e;

                props.setFieldValue(props.id, typeof value === 'string' ? value.split(', ') : value.join(', '), props.required)
            }
            props['onChange'] = handleChange

            return (
                <FormControl sx={sx} fullWidth={props.fullWidth} error={props.error}>
                    <InputLabel>{props.label}</InputLabel>
                    <Select
                        {...props}
                        multiple
                        input={<OutlinedInput label={props.label} />}
                        // renderValue={(selected) => (
                        //     <MDBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        //         {selected.map((value) => (
                        //             <Chip key={value} label={value} />
                        //         ))}
                        //     </MDBox>
                        // )} // chip rendered
                        renderValue={(selected) => selected.join(', ')} // word rendered
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250,
                                },
                            },
                            MenuListProps: {
                                style: {
                                    marginTop: 1,
                                    marginBottom: 1,
                                },
                            },
                        }}
                    >
                        {props?.options && props.options.map((item, index) => {
                            if ( typeof item == 'object' ) {
                                return (
                                <MenuItem key={index} value={item.title}>
                                    <Checkbox checked={e => checkValue(props.value, item.title)} />
                                    <ListItemText primary={item.title} />
                                </MenuItem>)
                            } else {
                                return (
                                <MenuItem key={item} value={item}>
                                    <Checkbox checked={props.value.includes(item)} />
                                    <ListItemText primary={item} />
                                </MenuItem>)
                            }
                        })}
                    </Select>
                    {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
                </FormControl>
            )

        case 'file':
            props['value'] ? props['value'] : props['value'] = null
            console.log('file', props);

            return (
                <MuiFileInput
                    {...props}
                    onChange={(e) => props.setFieldValue(props.id, e, props.required)}
                    InputProps={{
                        inputProps: {
                            accept: props?.options,
                        },
                        startAdornment: <Icon>attach_file</Icon>,
                        endAdornment: <IconButton size="small" onClick={() => props.setFieldValue(props.id, null, props.required)}><Icon>close</Icon></IconButton>,
                    }}
                    placeholder="Attach File"
                />
            )

        case 'link':
            // console.log('link', props);

            return (
                <MDBox>
                    <Divider/>
                    <MDTypography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{props?.label}</MDTypography>
                    <MDBox display="grid">
                        {
                            props.options?.map((item, key) => (
                                <Link key={key} color="blue" href={
                                    String(item).match(/https?/g) 
                                    ?   item
                                    :   `https://${item}`
                                } variant='caption' underline='hover' target="_blank">{
                                    String(item).match(/https?/g)
                                    ?   String(item).split('/')[2]
                                    :   String(item).split('/').length
                                    ?   String(item).split('/')[0]
                                    :   item
                                }</Link>
                            ))
                        }
                    </MDBox>
                    <Divider/>
                </MDBox>
            )

        case 'label':
            // console.log('label', props);

            return (
                <MDBox>
                    <Divider/>
                    <MDTypography><div dangerouslySetInnerHTML={{__html: props?.options}} /></MDTypography>
                    <Divider/>
                </MDBox>
            )
    }
}

export const formScrub = (data) => {
    if (typeof data != 'object') return

    Object.keys(data).map((item, index) => {
        if (Array.isArray(data[item])) data[item] = data[item].join(', ') 
    })

    return data
}


generateFormInput.propTypes = {
    props: {
        type: propTypes.string.isRequired,
    }
}