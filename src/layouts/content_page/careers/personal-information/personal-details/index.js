import {Button, Card, CardContent, Checkbox, Chip, Container, Divider, FormControl, Icon, IconButton, InputLabel, Link, ListItemText, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import NavBar from "layouts/content_page/nav_bar";

import MDButton from "components/MDButton";

import { useLocation, useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";
import CareersStepper from "../../careers-stepper";

import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import schema from "./detailsData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";


function PersonalDetailsForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    const {isAuth, auth} = useAuth();
    const [entityDetails, setEntityDetails] = useState()

    const localEntityDetails = localStorage.getItem('entity_details')
    const removeLocalEntityDetails = () => {
        localStorage.removeItem('entity_details')
    }

    // init validation
    var yupObject = generateObjectSchema(schema)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {
        var entity_id = auth['id']

        // fetch platforms
        dataServicePrivate('POST', 'hr/careers/platform/all', {
            exclude: [
                {
                    'operator': '=',
                    'target': 'status',
                    'value': 'close',
                }
            ],
        }).then((result) => {
            console.log('debug careers platform result', result);
            result = result.data['career_platforms']
            var tempPlatforms = []
            result.forEach((value) => tempPlatforms.push(value))
            schema[schema.findIndex((e) => e.id == 'platforms_id')]['options'] = tempPlatforms
        }).catch((err) => {
            console.log('debug careers platform error result', err);
        
        })

        // fetch entity details
        dataServicePrivate('POST', 'entity/details/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug entity details result', result);
            result = result.data['entity_details'][0]
            if (localEntityDetails) {
                result = JSON.parse(localEntityDetails)
            } else {
                localStorage.setItem('entity_details', JSON.stringify(result))
            }

            setEntityDetails(result)

        }).catch((err) => {
            console.log('debug entity details error result', err);

        })

    }, [])

    useEffect(() => {
        if (entityDetails) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('entity_details', JSON.stringify(entityDetails))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[entityDetails])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/details/define', data).then((result) => {
            console.log('debug entity details define result', result);
            removeLocalEntityDetails()
            navigate('/careers/personalinfo', { replace: true })
        }).catch((err) => {
            console.log('debug entity details define error result', err);

        })
    }

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
            let { value } = event.target;
            let newValues = typeof value === "string" ? value.split(",") : [...value];
            if (newValues.includes("None of the Above")) {
            if (!selectedValues.includes("None of the Above")) {
            // If "None of the Above" is selected, clear other selections
            newValues = ["None of the Above"];
            } else {
            // If "None of the Above" was unchecked, allow normal selection
            newValues = newValues.filter((item) => item !== "None of the Above");
            }
            } else {
            // Remove "None of the Above" if other selections are made
            newValues = newValues.filter((item) => item !== "None of the Above");
            }
            setSelectedValues(newValues);
            };
            const handleSaveCheckedFields = () => {
            setSelectedValues((prevValues) => {
            let finalSelectedValues = prevValues.length === 0 ? ["None of the Above"] : prevValues;
            if (finalSelectedValues.includes("None of the Above")) {
            finalSelectedValues = ["None of the Above"];
            }
            // Save the selected values properly
            handleChange({
            target: { name: props.name, value: finalSelectedValues },
            });
            return finalSelectedValues;
            });
            setTimeout(() => setOpen(false), 0);
            };
            const handleFilter = (event) => {
            const typedChar = event.key.toLowerCase();
            const newSearchTerm = searchTerm + typedChar;
            setSearchTerm(newSearchTerm);
            
            const filtered = props.options.filter((option) =>
            option.toLowerCase().includes(newSearchTerm) || option === "None of the Above"
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
                    <MenuItem disableRipple disableTouchRipple sx={{ justifyContent: "end", pointerEvents: "none", backgroundColor: "transparent", "&:hover": {backgroundColor: "transparent"}}}>
                        <div style={{ pointerEvents: "auto" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Icon>check_circle</Icon>}
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "primary.main",
                                    fontSize: "0.8rem",
                                    "&:hover": {
                                        backgroundColor: "primary.main", // Ensures no hover color change
                                        boxShadow: "none", // Prevents any shadow on hover
                                    },
                                }}
                                onClick={(event) => {
                                    event.stopPropagation(); // Prevents unchecking "None of the Above"
                                    handleSaveCheckedFields();
                                }}
                            >
                                OK
                            </Button>
                        </div>
                    </MenuItem>
    
    
                </Select>
                {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
            </FormControl>
        );
    };

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="md" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Other Details</MDTypography>
                        <Divider />
                        {entityDetails && <Formik
                            initialValues={entityDetails}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                console.log('submit data', data)
                                handleSubmit(data)
                            }}
                        >
                            {({values, touched, errors, isValid, handleChange, handleBlur, setFieldValue, setFieldTouched}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setEntityDetails(values)}
                                            {console.log('values', values)}
                                            {Object.keys(schema).map((item, index) => {
                                                var touch = schema[item].type == 'date' ? typeof touched[schema[item].id] == 'undefined' ? true : touched[schema[item].id] : touched[schema[item].id]
                                                var error = schema[item].type == 'date' ? schema[item].required && errors[schema[item].id] : errors[schema[item].id]

                                                if ( schema[item].id == 'government_requirements' ) {

                                                    const sx = { my: 2 };
                                                    const props = {
                                                        variant: 'outlined',
                                                        fullWidth: true,
                                                        type: schema[item].type,
                                                        id: schema[item].id,
                                                        name: schema[item].id,
                                                        label: schema[item].label,
                                                        value: values[schema[item].id],
                                                        required: schema[item].required,
                                                        onBlur: handleBlur,
                                                        setFieldValue,
                                                        setFieldTouched,
                                                        error: touch && Boolean(error),
                                                        helperText: touch && error,
                                                        options: schema[item].options ? schema[item].options : undefined
                                                    }
                                                    props['sx'] = { py: '0.75rem' }
                                                    props['value'] =
                                                        props['value'] && typeof props['value'] === 'string'
                                                            ? props['value'].split(', ')
                                                            : props['value'] || [];
                                                    const handleChange = (e) => {
                                                        const {
                                                            target: { value },
                                                        } = e;
                                                        setFieldValue(
                                                            props.id,
                                                            typeof value === 'string' ? value.split(', ') : value.join(', '),
                                                            props.required
                                                        );
                                                    };
                                                    return <CheckboxField props={props} sx={sx} handleChange={handleChange} />;

                                                } else {
                                                    return (generateFormInput({
                                                        variant: 'outlined',
                                                        fullWidth: true,
                                                        type: schema[item].type,
                                                        id: schema[item].id,
                                                        name: schema[item].id,
                                                        label: schema[item].label,
                                                        value: values[schema[item].id],
                                                        required: schema[item].required,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        setFieldValue,
                                                        setFieldTouched,
                                                        error: touch && Boolean(error),
                                                        helperText: touch && error,
                                                        options: schema[item].options ? schema[item].options : undefined
                                                    }))
                                                }
                                            })}
                                        </MDBox>
                                        )}
                                    />
                                    <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' startIcon={<Icon>save</Icon>} >Save</MDButton>
                                </Form>
                            )}
                        </Formik>}
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default PersonalDetailsForm;