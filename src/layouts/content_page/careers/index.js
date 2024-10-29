import { Card, Container, Divider, Modal, Fade, Backdrop, FormControl, InputLabel, MenuItem, Select, NativeSelect, useTheme, 
    FormControlLabel, FormLabel, RadioGroup, Radio, FormGroup, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, CardContent, Button, Box, Alert, Stack, Icon,
    Link,
    IconButton,
    DialogContentText,
    Tooltip,
    LinearProgress,
    CardHeader} from "@mui/material";
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
    const [entity, setEntity] = useState({});
    const [entityTemp, setEntityTemp] = useState();
    const [notif, useNotif] = useState()
    const [error, setError] = useState([])
    const [platform, setPlatform] = useState({})
    const [platformCareer, setPlatformCareer] = useState()
    const [responseOpen, setResponseOpen] = useState(false)
    const [view, setView] = useState(true)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [hasCareers, setHasCareers] = useState({})

    // stepper
    const [activeStep, setActiveStep] = useState(0);
    const [component, setComponent] = useState(null);

    // swipeable views
    const [swipeIndex, setSwipeIndex] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState('x') // 'x-reverse' : 'x'
    const [swipeContent, SetSwipeContent] = useState()
    const [tabIndex, setTabIndex] = useState(0)
    const swipeableViewsRef = useRef(null)

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    // custom validation
    const [entityCustomValidation, setEntityCustomValidation] = useState({})
    const [questionsCustomValidation, setQuestionsCustomValidation] = useState({})

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // progress
    const [progress, setProgress] = useState(0)
    const timer = useRef()
    const startTimer = () => {
        timer.current = setInterval(() => {
            console.log('debug progress', progress);

            const diff = Math.random() * 40;
            setProgress(oldProgress => Math.min(oldProgress + diff, 100))
        }, 500)
    }   
    useEffect(() => {
        console.log('debug progress', progress);
        if (progress >= 100) {
            clearInterval(timer.current)
        }
    },[progress])

    // work experience
    const [experience, setExperience] = useState({})
    const [expCount, setExpCount] = useState(1)

    const handleRedirection = (e) =>{
        e.preventDefault();

        navigate('/authentication/sign-in', { state: { from: location }, replace: true });
    }

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        setEntity({
            'id': auth['id'],
        });

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

        for (let i=0;i<13;i++) { //13
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
                if (value.length == 11) return false
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
            id: 'Last_name',
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
            label: 'Contact Number',
            type: 'tel',
        },
        {
            id: 'alternative_number',
            label: 'Alternative Number',
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
            label: 'Birth Day',
            type: 'date',
        },
        {
            id: 'children',
            label: 'Children',
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
            value: ['College Graduate', 'High School Graduate', 'Senio High', 'College Level', 'Master\'s Degree'],
        },
        {
            id: 'course',
            label: 'Course',
            type: 'input',
        },
    ]

    const formComponents = (data, count) => {
        console.log('debug form component', data);
        if (data['type'] == 'input') {
            return (
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
                <Card sx={{ my: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                        <MDTypography fontWeight="bold">{count+1}.</MDTypography>
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
            title: 'Last Company Details',
        },
        {
            title: '2nd to the Last Company Details',
        },
        {
            title: '3rd to the Last Company Details',
        },
    ]

    const experienceComponent = (data, count) => (
        <Card sx={{ my: 2 }}>
            <CardHeader title={data['title']}/>
            <CardContent>
                <MDInput
                    type="text" 
                    label='Company'
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root:not(.Mui-focused)': {
                            color: 'black!important',
                        },
                        my: 1,
                    }}
                    variant="standard"
                    onChange={e => {
                        entityHandle(data['id'], e.target.value);
                    }}
                    disabled={disabled}
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
                    onChange={e => {
                        entityHandle(data['id'], e.target.value);
                    }}
                    disabled={disabled}
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
                    onChange={e => {
                        entityHandle(data['id'], e.target.value);
                    }}
                    disabled={disabled}
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
                    onChange={e => {
                        entityHandle(data['id'], e.target.value);
                    }}
                    disabled={disabled}
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
                    onChange={e => {
                        entityHandle(data['id'], e.target.value);
                    }}
                    disabled={disabled}
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
                        }}
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
                                disabled: disabled,
                            }
                        }}
                        onChange={e => {
                            entityHandle(data['id'], e);
                        }}
                    />
                </MDBox>
                <MDBox display='flex' my={1} justifyContent='space-between'>
                    <FormControlLabel control={<Checkbox />} label="Present" />
                    <MDTypography>Length of Stay:</MDTypography>
                </MDBox>
                { expCount < 3 && <MDButton color='info' onClick={() => setExpCount(expCount+1)}>{experienceData[count+1].title}</MDButton> }
            </CardContent>
        </Card>
    )

    const entityContent = (
        <MDBox>
            <MDTypography variant="h5" fontWeight="medium">Personal Information</MDTypography>
            {
                Object.keys(entityData).map((item, index) => (
                    formComponents(entityData[item], index)
                ))
            }
            <Card sx={{ my: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                    <MDTypography fontWeight="bold">19.</MDTypography>
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
                        disabled={disabled}
                    >
                        {
                            platform && Object.keys(platform).map((item, key) => (
                                <MenuItem sx={{ textTransform: 'capitalize' }} key={key} value={platform[item].id}>{platform[item].title}</MenuItem>
                            ))
                        }
                    </MDInput>
                </CardContent>
            </Card>
            <Divider/>
            <MDTypography variant="h5" fontWeight="medium">Work Experience</MDTypography>
            <Card sx={{ my: 2 }}>
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
                        onChange={e => {
                            entityHandle(data['id'], e.target.value);
                        }}
                        disabled={disabled}
                    />
                </CardContent>
            </Card>
            {
                Array.from({length: expCount}, (item, index) => (
                    experienceComponent(experienceData[index], index)
                ))
            }
            <Card sx={{ my: 2, border: 0, boxShadow: 0 }}>
                <CardContent></CardContent>
            </Card>
            {/* <MDBox my={2}></MDBox> */}
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
        // responseOpenHandle()
        setSwipeIndex(swipeIndex+1)
        console.log('debug submit target data:', e)

        console.log('debug custom entity validation:', entityCustomValidation)
        console.log('debug custom questions validation:', questionsCustomValidation)

        var validations = {
            [0]: entityCustomValidation,
            [1]: questionsCustomValidation,
        }

        let valid = true
        // i: for (let i in validations) {
        //     for (let j in validations[i]) {
        //         if (validations[i][j].invalid) {
        //             console.log('debug validation', i, j, validations[i][j])
    
        //             valid = false
        //             setSwipeIndex(validations[i][j].index)
        //             enqueueSnackbar(`Form is invalid! Please check the Question ${i==0 ? validations[i][j].id : j}`, {
        //                 variant: 'error',
        //                 preventDuplicate: true,
        //                 anchorOrigin: {
        //                     horizontal: 'left',
        //                     vertical: 'top',
        //                 }
        //             })
    
        //             break i
        //         }
        //     }
        // }

        console.log('debug submit validity:', valid)
        // if (valid) handleSubmit()
        if (valid) {
            handleSubmit()
        }

        console.log('debug submit entity data:', entity)
        console.log('debug submit question data:', questions)
    }

    useEffect(() => {
        console.log("debug effect questions", questions);
        // console.log("debug effect questions", Object.keys(questions).length);

        SetSwipeContent({ 0: entityContent })
        swipeableViewsRef.current
        .getChildContext()
        .swipeableViews.slideUpdateHeight()
        setQuestionsCustomValidation()
        var count = 13
        var id_count = 13

        var swipecount = 0
        Object.keys(questions).map((item, key) => {
            var tempContent

            tempContent = (
                <MDBox>
                    {
                        Object.keys(questions[key]).map((_item, _key) => {
                            console.log('debug', questions[key][_key].type, questions[key][_key].type != 'link');
                            if ( questions[key][_key].type != 'link' && questions[key][_key].type != 'label' ) {
                                setQuestionsCustomValidation(prev => ({
                                    ...prev,
                                    [count+=1]: {
                                        index: key+1,
                                        invalid: true,
                                        id: questions[key][_key]?.id,
                                    }
                                }))
                            }

                            if ( questions[key][_key].type == 'input' ) {
                                var qCount = id_count+=1
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                                            <MDTypography fontWeight="bold">{qCount}.</MDTypography>
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
                                            <MDTypography fontWeight="bold">{qCount}.</MDTypography>
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
                                            <MDTypography fontWeight="bold">{qCount}.</MDTypography>
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
                                            <MDTypography fontWeight="bold">{qCount}.</MDTypography>
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
                                            <MDTypography fontWeight="bold">{qCount}.</MDTypography>
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
                </MDBox>
            )

            SetSwipeContent(prev => ({
                ...prev,
                [key+1]: tempContent
            }))
            swipecount = key+1

        })

        SetSwipeContent(prev => ({
            ...prev,
            [swipecount+1]: (
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
                            // border: 1, borderColor: 'secondary.main', borderRadius: '16px', borderTop: '5px solid #00a8cd', bgcolor: 'white'
                        }}
                        >
                            <MDTypography variant='h2' sx={{ mb: 3 }}>Thank you for filling out the form! 😊</MDTypography>
                            <MDBox>
                                <MDTypography vairant='body1' gutterBottom>
                                    We have received your application and will get back to you soon.
                                    Meanwhile you can follow us on <Link color='primary' href="https://www.facebook.com/eighty20virtualcareers">@Facebook</Link> for updates.
                                </MDTypography>
                                <MDBox display='flex' justifyContent="space-between">
                                    <Link 
                                    color='info' 
                                    href={`/careers/response?entity=${entityCareer.entity_id}&careers=${entityCareer.careers_id}`} 
                                    sx={{ my: 'auto' }} 
                                    target='_blank'
                                    variant="text"
                                    >
                                        View Response
                                    </Link>
                                    <MDButton color='info' onClick={handleClose}>Return to page</MDButton>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </MDBox>
            )
        }))

    },[questions, disabled, expCount])

    const careerHandle = (key) => {

        setEntityCareer({
            entity_id: auth['id'],
            careers_id: careers[key].id
        });

        setSwipeIndex(0)
        setQuestions({})
        setProgress(0)

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
            snackBar(response, 'error')
    
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
                    <LinearProgress sx={{ width: '100%', display: progress >= 100 ? 'none' : 'block' }} />
                    <MDBox 
                    display='flex' 
                    sx={{ 
                        visibility: progress >= 100 ? '' : 'hidden', 
                        minWidth: { lg: '50rem', md: '40rem', xs: '20rem' },
                        maxWidth: 'min-content',
                        margin: 'auto',
                    }} 
                    justifyContent='center'
                    >
                        <MDBox component='form' onSubmit={handleValidation}>
                            <DialogTitle align="center" hidden={swipeIndex > Object.keys(questions).length}>Please fill out this form</DialogTitle>
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
                                    ref={swipeableViewsRef}
                                >
                                    {
                                        swipeContent && Object.keys(swipeContent).map((item, key) => (
                                            swipeContent[key]
                                        ))
                                    }
                                </SwipeableViews>
                            </DialogContent>
                            <DialogActions sx={{ justifyContent: swipeIndex == Object.keys(questions).length && view ? 'space-between' : 'end' }}>
                                <MDBox display={swipeIndex == Object.keys(questions).length && view ? 'flex' : 'none'}>
                                    <Checkbox required />
                                    <Grid container>
                                        <Grid item xs={12}>
                                        <Tooltip 
                                            title='I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                                            and that any dishonesty or falsification may jeopardize my employment application.'
                                        >
                                            <MDTypography
                                                component="a"
                                                href="#"
                                                variant="button"
                                                fontWeight="bold"
                                                color="info"
                                                textGradient
                                            >
                                                Terms and Conditions
                                            </MDTypography>
                                        </Tooltip>
                                        </Grid>
                                        <Grid item xs={12}>
                                        <MDTypography
                                            variant="button"
                                            fontWeight="regular"
                                            color="text"
                                        >
                                            I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                                            and that any dishonesty or falsification may jeopardize my employment application.
                                        </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox> 
                                {
                                    swipeIndex <= Object.keys(questions).length ? 
                                    <MDBox>
                                        { swipeIndex == Object.keys(questions).length ?
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
                                                    <MDButton sx={{ mx: 1 }} color="info" onClick={ () => setSwipeIndex(swipeIndex+1) }>
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