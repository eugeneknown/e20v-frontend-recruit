
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
        props.value && Array.isArray(props.value) ? props.value : []
    );
    const [filteredOptions, setFilteredOptions] = useState(props.options || []); // Filtered options
    const [searchTerm, setSearchTerm] = useState(''); // Term for filtering

    const handleDropdownToggle = () => {
        setOpen((prevOpen) => !prevOpen); // Toggle dropdown open/close state
    };

    const handleSelectionChange = (event) => {
        const {
            target: { value },
        } = event;
        const newValues = typeof value === 'string' ? value.split(', ') : value;
        setSelectedValues(newValues); // Update selected values
        handleChange(event); // Call parent-provided handleChange
    };

    const handleSaveCheckedFields = () => {
        console.log('Checked Fields:', selectedValues);
        setOpen(false); // Close dropdown only when "OK" is clicked
    };

    const handleFilter = (event) => {
        const typedChar = event.key.toLowerCase();
        const newSearchTerm = searchTerm + typedChar;
        setSearchTerm(newSearchTerm);

        // Filter options based on the current search term
        const filtered = props.options.filter((option) =>
            option.toLowerCase().includes(newSearchTerm)
        );
        setFilteredOptions(filtered);
    };

    const clearSearchOnClose = () => {
        setSearchTerm(''); // Clear the search term when the dropdown closes
        setFilteredOptions(props.options); // Reset options to the original list
    };

    return (
        <FormControl sx={sx} fullWidth={props.fullWidth} error={props.error}>
            <InputLabel shrink>{props.label}</InputLabel>
            <Select
                {...props}
                multiple
                open={open}
                value={selectedValues}
                input={<OutlinedInput notched label={props.label} />}
                renderValue={(selected) => {
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
                onOpen={() => setOpen(true)}
                onClose={() => {
                    setOpen(false);
                    clearSearchOnClose();
                }}
                onChange={handleSelectionChange}
                onKeyDown={handleFilter} // Dynamically filter on typing
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4.5 + 8,
                            minWidth: "32%",
                        },
                    },
                }}
            >
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            <Checkbox checked={selectedValues.includes(item)} />
                            <ListItemText primary={item} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <em>No options available</em>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem disableRipple sx={{ justifyContent: "center", padding: 0 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<CheckCircleIcon />}
                        sx={{
                            color: "#fff", 
                            backgroundColor: "primary.main", 
                            "&:hover": {
                                backgroundColor: "primary.dark", 
                            },
                            fontSize: "0.8rem",
                        }}
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
            )

    

        case 'date':
            let valueProps = {}
            if (props.value) valueProps['value'] = moment(props.value)
        
            props['closeOnSelect'] = true;
        
            // Set the views for the date picker
            // const views = props.id === 'end_date' ? ['year'] : ['year', 'month', 'day'];
        
            // Dynamically adjust options for the end date field
            // const updatedOptions = { ...props?.options };
            // if (props.id === 'end_date' && props.formValues && props.formValues.start_date) {
            //     const startDate = moment(props.formValues.start_date);
            //     if (startDate.isValid()) {
            //         updatedOptions.minDate = startDate.toDate(); // Set the minDate to start_date
            //     }
            // }

            return (
                <MobileDatePicker
                    // onChange={(value) => {
                    //     const formattedDate = moment(value).format('YYYY-MM-DD');
                    //     props.setFieldValue(props.id, formattedDate, props.required);
                    //     console.log('format date', value);
                    // }}
                    onChange={(value) => value && props.setFieldValue(props.id, formatDateTime(value, 'YYYY-MM-DD'), props.required)}
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
                    {...props?.options} 
                />
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