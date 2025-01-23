
        // case 'date':
        //     let valueProps = {}
        //     if (props.value) valueProps['value'] = moment(props.value)
        //     props['closeOnSelect'] = true
        //     console.log('date', props, valueProps);
        //     return (
        //         <MobileDatePicker
        //             onChange={(value) => props.setFieldValue(props.id, formatDateTime(value, 'YYYY-MM-DD'), props.required)}
        //             onOpen={() => props.setFieldTouched(props.id, true, props.required)}
        //             {...valueProps}
        //             label={props.label}
        //             name={props.name}
        //             sx={props.sx}
        //             disabled={props?.disabled ? props.disabled : false}
        //             slotProps={{
        //                 textField: {
        //                     fullWidth: props.fullWidth,
        //                     required: props.required,
        //                     error: props.error,
        //                     helperText: props.helperText,
        //                 }
        //             }}
        //             {...props?.options}
        //         />
        //     )

      
import React, { useState } from 'react';
import {
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Icon,
    IconButton,
    InputLabel,
    Link,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    TextField,
    Button,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import MDBox from 'components/MDBox';
import propTypes from 'prop-types';
import moment from 'moment';
import { formatDateTime } from 'global/function';
import FileUpload from 'layouts/content_page/careers/file-upload';
import { MuiFileInput } from 'mui-file-input';
import MDTypography from 'components/MDTypography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const CheckboxField = ({ props, sx, handleChange }) => {
    const [open, setOpen] = useState(false); // Dropdown open/close state
    const [selectedValues, setSelectedValues] = useState(
        props.value && Array.isArray(props.value) ? props.value : [] // Ensure initial value is empty array if no valid value is provided
    );
    const handleDropdownToggle = () => {
        setOpen((prevOpen) => !prevOpen); // Toggle dropdown open/close state
    };
    const handleSelectionChange = (event) => {
        const {
            target: { value },
        } = event;
        // Ensure the selected values are handled as an array
        const newValues = typeof value === 'string' ? value.split(', ') : value;
        setSelectedValues(newValues); // Update selected values
        handleChange(event); // Call parent-provided handleChange
    };
    const handleSaveCheckedFields = () => {
        console.log('Checked Fields:', selectedValues); // Log selected values
        setOpen(false); // Close dropdown only when "OK" is clicked
    };
    return (
        <FormControl sx={sx} fullWidth={props.fullWidth} error={props.error}>
            <InputLabel shrink>{props.label}</InputLabel> {/* Always keep the label floating */}
            <Select
                {...props}
                multiple
                open={open}
                value={selectedValues} // Use the array for selected values
                input={<OutlinedInput notched label={props.label} />}
                renderValue={(selected) => {
                    // Show placeholder when no values are selected
                    if (selected.length === 0) {
                        return (
                            <em style={{ color: '#9E9E9E' }}>
                                {props.placeholder || 'Select options'}
                            </em>
                        );
                    }
                    return (
                        <div>
                            {selected.map((value, index) => (
                                <div key={index}>{value}</div>
                            ))}
                        </div>
                    );
                }}
                onOpen={() => setOpen(true)} // Open dropdown
                onClose={() => {
                    // Prevent dropdown from closing when clicking outside
                    if (open) setOpen(true);
                }}
                onChange={handleSelectionChange}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4.5 + 8,
                            width: 250,
                        },
                        onMouseDown: (event) => event.stopPropagation(), // Prevent click propagation for the dropdown menu
                    },
                }}
            >
                {props?.options?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Checkbox checked={selectedValues.includes(item)} />
                        <ListItemText primary={item} />
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem disableRipple>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSaveCheckedFields}
                    >
                        OK
                    </Button>
                </MenuItem>
            </Select>
            {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
};
export const generateFormInput = (props) => {
    const sx = { my: 2, display: props?.hidden ? 'none' : 'block' };
    if (typeof props.sx === 'undefined') props['sx'] = [sx];
    switch (props.type) {
        case 'text':
        case 'number':
        case 'tel':
        case 'email':
            return <TextField {...props} {...props?.options} />;
        case 'radio':
        case 'select':
            props['sx'] = [{ py: '0.75rem' }];
            return (
                <FormControl sx={sx} required={props.required} fullWidth={props.fullWidth} error={props?.error}>
                    <InputLabel>{props.label}</InputLabel>
                    <Select {...props}>
                        {props?.options &&
                            props.options.map((item, index) =>
                                typeof item === 'object' ? (
                                    <MenuItem key={index} value={item.id}>
                                        {item.title}
                                    </MenuItem>
                                ) : (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                )
                            )}
                    </Select>
                    {props?.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
                </FormControl>
            );
        case 'date': 
            let valueProps = {};
            if (props.value) {
                const mom = moment(props.value);
                if (mom.isValid()) {
                    valueProps['value'] = mom.toDate(); // Convert moment object to Date object
                } else {
                    valueProps['value'] = null; 
                }
            } else {
                valueProps['value'] = null; 
            }
        
            props['closeOnSelect'] = true;
        
            // Set the views for the date picker
            const views = props.id === 'end_date' ? ['year'] : ['year', 'month', 'day'];
        
            // Dynamically adjust options for the end date field
            const updatedOptions = { ...props?.options };
            if (props.id === 'end_date' && props.formValues && props.formValues.start_date) {
                const startDate = moment(props.formValues.start_date);
                if (startDate.isValid()) {
                    updatedOptions.minDate = startDate.toDate(); // Set the minDate to start_date
                }
            }
        
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                        onChange={(value) => {
                            const formattedDate = moment(value).format('YYYY-MM-DD');
                            props.setFieldValue(props.id, formattedDate, props.required);
                        }}
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
                            },
                        }}
                        views={views}
                        {...updatedOptions} 
                    />
                </LocalizationProvider>
            );
        
                
        case 'switch':
            props['sx'] = {
                ...sx,
                display: 'flex',
                alignItems: 'center',
            };
            return (
                <FormControlLabel
                    required={props.required}
                    label={props.label}
                    sx={props.sx}
                    control={
                        <Switch
                            name={props.name}
                            checked={props.value}
                            onChange={(value) =>
                                props.setFieldValue(props.id, value.target.checked, props.required)
                            }
                        />
                    }
                />
            );
        case 'check':
            props['sx'] = [{ py: '0.75rem' }];
            props['value'] =
                props['value'] && typeof props['value'] === 'string'
                    ? props['value'].split(', ')
                    : props['value'] || [];
            const handleChange = (e) => {
                const {
                    target: { value },
                } = e;
                props.setFieldValue(
                    props.id,
                    typeof value === 'string' ? value.split(', ') : value.join(', '),
                    props.required
                );
            };
            return <CheckboxField props={props} sx={sx} handleChange={handleChange} />;
        case 'file':
            props['value'] = props['value'] || null;
            return (
                <MuiFileInput
                    {...props}
                    onChange={(e) => props.setFieldValue(props.id, e, props.required)}
                    InputProps={{
                        inputProps: {
                            accept: props?.options,
                        },
                        startAdornment: <Icon>attach_file</Icon>,
                        endAdornment: (
                            <IconButton
                                size="small"
                                onClick={() => props.setFieldValue(props.id, null, props.required)}
                            >
                                <Icon>close</Icon>
                            </IconButton>
                        ),
                    }}
                    placeholder="Attach File"
                />
            );
        case 'link':
            return (
                <MDBox>
                    <Divider />
                    <MDTypography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {props?.label}
                    </MDTypography>
                    <MDBox display="grid">
                        {props.options?.map((item, key) => (
                            <Link
                                key={key}
                                color="blue"
                                href={
                                    String(item).match(/https?/g)
                                        ? item
                                        : `https://${item}`
                                }
                                variant="caption"
                                underline="hover"
                                target="_blank"
                            >
                                {String(item).match(/https?/g)
                                    ? `https://${String(item).split('/')[2]}`
                                    : String(item).split('/').length
                                    ? `https://${String(item).split('/')[0]}`
                                    : `https://${item}`}
                            </Link>
                        ))}
                    </MDBox>
                    <Divider />
                </MDBox>
            );
        case 'label':
            return (
                <MDBox>
                    <Divider />
                    <MDTypography>
                        <div dangerouslySetInnerHTML={{ __html: props?.options }} />
                    </MDTypography>
                    <Divider />
                </MDBox>
            );
        default:
            return null;
    }
};
export const formScrub = (data) => {
    if (typeof data !== 'object') return;
    Object.keys(data).forEach((item) => {
        if (Array.isArray(data[item])) data[item] = data[item].join(', ');
    });
    return data;
};
generateFormInput.propTypes = {
    props: {
        type: propTypes.string.isRequired,
    },
};