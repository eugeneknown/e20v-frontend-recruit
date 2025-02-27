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
    Switch,
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
import { ToHTML } from 'layouts/dashboard/positions/rte/html-converter';
import TextField from './components/text-field';
import { CheckboxField } from './components/check-box';
import Select from './components/select';


export const generateFormInput = (props) => {
    const sx = { my: 2, display: props?.hidden ? 'none' : 'block' };
    // if (typeof props.sx === 'undefined') props['sx'] = [sx];
    
    switch (props.type) {
        case 'text':
        case 'number':
        case 'tel':
        case 'email':
            return <TextField props={{...props}} sx={sx} />;
        case 'radio':
        case 'select':
            props['sx'] = [{ p: '16.5px 14px' }];
            return (<Select props={{...props}} sx={sx} />)

        case 'date':
            let valueProps = {}
            if (props.value) valueProps['value'] = moment(props.value)
        
            props['closeOnSelect'] = true;
            return (
                <MobileDatePicker
                    onChange={(value) => value && props.setFieldValue(props.id, formatDateTime(value, 'YYYY-MM-DD'), props.required)}
                    onOpen={() => props.setFieldTouched(props.id, true, props.required)}
                    {...valueProps}
                    label={props.label}
                    name={props.name}
                    sx={{...sx, ...props.sx}}
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
            props['sx'] = [{ p: '16.5px 14px' }];
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
                    <MDBox display="grid" mt={2}>
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
            console.log('label:', props);
            return (
                <MDBox>
                    <Divider />
                    <MDTypography>
                        <div dangerouslySetInnerHTML={{ __html: props?.options }} />
                        {/* <ToHTML data={props?.options} /> */}
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