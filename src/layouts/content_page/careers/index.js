import { Card, Container, Divider, Modal, Fade, Backdrop, FormControl, InputLabel, MenuItem, Select, NativeSelect, useTheme, 
    FormControlLabel, FormLabel, RadioGroup, Radio, FormGroup, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, CardContent, Button, Box, Alert, Stack, Icon,
    Link,
    IconButton,
    DialogContentText,
    Tooltip,
    CardHeader,
    CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid";

import PageLayout from "examples/LayoutContainers/PageLayout";
import NavBar from "../nav_bar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import useAuth from "hooks/useAuth";
import { useNavigate, useLocation, useFetcher } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "api/axios";
import MDInput from "components/MDInput";
import { axiosPrivate } from "api/axios";
import { DatePicker } from "@mui/x-date-pickers";
import Notifications from "../../notifications/dynamic-notification";
import Sticky from 'react-sticky-el';
import { useSnackbar } from "notistack";
import MDAlert from "components/MDAlert";
import moment, { ISO_8601 } from "moment";

import e20logo from 'assets/images/e20/Eighty_20_shadow_2_transparent.png'
import e20logo_black from 'assets/images/e20/EIGHT 20 LOGO.jpg'
import smiley1 from 'assets/images/icons/smiley icon1.png'
import smiley2 from 'assets/images/icons/smiley icon2.png'
import smiley3 from 'assets/images/icons/smiley icon3.png'

import SwipeableViews from "react-swipeable-views";
import FileUpload from "./file-upload";
import { dataServicePrivate, dataService } from "global/function";



function Careers(){

    const { isAuth, auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [careers, setCareers] = useState({});
    const [questions, setQuestions] = useState({})
    const [content, setContent] = useState(null);
    const [open, setOpen] = useState(false);
    const [entityCareer, setEntityCareer] = useState({});
    const [answers, setAnswers] = useState();
    const [answer, setAnswer] = useState();
    const [entity, setEntity] = useState({'id': auth['id']});
    const [otherDetails, setOtherDetails] = useState({'entity_id': auth['id']})
    const [notif, useNotif] = useState()
    const [error, setError] = useState([])
    const [platform, setPlatform] = useState({})
    const [platformCareer, setPlatformCareer] = useState()
    const [responseOpen, setResponseOpen] = useState(false)
    const [view, setView] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [hasCareers, setHasCareers] = useState({})
    const dialogRef = useRef()
    const [valid, setValid] = useState(true)

    // stepper
    const [activeStep, setActiveStep] = useState(0);
    const [component, setComponent] = useState(null);

    // swipeable views
    const [swipeIndex, setSwipeIndex] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState('x') // 'x-reverse' : 'x'
    const [swipeContent, SetSwipeContent] = useState()
    const [currentIndex, setCurrentIndex] = useState(0)

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    // custom validation
    const [entityCustomValidation, setEntityCustomValidation] = useState({})
    const [questionsCustomValidation, setQuestionsCustomValidation] = useState({})

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // progress
    const [progress, setProgress] = useState(true)
    const [time, setTime] = useState(0)
    const timer = useRef()
    const startTimer = () => {
        setProgress(true)
        var tempTime = 0
        timer.current = setInterval(() => {
            const diff = Math.random() * 40
            tempTime = Math.min(tempTime + diff, 100)
            if (tempTime >= 100) {
                setTime(100)
            }
        }, 500)
    }   
    useEffect(() => {
        if (time > 25) setSwipeIndex(currentIndex)
        if (time >= 100) {
            console.log('debug scroll', scroll);
            // window.scrollTo(0, scroll.y)
            setProgress(false)
            clearInterval(timer.current)
        }
    },[time])

    // work experience
    const [experience, setExperience] = useState({0: {}, 1: {}, 2: {}})
    const [stayLength, setStayLength] = useState({0: {start_date: '', end_date: ''}, 1: {start_date: '', end_date: ''}, 2: {start_date: '', end_date: ''}})
    const [expPresent, setExpPresent] = useState(false)
    const [stay1, setStay1] = useState()
    const [stay2, setStay2] = useState()
    const [stay3, setStay3] = useState()
    const [expCount, setExpCount] = useState(1)

    // scroll event
    const [scroll, setScroll] = useState({x: 0, y: 0})

    // character reference
    const [reference, setReference] = useState({0: {}, 1: {}, 2: {}})
    const [refCount, setRefCount] = useState(2)

    const handleRedirection = (e) =>{
        e.preventDefault();

        navigate('/authentication/sign-in', { state: { from: location }, replace: true });
    }

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        const getCareers = async () => {
            try {
                const response = await axios.post('hr/careers/all', {
                    filter: [
                        {
                            target: 'status',
                            operator: '=',
                            value: 'active',
                        }
                    ],
                    relations: ["has", "questions"],
                });
                setCareers(response.data['careers'])
                console.log("debug careers", response.data);
                
            } catch (err) {
                console.log("debug careers error", err);
            }
        }

        dataService('POST', 'hr/careers/platform/all', {}).then(result => {
            console.log("debug careers platform", result);
            result = result.data['career_platforms']
            setPlatform(result)

        }).catch(err => {
            console.log("debug careers platform error", err);

        })

        getCareers();

        SetSwipeContent({ 0: entityContent })

        for (let i=0;i<Object.keys(entityData).length;i++) { //13
            setEntityCustomValidation(prev => ({
                ...prev,
                [i]: {
                    id: i+1,
                    index: 0,
                    invalid: true,
                }
            }))
        }

        entityCareers()

    }, [])

    const entityCareers = () => {
        if (isAuth) {
            dataServicePrivate('POST', 'hr/careers/entity/all', {
                filter: [
                    {
                        'operator': '=',
                        'target': 'entity_id',
                        'value': auth['id'],
                    },
                ],
            }).then((result) => {
                console.log('debug careers entity result', result);
                setHasCareers(result.data['entity_career'])
            }).catch((err) => {
                console.log('debug carrrers entity error result', err);
                
            })
        }
    }

    const entityHandle = (key, data) => {
        if (key == 'birthday') {
            data = formatDateTime(data, 'YYYY-MM-DD')
        }

        setEntity(prev => ({
            ...prev,
            [key]: data
        }));

        console.log('debug submit entity data:', entity)
    }

    const workExpHandle = (data, key='') => {
        var value = data['value']
        if (key == 'date') {
            value = formatDateTime(value, 'YYYY-MM-DD')

            setStayLength(prev => ({
                ...prev,
                [data['index']]: {
                    ...prev[data['index']],
                    [data['item']]: value
                }
            }))
        }

        setExperience(prev => ({
            ...prev,
            [data['index']]: {
                ...prev[data['index']],
                [data['item']]: value
            }
        }));
    }

    const referenceHandle = (data, key='') => {
        setReference(prev => ({
            ...prev,
            [data['index']]: {
                ...prev[data['index']],
                [data['item']]: data['value']
            }
        }));
    }

    useEffect(() => {
        console.log('debug use effect stay length', stayLength);
        console.log('debug use effect present', expPresent);

        setExperience(prev => ({
            ...prev,
            [0]: {
                ...prev[0],
                present: expPresent
            }
        }));

        if ( stayLength[0].start_date && stayLength[0].end_date && !stay1 ) {
            var start = moment(stayLength[0].start_date)
            var end = moment(stayLength[0].end_date)

            var years = end.diff(start, 'year')
            start.add(years, 'years')

            var months = end.diff(start, 'months')
            start.add(months, 'months')

            console.log('debug here', `${years} years ${months} month`);
            var stay = `${years} years ${months} month`
            setStay1(stay)

            setExperience(prev => ({
                ...prev,
                [0]: {
                    ...prev[0],
                    stay_length: stay
                }
            }));
        }
        if ( stayLength[1].start_date && stayLength[1].end_date ) {
            var start = moment(stayLength[1].start_date)
            var end = moment(stayLength[1].end_date)

            var years = end.diff(start, 'year')
            start.add(years, 'years')

            var months = end.diff(start, 'months')
            start.add(months, 'months')

            console.log('debug here', `${years} years ${months} month`);
            var stay = `${years} years ${months} month`
            setStay1(stay)

            setExperience(prev => ({
                ...prev,
                [1]: {
                    ...prev[1],
                    stay_length: stay
                }
            }));
        }
        if ( stayLength[2].start_date && stayLength[2].end_date ) {
            var start = moment(stayLength[2].start_date)
            var end = moment(stayLength[2].end_date)

            var years = end.diff(start, 'year')
            start.add(years, 'years')

            var months = end.diff(start, 'months')
            start.add(months, 'months')

            console.log('debug here', `${years} years ${months} month`);
            var stay = `${years} years ${months} month`
            setStay1(stay)

            setExperience(prev => ({
                ...prev,
                [2]: {
                    ...prev[2],
                    stay_length: stay
                }
            }));
        }
    },[stayLength, expPresent])

    const responseOpenHandle = () => setResponseOpen(true)
    const responseCloseHandle = () => setResponseOpen(false)

    const customValidation = (value, type) => {
        console.log('debug custom validation:', value, type, value.length);
        
        if (type == 'input') {
            if (value) return false

        }
        else if (type == 'number') {
            if (value.match(/^\d+$/)) return false

        }
        else if (type == 'tel') {
            if (value.match(/^09\d{9}$/)) return false

        }
        else if (type == 'email') {
            if (value.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) return false

        }
        else if (type == 'date') {
            if (moment(value).isValid()) return false

        }
            
        return true
    }

    const entityData = [
        {
            id: 'first_name',
            label: 'First Name',
            type: 'input',
        },
        {
            id: 'middle_name',
            label: 'Middle Name',
            type: 'input',
        },
        {
            id: 'last_name',
            label: 'Last Name',
            type: 'input',
        },
        {
            id: 'nickname',
            label: 'Nickname',
            type: 'input',
        },
        {
            id: 'civil_status',
            label: 'Civil Status',
            type: 'select',
            value: ['Single', 'Married', 'Widowed'],
        },
        {
            id: 'contact_number',
            label: 'Mobile Number',
            type: 'tel',
        },
        {
            id: 'alternative_number',
            label: 'Alternative Mobile Number',
            type: 'tel',
        },
        {
            id: 'gender',
            label: 'Gender',
            type: 'select',
            value: ['Male', 'Female', 'Others'],
        },
        {
            id: 'age',
            label: 'Age',
            type: 'number',
        },
        {
            id: 'email',
            label: 'Email',
            type: 'email',
        },
        {
            id: 'birth_place',
            label: 'Birth Place',
            type: 'input',
        },
        {
            id: 'birth_order',
            label: 'Birth Order',
            type: 'number',
        },
        {
            id: 'birthday',
            label: 'Date of Birth',
            type: 'date',
        },
        {
            id: 'children',
            label: 'Children (if applicable)',
            type: 'input',
        },
        {
            id: 'permanent_address',
            label: 'Permanent Address',
            type: 'input',
        },
        {
            id: 'present_address',
            label: 'Present Address',
            type: 'input',
        },
        {
            id: 'education',
            label: 'Educational Attainment',
            type: 'select',
            value: ['College Graduate', 'High School Graduate', 'Senior High', 'College Level', 'Master\'s Degree'],
        },
        {
            id: 'course',
            label: 'Course',
            type: 'input',
        },
    ]

    const otherData = [
        {
            id: 'salary',
            label: 'Salary Expectation (in PHP)?',
            type: 'input',
        },
        {
            id: 'us_time',
            label: 'Amenable to work in a US time?',
            type: 'input',
        },
        {
            id: 'work_in_office',
            label: 'Amenable to work in the office (Matina Davao City)?',
            type: 'input',
        },
        {
            id: 'transpo',
            label: 'If YES, do you have own transportation or commute?',
            type: 'input',
        },        
        {
            id: 'application',
            label: 'Pending Application with other Company?',
            type: 'input',
        },
        {
            id: 'start',
            label: 'Availability to Start?',
            type: 'input',
        },
        {
            id: 'condition',
            label: 'Any underlying health/medical conditions?',
            type: 'input',
        },
        {
            id: 'part_time',
            label: 'Any part time work at the moment (please specify)?',
            type: 'input',
        },
    ]

    const formComponents = (data, count) => {
        // console.log('debug form component', data);
        if (data['type'] == 'input') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <MDInput
                            id={data['label']}
                            type="text" 
                            label={data['label']}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }}
                            variant="standard"
                            onChange={e => {
                                entityHandle(data['id'], e.target.value);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e.target.value, 'input'),
                                    }
                                }))
                            }}
                            disabled={disabled}
                        />
                    </CardContent>
                </Card>
            )
        }
        if (data['type'] == 'number') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <MDInput
                            id={data['label']}
                            inputProps={{ type: 'number' }}
                            type="number" 
                            label={data['label']}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }}
                            variant="standard"
                            onChange={e => {
                                entityHandle(data['id'], e.target.value);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e.target.value, 'number'),
                                    }
                                }))
                            }}
                            disabled={disabled}
                        />
                    </CardContent>
                </Card>
            )
        }
        if (data['type'] == 'tel') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <MDInput
                            id={data['label']}
                            inputProps={{ type: 'number' }}
                            type="number" 
                            label={data['label']}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }}
                            variant="standard"
                            onChange={e => {
                                entityHandle(data['id'], e.target.value);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e.target.value, 'tel'),
                                    }
                                }))
                            }}
                            disabled={disabled}
                        />
                    </CardContent>
                </Card>
            )
        }
        if (data['type'] == 'email') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <MDInput
                            id={data['label']}
                            type="text" 
                            label={data['label']}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }}
                            variant="standard"
                            onChange={e => {
                                entityHandle(data['id'], e.target.value);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e.target.value, 'email'),
                                    }
                                }))
                            }}
                            disabled={disabled}
                        />
                    </CardContent>
                </Card>
            )
        }
        if (data['type'] == 'select') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <MDInput
                            id={data['label']}
                            select
                            label={data['label']}
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }}
                            variant="standard"
                            multiline
                            onChange={e => {
                                entityHandle(data['id'], e.target.value);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e.target.value, 'input'),
                                    }
                                }))
                            }}
                            disabled={disabled}
                        >
                            {
                                Object.keys(data['value']).map((item, index) => (
                                    <MenuItem sx={{ textTransform: 'capitalize' }} key={index} value={data['value'][item]}>{data['value'][item]}</MenuItem>
                                ))
                            }
                        </MDInput>
                    </CardContent>
                </Card>
            )
        }
        if (data['type'] == 'date') {
            return (
                <Card sx={{ m: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        {/* <MDTypography variant='button'>{count+1}.</MDTypography> */}
                        <DatePicker 
                            label={data['label']} 
                            fullWidth
                            sx={{
                                '& .MuiInputLabel-root:not(.Mui-focused)': {
                                    color: 'black!important',
                                }
                            }} 
                            slotProps={{
                                textField: {
                                    variant: 'standard',
                                    fullWidth: true,
                                    // required: true,
                                    InputLabelProps: {
                                        style: {
                                            color: 'black'
                                        }
                                    },
                                    disabled: disabled,
                                }
                            }}
                            onChange={e => {
                                entityHandle(data['id'], e);
                                setEntityCustomValidation(prev => ({
                                    ...prev,
                                    [count]: {
                                        ...prev[count],
                                        invalid: customValidation(e, 'date'),
                                    }
                                }))
                            }}
                        />
                    </CardContent>
                </Card>
            )
        }
    }

    const experienceData = [
        {
            title: 'From Most Recent Company',
            required: true,
        },
        {
            title: '',
            required: false,
        },
        {
            title: '',
            required: false,
        },
    ]

    const referenceData = [
        {
            title: '1',
            required: true,
        },
        {
            title: '2',
            required: true,
        },
        {
            title: '3',
            required: false,
        },
    ]

    // const validationSchema = yup.object({
    //     text: yup
    //         .string(),
    //     textReq: yup
    //         .string('')
    //         .required('This Field is required'),
    //     date: yup
    //         .date(),
    //     dateReq: yup
    //         .date()
    //         .required('This Field is required'),
    // })

    // const formik = useFormik({
    //     validationSchema: validationSchema,
    // })

    const experienceComponent = (data, count) => (
        <Card sx={{ m: 2 }}>
            {
                data['title'] != '' &&
                <CardHeader 
                subheader={`${data['title']}`}
                subheaderTypographyProps={{
                    variant: 'button'
                }}
                />
            }
            <CardContent>
                <MDInput
                    type="text" 
                    label={`${count+1}. Company Name`}
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'company',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Position Held'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'position_held',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Department'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'department',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Account/s Handled (if BPO experience)'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'handled',
                        value: e.target.value
                    })}
                    multiline
                />
                <MDInput
                    type="text" 
                    label='Reason of leaving'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'leave_reason',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Last Salary'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => workExpHandle({
                        index: count,
                        item: 'salary',
                        value: e.target.value
                    })}
                />
                <MDBox display='flex' sx={{ my: 1, flexDirection: 'row' }}>
                    <DatePicker 
                        label='Start Date'
                        views={['month', 'year']}
                        sx={{
                            '& .MuiInputLabel-root:not(.Mui-focused)': {
                                color: 'black!important',
                            },
                        }} 
                        slotProps={{
                            textField: {
                                variant: 'standard',
                                fullWidth: true,
                                InputLabelProps: {
                                    style: {
                                        color: 'black'
                                    }
                                },
                            }
                        }}
                        onChange={e => workExpHandle({
                            index: count,
                            item: 'start_date',
                            value: e
                        }, 'date')}
                    />
                    <DatePicker 
                        label='End Date'
                        views={['month', 'year']}
                        sx={{
                            '& .MuiInputLabel-root:not(.Mui-focused)': {
                                color: 'black!important',
                            },
                            ml: 3,
                        }} 
                        slotProps={{
                            textField: {
                                variant: 'standard',
                                fullWidth: true,
                                // required: true,
                                InputLabelProps: {
                                    style: {
                                        color: 'black'
                                    }
                                },
                            }
                        }}
                        onChange={e => workExpHandle({
                            index: count,
                            item: 'end_date',
                            value: e
                        }, 'date')}
                    />
                </MDBox>
                <MDBox display='flex' my={1} justifyContent={ 'end' }>
                    <FormControlLabel control={<Checkbox
                    onChange={e => setExpPresent(e.target.checked)}
                    />} label="Currently working" />
                    {/*todo*/} {/* <MDTypography variant='button'>Length of Stay: {stay1}</MDTypography> */}
                </MDBox>
                {addMoreButton('exp', count+1)}
            </CardContent>
        </Card>
    )

    const addMoreButton = (type, count) => {
        if (type = 'exp') {
            if (expCount == count) {
                return (
                    <MDButton startIcon={<Icon>add</Icon>} color='info' variant='outlined' onClick={() => {
                        swipeableCustomHightUpdate(); 
                        setExpCount(expCount+1);
                    }}>Add More</MDButton>
                )
        }
        }
        if (type == 'ref') {
            if (refCount == count) {
                <MDButton sx={{ mt: 2 }} startIcon={<Icon>add</Icon>} color='info' variant='outlined' onClick={() => {
                    swipeableCustomHightUpdate(); 
                    setRefCount(refCount+1);
                    setCurrentIndex(Object.keys(swipeContent).length)
                }}>Add More</MDButton>
            }
        }
    }

    const referenceComponent = (data, count) => (
        <Card sx={{ m: 2 }}>
            {
                data['title'] != '' &&
                <CardHeader 
                subheader={`${data['title']}`}
                subheaderTypographyProps={{
                    variant: 'button'
                }}
                />
            }
            <CardContent>
                <MDInput
                    type="text" 
                    label='Name'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'name',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Position'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'position',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Email'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'email',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="tel" 
                    label='Contact Number'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'contact_number',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Company Name'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'company',
                        value: e.target.value
                    })}
                />
                <MDInput
                    type="text" 
                    label='Company Email'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => referenceHandle({
                        index: count,
                        item: 'company_email',
                        value: e.target.value
                    })}
                />
                { addMoreButton('ref', count+1) }
            </CardContent>
        </Card>
    )

    const swipeableCustomHightUpdate = () => {
        console.log('debug scroll offsets', dialogRef.current);
        setScroll({
            x: window.scrollX,
            y: window.scrollY,
        })
        window.scrollTo(0, 0)
        setTime(0)
        startTimer()
        setSwipeIndex(swipeIndex+1)
    }

    const entityContent = (
        <MDBox>
            <MDTypography variant="h5" fontWeight="medium">Personal Information</MDTypography>
            {
                Object.keys(entityData).map((item, index) => (
                    formComponents(entityData[item], index)
                ))
            }
            <Card sx={{ m: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                    {/* <MDTypography variant='button'>19.</MDTypography> */}
                    <MDInput 
                        id='Where did you hear about us?'
                        type="text" 
                        label='Where did you hear about us?'
                        select
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root:not(.Mui-focused)': {
                                color: 'black!important',
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => {
                            setPlatformCareer(e.target.value);
                            setEntityCustomValidation(prev => ({
                                ...prev,
                                [18]: {
                                    ...prev[18],
                                    invalid: customValidation(e.target.value, 'input'),
                                }
                            }))
                        }}
                    >
                        {
                            platform && Object.keys(platform).map((item, key) => (
                                <MenuItem sx={{ textTransform: 'capitalize' }} key={key} value={platform[item].id}>{platform[item].title}</MenuItem>
                            ))
                        }
                    </MDInput>
                </CardContent>
            </Card>
            <Divider sx={{ my: 4 }} />
            <MDTypography variant="h5" fontWeight="medium">Work Experience</MDTypography>
            <Card sx={{ m: 2 }}>
                <CardContent>
                    <MDInput
                        type="text" 
                        label='Total Work Experience'
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root:not(.Mui-focused)': {
                                color: 'black!important',
                            }
                        }}
                        variant="standard"
                        onChange={e => setExperience(prev => ({
                            ...prev,
                            total_experience: e.target.value
                        }))}
                    />
                </CardContent>
            </Card>
            {
                Array.from({length: expCount}, (item, index) => (
                    experienceComponent(experienceData[index], index)
                ))
            }
            <Card sx={{ m: 2 }}>
                <CardContent>
                    <MDInput
                        type="text" 
                        label='Other Relevant Experience'
                        fullWidth
                        sx={{
                            '& .MuiInputLabel-root:not(.Mui-focused)': {
                                color: 'black!important',
                            }
                        }}
                        variant="standard"
                        onChange={e => setExperience(prev => ({
                            ...prev,
                            other_experience: e.target.value
                        }))}
                        multiline
                    />
                </CardContent>
            </Card>
            <Divider sx={{ my: 4 }} />
            <MDTypography variant="h5" fontWeight="medium">Other Details</MDTypography>
            {
                Object.keys(otherData).map((item, index) => (
                    <Card sx={{ m: 2 }}>
                        <CardContent>
                            <MDInput
                                type="text" 
                                label={otherData[item]['label']}
                                fullWidth
                                sx={{
                                    '& .MuiInputLabel-root:not(.Mui-focused)': {
                                        color: 'black!important',
                                    }
                                }}
                                variant="standard"
                                onChange={e => setOtherDetails(prev => ({
                                    ...prev,
                                    [otherData[item]['id']]: e.target.value
                                }))}
                            />
                        </CardContent>
                    </Card>
                ))
            }
            <Divider sx={{ my: 4 }} />
        </MDBox>
    )

    const lastContent = () => (
        <MDBox>
            <MDTypography variant="h5" fontWeight="medium">Character Reference</MDTypography>
            {
                Array.from({length: refCount}, (item, index) => (
                    referenceComponent(referenceData[index], index)
                ))
            }
            <MDBox my={3}>
                <MDTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Authorization Letter
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    In the course of conducting an investigation into my background, I authorize the Company to contact government agencies, 
                    previous employers, educational institutions, public or private entities, and individuals, as well as the listed references.
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    I authorize the Company to release all background investigation data to the Company's designated hiring officers for use in evaluating
                    my application for employment or for continued empoyment. I understand and acknowledge that the information gathered and provided to hiring officers by the 
                    Company may be detrimental to my application for employment or continued employment.
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    I also authorize any individual, company, firm corporation, or public agency to disclose any and all information pertaining to me, whether verbal or written.
                    I hereby release from all liability any person, firm, or orgination that provides information or records in accordance with this authorization.
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    By signing this document, I give the Company my permission to conduct an initial background check for employment application purposes, as well as any
                    subsequent background checks deemed necessary during the course of my employment with the Company.
                </MDTypography>
            </MDBox>
            <MDBox my={3}>
                <MDTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Terms and Conditions
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                    and that any dishonesty or falsification may jeopardize my employment application.
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    I hereby release all persons, companies, or corporations who provide such information from any liability or responsibility. I also 
                    agree to submit any future examination that Eighty20 Virtual may require of me, and that the foregoing examination questions and answers may be 
                    used in any way that company desires.
                </MDTypography>
                <MDTypography variant="overline" gutterBottom sx={{ display: 'block', fontStyle: 'italic' }}>
                    I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                    and that any dishonesty or falsification may jeopardize my employment application.
                </MDTypography>
            </MDBox>
            <MDBox>
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            href="#"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ ml: '4px' }}
                        >
                            Authorization Letter
                        </MDTypography>
                    </MDTypography>
                </MDBox> 
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            href="#"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ mx: '4px' }}
                        >
                            Terms and Conditions
                        </MDTypography>  
                    </MDTypography>
                </MDBox> 
            </MDBox>
            <Divider sx={{ my: 4 }} />
        </MDBox>
    )

    const responseContent = () => (
        <MDBox 
        position='relative'
        sx={{ bgcolor: 'transparent' }}
        >
            <MDBox display='flex' sx={{ height: '90vh', justifyContent: 'center' }}>
                <MDBox component='img' src={e20logo}
                sx={{
                    position: 'absolute',
                    margin: 'auto',
                    width: '75%',
                    opacity: '.1',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                />
                <MDBox 
                sx={{ 
                    mx: 2, p: 5
                }}
                >
                    <MDTypography variant='h2' sx={{
                        mb: 3,
                        fontSize: '1.5rem',
                        fontWeight: 'normal',
                        textAlign: 'center',
                    }}>Thank you for filling out the form! <MDBox sx={{
                        position: 'relative',
                        display: 'inline-block',
                        width: 'inherit',
                        height: 'inherit',
                        p: '10px',
                    }}><MDBox component='img' src={smiley1} sx={{
                        display: 'block',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        minHeight: '100%',
                        minWidth: '100%',
                        transform: 'translate(-50%, -50%)',
                        height: '33px',
                    }} /></MDBox></MDTypography>
                    <MDBox>
                        <MDTypography vairant='body1' gutterBottom sx={{ fontSize: '17px', fontWeight: 'lighter' }}>
                            We have received your application and will get back to you soon.
                            Meanwhile you can follow us on <Link color='primary' href="https://www.facebook.com/eighty20virtualcareers">Facebook</Link> for updates.
                        </MDTypography>
                        <MDTypography vairant='body1' gutterBottom sx={{ fontSize: '17px', fontWeight: 'lighter' }}>
                            For any further inquiries, please contact <Link color='primary' href="#">careers@eighty20virtual.com</Link> 
                        </MDTypography>
                        <MDBox display='flex' justifyContent="space-between">
                            <Link 
                            color='info' 
                            href={`/careers/response?entity=${entityCareer.entity_id}&careers=${entityCareer.careers_id}`} 
                            sx={{ my: 'auto' }} 
                            target='_blank'
                            variant="text"
                            >
                                <MDButton variant='text' sx={{ pl: 0 }} color='info'>View Response</MDButton>
                            </Link>
                            <MDButton color='info' onClick={handleClose}>Return to page</MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </MDBox>
        </MDBox>
    )

    useEffect(() => {
        console.log('debug platform career:', platformCareer);
        setEntityCareer(prev => ({
            ...prev, 'platforms_id': platformCareer
        }))
    }, [platformCareer])

    useEffect(() => {
        console.log('debug entity custom validation use effect:', entityCustomValidation);
    }, [entityCustomValidation])

    useEffect(() => {
        console.log('debug questions custom validation use effect:', questionsCustomValidation);
    }, [questionsCustomValidation])

    const handleValidation = (e) => {
        e.preventDefault();

        console.log('debug submit target data:', e)
        console.log('debug submit validity:', valid)
        // if (valid) handleSubmit()
        if (valid) {
            handleSubmit()
            experienceSubmit()
            entityDetailsSubmit()
            entityReferenceSubmit()
        }

        console.log('debug submit entity data:', entity)
        console.log('debug submit question data:', questions)
    }

    const entityValidation = () => {
        // responseOpenHandle()
        // setSwipeIndex(swipeIndex+1)
        console.log('debug work experience data', experience);
        console.log('debug entity other details data', otherDetails);
        console.log('debug work experience stay length data', stayLength);
        // entityReferenceSubmit()
        // experienceSubmit()
        // entityDetailsSubmit()
        console.log('debug custom entity validation:', entityCustomValidation)
        
        var tempValid = true
        console.log('w3w1', tempValid, valid);

        // entity validations
        if (tempValid) {
            for ( var item in entityCustomValidation ) {
                if (entityCustomValidation[item]['invalid']) {
                    setValid(false)
                    tempValid = false
                    setSwipeIndex(0)
                    enqueueSnackbar(`Personal Information - ${entityData[item]['label']} is invalid`, {
                        variant: 'error',
                        preventDuplicate: true,
                        anchorOrigin: {
                            horizontal: 'left',
                            vertical: 'top',
                        }
                    })
                }

                break
            }
        }

        // last company details validation
        if (tempValid) {
            var expKeys = ['']
            if ('total_experience' in experience) {
                if (experience['total_experience'] == '') {
                    setValid(false)
                    tempValid = false
                    setSwipeIndex(0)
                    enqueueSnackbar(`Total Work Experience must be filled up`, {
                        variant: 'error',
                        preventDuplicate: true,
                        anchorOrigin: {
                            horizontal: 'left',
                            vertical: 'top',
                        }
                    })
                }
            } else {
                setValid(false)
                tempValid = false
                setSwipeIndex(0)
                enqueueSnackbar(`Total Work Experience must be filled up`, {
                    variant: 'error',
                    preventDuplicate: true,
                    anchorOrigin: {
                        horizontal: 'left',
                        vertical: 'top',
                    }
                })
            }
            if (!'other_experience' in experience) {

            }
        }

        console.log('w3w1.1', tempValid, valid);

        if (tempValid) {
            setValid(true)
            setSwipeIndex(swipeIndex+1)
        }
    }

    const questionValidation = () => {
        console.log('debug custom questions validation:', questionsCustomValidation)

        var tempValid = true
        // questions validation
        if (tempValid) {
            for (var item in questionsCustomValidation) {
                if (questionsCustomValidation[item].invalid) {
                    console.log('debug validation', item, questionsCustomValidation[item])
                    tempValid = false
                    setValid(false)
                    setSwipeIndex(questionsCustomValidation[item].index)
                    enqueueSnackbar(`Form is invalid! Please check the Question ${item}`, {
                        variant: 'error',
                        preventDuplicate: true,
                        anchorOrigin: {
                            horizontal: 'left',
                            vertical: 'top',
                        }
                    })

                    return
                }
            }
        }

        if (tempValid) {
            console.log('w3w2');
            setValid(true)
            setSwipeIndex(swipeIndex+1)
        }
    }

    const experienceSubmit = () => {
        console.log('debug experience submit', experience);
        dataServicePrivate('POST', 'entity/experience/submit', {
            entity_id: entity['id'],
            experience
        }).then((result) => {
            console.log('debug experience result', result);
        }).catch((err) => {
            console.log('debug experience err result', err);

        })
    }

    const entityDetailsSubmit = () => {
        console.log('debug other details submit', otherDetails);
        dataServicePrivate('POST', 'entity/details/define', otherDetails).then((result) => {
            console.log('debug other details result', result);
        }).catch((err) => {
            console.log('debug other details err result', err);

        })
    }

    const entityReferenceSubmit = () => {
        console.log('debug entity reference submit', reference);
        dataServicePrivate('POST', 'entity/reference/submit', {
            reference,
            entity_id: String(entity['id']),
        }).then((result) => {
            console.log('debug entity reference result', result);
        }).catch((err) => {
            console.log('debug entity reference err result', err);

        })
    }

    useEffect(() => {
        console.log("debug effect questions", questions);
        // console.log("debug effect questions", Object.keys(questions).length);

        SetSwipeContent({ 0: entityContent })
        setQuestionsCustomValidation()
        var count = 0
        var id_count = 0

        var swipecount = 0
        Object.keys(questions).map((item, key) => {
            Object.keys(questions[item]).map((_item, _key) => {
                if ( !['label', 'link'].includes(questions[item][_item].type) ) {
                    setQuestionsCustomValidation(prev => ({
                        ...prev,
                        [count+=1]: {
                            index: key+1,
                            invalid: true,
                            id: questions[item][_item]?.id,
                        }
                    }))
                }
            })

            var tempContent
            tempContent = (
                <MDBox>
                    {
                        Object.keys(questions[key]).map((_item, _key) => {
                            if ( questions[key][_key].type == 'input' ) {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                                            <MDTypography variant='button'>{qCount}.</MDTypography>
                                            <MDInput 
                                                id={questions[key][_key]?.title}
                                                type="text" 
                                                label={`${key} `+questions[key][_key]?.title}
                                                variant="standard"
                                                fullWidth
                                                sx={{
                                                    '& .MuiInputLabel-root:not(.Mui-focused)': {
                                                        color: 'black!important',
                                                    }
                                                }}
                                                autoComplete="off"
                                                onChange={e => {
                                                    handleAnswer(key, _key, questions[key][_key], e.target.value);
                                                    setQuestionsCustomValidation(prev => ({
                                                        ...prev,
                                                        [qCount]: {
                                                            ...prev[qCount],
                                                            invalid: customValidation(e.target.value, 'input'),
                                                        }
                                                    }))
                                                }}
                                                disabled={disabled}
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            } 
                            else if ( questions[key][_key].type == 'select' ) {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                                            <MDTypography variant="button">{qCount}.</MDTypography>
                                            <MDInput
                                                id={questions[key][_key]?.title}
                                                label={questions[key][_key]?.title}
                                                select
                                                InputLabelProps={{
                                                    style: {
                                                        color: 'black'
                                                    }
                                                }}
                                                sx={{
                                                    height: "44px",
                                                    '& .MuiInputLabel-root:not(.Mui-focused)': {
                                                        color: 'black!important',
                                                    }
                                                }}
                                                fullWidth
                                                multiline
                                                variant="standard"
                                                onChange={e => {
                                                    handleAnswer(key, _key, questions[key][_key], e.target.value);
                                                    setQuestionsCustomValidation(prev => ({
                                                        ...prev,
                                                        [qCount]: {
                                                            ...prev[qCount],
                                                            invalid: customValidation(e.target.value, 'input'),
                                                        }
                                                    }))
                                                }}
                                                disabled={disabled}
                                            >
                                                {
                                                    questions[key][_key]?.value?.split(', ').map((_item, _key) => (
                                                        <MenuItem key={_key} value={_item}>{_item}</MenuItem>
                                                    ))
                                                }
                                            </MDInput>
                                        </CardContent>
                                    </Card>
                                )
                            } 
                            else if ( questions[key][_key].type == 'check' ) {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                            <MDTypography variant="button">{qCount}.</MDTypography>
                                            <FormControl fullWidth>
                                                <FormLabel sx={{
                                                    fontWeight: 400,
                                                    letterSpacing: '0.00938em',
                                                    color: 'black !important',
                                                    fontSize: '0.875rem',
                                                }}>{questions[key][_key]?.title}</FormLabel>
                                                    <FormGroup>
                                                        {
                                                            questions[key][_key]?.value?.split(', ').map((__item, __key) => {
                                                                return (
                                                                    <FormControlLabel key={__key} control={
                                                                        <Checkbox 
                                                                            onChange={e => {
                                                                                handleAnswer(key, _key, questions[key][_key], __item);
                                                                                setQuestionsCustomValidation(prev => ({
                                                                                    ...prev,
                                                                                    [qCount]: {
                                                                                        ...prev[qCount],
                                                                                        invalid: customValidation(__item, 'input'),
                                                                                    }
                                                                                }))
                                                                            }}
                                                                            disabled={disabled}
                                                                        />
                                                                    } label={__item} />
                                                                );
                                                            })
                                                        }
                                                    </FormGroup>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            else if ( questions[key][_key].type == 'radio' ) {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                            <MDTypography variant="button">{qCount}.</MDTypography>
                                            <FormControl fullWidth>
                                                <FormLabel sx={{
                                                    fontWeight: 400,
                                                    letterSpacing: '0.00938em',
                                                    color: 'black !important',
                                                    fontSize: '0.875rem',
                                                }}>{questions[key][_key]?.title}</FormLabel>
                                                <RadioGroup
                                                    onChange={e => {
                                                        handleAnswer(key, _key, questions[key][_key], e.target.value);
                                                        setQuestionsCustomValidation(prev => ({
                                                            ...prev,
                                                            [qCount]: {
                                                                ...prev[qCount],
                                                                invalid: customValidation(e.target.value, 'input'),
                                                            }
                                                        }))
                                                    }}
                                                >
                                                    {
                                                        questions[key][_key]?.value?.split(', ').map((__item, __key) => (
                                                            <FormControlLabel key={__key} value={__item} control={<Radio />} label={__item} disabled={disabled} />
                                                        ))
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            else if (questions[key][_key].type == 'file') {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                                            <MDTypography variant="button">{qCount}.</MDTypography>
                                            <MDBox>
                                                <MDTypography sx={{ fontSize: 14 }} color="black" gutterBottom>{questions[key][_key]?.title}</MDTypography>
                                                <FileUpload question={questions[key][_key]} 
                                                    data={e => {
                                                        handleAnswer(key, _key, questions[key][_key], e);
                                                        setQuestionsCustomValidation(prev => ({
                                                            ...prev,
                                                            [qCount]: {
                                                                ...prev[qCount],
                                                                invalid: customValidation(e, 'input'),
                                                            }
                                                        }))
                                                    }}
                                                    disabled={disabled}
                                                />
                                            </MDBox>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            else if (questions[key][_key].type == 'link') {
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <MDTypography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{questions[key][_key]?.title}</MDTypography>
                                            <MDBox display="grid">
                                                {
                                                    questions[key][_key]?.value?.split(', ').map((_item, _key) => (
                                                        <Link key={_key} color="blue" href={_item} target="_blank">{String(_item).split('/')[2]}</Link>
                                                    ))
                                                }
                                            </MDBox>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            else if (questions[key][_key].type == 'label') {
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <MDTypography><div dangerouslySetInnerHTML={{__html: questions[key][_key]?.value}} /></MDTypography>
                                        </CardContent>
                                    </Card>
                                )
                            }
                        })
                    }
                    <Divider sx={{ my: 4 }} />
                </MDBox>
            )

            SetSwipeContent(prev => ({
                ...prev,
                [key+1]: tempContent
            }))
            swipecount = key+1

        })

    },[questions, disabled, expCount])

    const careerHandle = (key) => {

        setEntityCareer({
            entity_id: auth['id'],
            careers_id: careers[key].id
        });

        setCurrentIndex(0)
        setQuestions({})
        setTime(0)

        var button = (<MDButton onClick={isAuth ? () => {
            handleOpen();
            startTimer();
        } : handleRedirection} variant="gradient" color="info" py="2rem" px="3rem" sx={{ fontSize: 30, fontWeight: 'bold' }}>
            Apply
        </MDButton>)
        var exist = false
        Object.keys(hasCareers).map((item, index) => {
            console.log('id', hasCareers[item], careers[key]);
            if (hasCareers[item].careers == careers[key].id) {
                exist = true
            }
        })

        if (exist) {
            button = (<MDButton disabled variant="gradient" color="info" py="2rem" px="3rem" sx={{ fontSize: 30, fontWeight: 'bold' }}>
                Applied
            </MDButton>)
        }

        setContent(
            <MDBox px="2rem">
                <MDBox mb="3rem">
                    <MDTypography color='info' fontWeight="bold" sx={{ fontSize: 50, lineHeight: .9 }} >{careers[key].title}</MDTypography>
                    <Divider />
                    <MDTypography>Job type: {careers[key].type}</MDTypography>
                    <MDTypography>Full-time hours: {careers[key].benifits}</MDTypography>
                    <MDTypography>Experience: {careers[key].experience}</MDTypography>
                    <MDTypography>Salary: {careers[key].salary}</MDTypography>
                    <MDBox mt="2rem">{button}</MDBox>
                </MDBox>
                <MDTypography><div dangerouslySetInnerHTML={{__html: careers[key].descriptions}} /></MDTypography>
            </MDBox>
        );

        const has = careers[key].has
        Object.keys(has).map((item, key) => {
            setQuestions(prev => ({ 
                ...prev, 
                [has[key].section]: {
                    ...prev[has[key].section],
                    [has[key].order]: has[key].questions
                } 
            }))
            
        })

    }

    const handleAnswer = (key1, key2, data, value) => {
        console.log("debug career handle answer data:", data, value);
        console.log("debug answer data:", answers);

        setAnswer({key1, key2, data, value})
    }

    useEffect(() => {
        console.log('useEffect answer', answer)
        console.log('useEffect answers', answers)

        if (answer) {
            var value = answer.value

            if ( answer?.data.type == 'file' ) {
                if ( value != undefined ) snackBar('Upload Success: '+ value['name'], 'success')
            }

            if ( answer?.data.type == 'check' ) {
                console.log("debug career handle answer:", answers)
                if (answers != undefined) {
                    if (answers[answer.key1]) {
                        console.log("here")
    
                        if (answers[answer.key1][answer.key2]) {
                            console.log("debug career handle answer array:", answers[answer.key1][answer.key2].value)
                            var array = answers[answer.key1][answer.key2].value.length != 0 ? answers[answer.key1][answer.key2].value.split(", ") : []
                            console.log("debug career handle answer find:", array, array.includes(value))
                            if (array.includes(value)) {
                                var index = array.indexOf(value)
                                console.log("debug career handle answer index:", index)
                                array.splice(index, 1)
                            } else {
                                array.push(value)
                            }
                            value = array.join(", ")
                        }
                        console.log(value)
                    }
                }
            }

            if ( !answers ) {
                if (answer?.data.type == 'file') {
                    setAnswers({
                        [answer.key1] : {
                            [answer.key2]: {
                                entity_id: auth['id'],
                                question_id: answer.data.id,
                                type: value['type'],
                                value: value,
                            }
                        }
                    })
                } else {
                    setAnswers({
                        [answer.key1] : {
                            [answer.key2]: {
                                entity_id: auth['id'],
                                careers_id: entityCareer.careers_id,
                                question_id: answer.data.id,
                                value: value,
                            }
                        }
                    })
                }

            } else {
                if (answer?.data.type == 'file') {
                    setAnswers(prev => ({
                        ...prev,
                        [answer.key1] : {
                            ...prev[answer.key1],
                            [answer.key2]: {
                                entity_id: auth['id'],
                                question_id: answer.data.id,
                                type: value['type'],
                                value: value,
                            }
                        }
                    }))
                } else {
                    setAnswers(prev => ({
                        ...prev,
                        [answer.key1] : {
                            ...prev[answer.key1],
                            [answer.key2]: {
                                entity_id: auth['id'],
                                careers_id: entityCareer.careers_id,
                                question_id: answer.data.id,
                                value: value,
                            }
                        }
                    }))
                }

            }
        }
    }, [answer])

    const handleSubmit = () => {
        console.log('debug answers:', answers)
        console.log('debug entity:', entity)

        var submitAnswers = {
            answers: {}
        }
        var count = 0

        var fileAnswers = {}

        Object.keys(answers).map((item, key) => {
            Object.keys(answers[key]).map((_item, _key) => {
                if (answers[key][_item]?.type) {
                    submitAnswers['answers'][count] = {}
                    fileAnswers[count] = answers[key][_item]
                    count += 1
                    
                } else {
                    submitAnswers['answers'][count] = answers[key][_item]
                    count += 1
                }

            })
        })
        submitAnswers['entity'] = entity
        submitAnswers['career'] = entityCareer

        console.log('debug here', submitAnswers, fileAnswers)
        var syncCount = 0
        if ( Object.keys(fileAnswers).length ) {
            Object.keys(fileAnswers).map((item, key) => {
                console.log('debug here2',item, key, fileAnswers[item]);
                let formData = new FormData()
                formData.append('entity_id', fileAnswers[item].entity_id)
                formData.append('careers_id', entityCareer.careers_id)
                formData.append('question_id', fileAnswers[item].question_id)
                formData.append('type', fileAnswers[item].type)
                formData.append('file', fileAnswers[item].value)
        
                axiosPrivate.post('hr/careers/entity/submit', formData, {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                    }
                }).then((result) => {
                    console.log('debug upload file response:', result);
                    submitAnswers['answers'][item] = {
                        'entity_id': fileAnswers[item].entity_id,
                        'careers_id': entityCareer.careers_id,
                        'question_id': fileAnswers[item].question_id,
                        'files_id': result['data']['entity_career'].files_id,
                        'type': fileAnswers[item]['value'].type,
                        'value': fileAnswers[item]['value'].name,
                    }
                    
                    syncCount += 1
                    if ( Object.keys(fileAnswers).length == syncCount ) {
                        console.log('debug submit here1:', submitAnswers);
                        // submit all answers
                        submitDataSync(submitAnswers)
                    }
                }, (err) => {
                    console.log('debug upload file error response:', err);
                    var response = err?.response?.data ? err.response.data : 'Error Request'
                    snackBar('Error Request', 'error')
        
                })
            })

        } else {
            console.log('debug submit here2:', submitAnswers);
            // submit file type answers
            submitDataSync(submitAnswers)
        }

    }

    //another function for synchronous method
    const submitDataSync = (data) => {
        dataService('POST', 'hr/careers/entity/submit', data).then((result) => {
            console.log('debug answer response:', result);
            setSwipeIndex(swipeIndex+1)
            entityCareers()
            setContent()
        }, (err) => {
            console.log('debug answer error response:', err);
            var response = err?.response?.data ? err.response.data : 'Error Request'
            snackBar('Error form Submission', 'error')
    
        })
    }

    const snackBar = (title, error) => {
        enqueueSnackbar(title, {
            variant: error,
            preventDuplicate: true,
            anchorOrigin: {
                horizontal: 'right',
                vertical: 'top',
            }
        })
    }

    const GradientProgress = () => (
        <MDBox sx={{ 
            display: progress ? 'block' : 'none', 
            position: 'fixed',
            top: '50%',
            right: '50%',
            transform: 'translate(-50%, -50%)',
        }}>
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e01cd5" />
                <stop offset="100%" stopColor="#1CB5E0" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </MDBox>
    )

    return (
        <PageLayout>
            <Container maxWidth="xl">
                <NavBar />
                <MDBox pt="5rem">
                    <Grid container>
                        <Grid xs={4}>
                            {
                                Object.keys(careers).map((key, item) => (
                                    <Card sx={{ my: '1rem' }} onClick={() => careerHandle(key)} key={item}>
                                        <MDBox p="2rem">
                                            <MDTypography color='info' fontWeight="bold" sx={{ fontSize: 30, lineHeight: .9 }} >{careers[key].title}</MDTypography>
                                            <Divider />
                                            <MDTypography>Job type: {careers[key].type}</MDTypography>
                                            <MDTypography>Full-time hours: {careers[key].benifits}</MDTypography>
                                            <MDTypography>Experience: {careers[key].experience}</MDTypography>
                                            <MDTypography>Salary: {careers[key].salary}</MDTypography>
                                        </MDBox>
                                    </Card>
                                ))
                            }
                        </Grid>
                        <Grid xs={8}>
                            <Sticky>
                                <MDBox p="2rem" sx={{ overflowY: 'scroll', height: '100vh' }}>
                                    {
                                        content ? content :
                                        <MDBox position="relative">
                                            <MDBox display="flex" justifyContent="center" >
                                                <MDBox component='img' src={e20logo} width="75%" height="75%" opacity=".1" />
                                                <MDBox position='absolute' sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                    <MDTypography align="center" fontWeight="medium" sx={{ fontSize: 30, lineHeight: .9, textShadow: '1px 1px 1px rgba(0, 0, 0, .2)' }} >You haven&lsquo;t select a career</MDTypography>
                                                    <MDTypography align="center" sx={{ textShadow: '1px 1px 1px rgba(0, 0, 0, .2)' }}>Select an career on the left to see the details here</MDTypography>
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                    }
                                </MDBox>
                            </Sticky>
                        </Grid>
                    </Grid>
                </MDBox>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    scroll='body'
                    fullWidth
                    fullScreen
                >
                    {/* <LinearProgress sx={{ width: '100%', display: progress >= 100 ? 'none' : 'block' }} /> */}
                    <GradientProgress/>
                    <MDBox 
                    display='flex' 
                    sx={{ 
                        visibility: progress ? 'hidden' : '', 
                        minWidth: { lg: '50rem', md: '40rem', xs: '20rem' },
                        maxWidth: 'min-content',
                        margin: 'auto',
                    }} 
                    justifyContent='center'
                    >
                        <MDBox component='form' onSubmit={handleValidation}>
                            <DialogTitle sx={{ fontSize: '1.75rem' }} align="center" hidden={swipeIndex > Object.keys(questions).length}>PLEASE FILL OUT THIS FORM</DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={(theme) => ({
                                    position: 'absolute',   
                                    right: 8,
                                    top: 8,
                                })}
                            >
                                <Icon>close</Icon>
                            </IconButton>
                            <DialogContent>
                                <SwipeableViews  
                                    axis={swipeDirection} 
                                    index={swipeIndex} 
                                    animateHeight
                                >
                                    {
                                        swipeContent && Object.keys(swipeContent).map((item, key) => (
                                            swipeContent[key]
                                        ))
                                    }
                                    {lastContent()}
                                    {responseContent()}
                                </SwipeableViews>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: 'end' }}>
                                {
                                    swipeIndex <= Object.keys(questions).length+1 ? 
                                    <MDBox>
                                        { swipeIndex == Object.keys(questions).length+1 ?
                                            (
                                                <MDBox>
                                                    <MDBox sx={{ display: 'flex' }}>
                                                        <MDButton onClick={ () => setSwipeIndex(swipeIndex-1) }>
                                                            Back
                                                        </MDButton>
                                                        { view && 
                                                        <MDButton sx={{ mx: 1 }} type='submit' color="info">
                                                            Submit
                                                        </MDButton> }
                                                    </MDBox>
                                                </MDBox>
                                            ) :
                                            (
                                                <MDBox >
                                                    <MDButton sx={{ mx: 1, display: swipeIndex == 0 && 'none' }} onClick={ () => setSwipeIndex(swipeIndex-1) }>
                                                        Back
                                                    </MDButton>
                                                    <MDButton sx={{ mx: 1 }} color="info" onClick={ () => {
                                                        if (swipeIndex == 0) {
                                                            entityValidation()
                                                        } else {
                                                            questionValidation()
                                                        }
                                                    } }>
                                                        Next
                                                    </MDButton>
                                                </MDBox>
                                            )
                                        }
                                    </MDBox>
                                    :
                                    <></>
                                }
                            </DialogActions>
                        </MDBox>
                    </MDBox>
                </Dialog>
            </Container>
            <Notifications data={notif} />
        </PageLayout>
    );
}

export default Careers;