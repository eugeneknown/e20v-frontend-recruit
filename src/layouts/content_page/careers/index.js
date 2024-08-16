import { Card, Container, Divider, Modal, Fade, Backdrop, FormControl, InputLabel, MenuItem, Select, NativeSelect, useTheme, 
    FormControlLabel, FormLabel, RadioGroup, Radio, FormGroup, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, CardContent, Button, Box, Alert, Stack, Icon,
    Link,
    Slide} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';

import PageLayout from "examples/LayoutContainers/PageLayout";
import NavBar from "../nav_bar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import useAuth from "hooks/useAuth";
import { useNavigate, useLocation, useFetcher } from "react-router-dom";
import { forwardRef, useEffect, useState, ReactElement, Ref } from "react";
import axios from "api/axios";
import MDInput from "components/MDInput";
import { axiosPrivate } from "api/axios";
import { DatePicker } from "@mui/x-date-pickers";
import Notifications from "../../notifications/dynamic-notification";
import Sticky from 'react-sticky-el';
import { useSnackbar } from "notistack";
import MDAlert from "components/MDAlert";
import moment from "moment";

import e20logo from 'assets/images/e20/Eighty_20_shadow_2_transparent.png'
import SwipeableViews from "react-swipeable-views";


function Careers(){

    const Transition = forwardRef(function Transition(
        props: TransitionProps & {
          children: ReactElement;
        },
        ref: Ref<unknown>,
    ) {     
        return <Slide direction="left" ref={ref} {...props} />;
    });

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
 
    // stepper
    const [activeStep, setActiveStep] = useState(0);
    const [component, setComponent] = useState(null);

    // swipeable views
    const [swipeIndex, setSwipeIndex] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState('x') // 'x-reverse' : 'x'
    const [ swipeContent, SetSwipeContent ] = useState()

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleRedirection = (e) =>{
        e.preventDefault();

        navigate('/authentication/sign-in', { state: { from: location }, replace: true });
    }

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
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

    const entityContent = (
        <MDBox>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput
                        id='First Name'
                        type="text" 
                        label='First Name'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('first_name', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Middle Name'
                        type="text" 
                        label='Middle Name'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('middle_name', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Last Name'
                        type="text" 
                        label='Last Name'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('last_name', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput
                        id='Civil Status'
                        select 
                        label='Civil Status'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => entityHandle('civil_status', e.target.value)}
                        
                    >
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                        <MenuItem value="widowed">Widowed</MenuItem>
                    </MDInput>
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Contact Number'
                        inputProps={{ type: 'number' }}
                        type="number" 
                        label='Contact Number'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('contact_number', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Gender'
                        select 
                        label='Gender'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => entityHandle('gender', e.target.value)}
                        
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                    </MDInput>
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id="Age" 
                        inputProps={{ type: 'number' }}
                        type="number" 
                        label='Age'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('age', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Email'
                        type="email" 
                        label='Email'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        onChange={e => entityHandle('email', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Birth Place'
                        type="text" 
                        label='Birth Place'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => entityHandle('birth_place', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <DatePicker 
                        label='Birthday' 
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }} 
                        slotProps={{
                            textField: {
                                id: 'Birthday',
                                variant: 'standard',
                                fullWidth: true,
                                // required: true,
                                InputLabelProps: {
                                    style: {
                                        color: 'black'
                                    }
                                }
                            }
                        }}
                        onChange={e => entityHandle('birthday', e)} 
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Permanent Address'
                        type="text" 
                        label='Permanent Address'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => entityHandle('permanent_address', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Present Address'
                        type="text" 
                        label='Present Address'
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => entityHandle('present_address', e.target.value)}
                        
                    />
                </CardContent>
            </Card>
            <Card sx={{ my: 2 }}>
                <CardContent>
                    <MDInput 
                        id='Where did you hear about us?'
                        type="text" 
                        label='Where did you hear about us?'
                        select
                        fullWidth
                        InputLabelProps={{
                            style: {
                                color: 'black'
                            }
                        }}
                        variant="standard"
                        multiline
                        onChange={e => setPlatformCareer(e.target.value)}
                        
                    >
                        {
                            platform && Object.keys(platform).map((item, key) => (
                                <MenuItem sx={{ textTransform: 'capitalize' }} key={key} value={platform[item].id}>{platform[item].title}</MenuItem>
                            ))
                        }
                    </MDInput>
                </CardContent>
            </Card>
        </MDBox>
    )

    useEffect(() => {
        console.log('debug platform career:', platformCareer);
        setEntityCareer(prev => ({
            ...prev, 'platforms_id': platformCareer
        }))
    }, [platformCareer])

    useEffect(() => {
        setEntity({
            'id': auth['id'],
        });

        const getCareers = async () => {
            try {
                const response = await axios.post('hr/careers/all', {
                    relations: ["has", "questions"]
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

    }, [])

    const handleValidation = (e) => {
        e.preventDefault();
        console.log('debug submit target data:', e)

        if (e.target.checkValidity()) {
            console.log("Form is valid! Submitting the form...", Object.keys(questions).length, swipeIndex);
            if ( Object.keys(questions).length == swipeIndex ) {
                handleSubmit()
            } else {
                setSwipeIndex(swipeIndex+1)
            }
            setError([])
        } else {
            console.log("Form is invalid! Please check the fields...");
            var errorList = []
            setError([])
            for (var i=0; i<e.target.length; i++) {
                console.log("Form is invalid! data:", e.target[i].checkValidity(), i, (e.target[i].type == 'textarea' && e.target[i].id == ''));
                if ( !e.target[i].checkValidity() && e.target[i].type != 'button' ) {
                    // console.log("error list:", e.target[i].labels[0].innerText);
                    if (e.target[i].type == 'textarea' && e.target[i].id == '') continue

                    if ( e.target[i].id != '' ) {
                        errorList.push('Invalid ' + e.target[i].id)

                    } else {
                        errorList.push('Invalid ' + e.target[i].previousSibling.id)

                    }
                } 

            }
            setError(errorList)

            console.log("error list:", errorList);

            enqueueSnackbar('Form is invalid! Please check the fields...', {
                variant: 'error',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
        }

        console.log('debug submit entity data:', entity)
        console.log('debug submit question data:', questions)
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    useEffect(() => {
        console.log("debug effect questions", questions);
        // console.log("debug effect questions", Object.keys(questions).length);

        SetSwipeContent({ 0: entityContent })

        Object.keys(questions).map((item, key) => {
            var tempContent

            tempContent = (
                <MDBox>
                    {
                        Object.keys(questions[key]).map((_item, _key) => {
                            if ( questions[key][_key].type == 'input' ) {
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <MDInput 
                                                id={questions[key][_key]?.title}
                                                type="text" 
                                                label={questions[key][_key]?.title}
                                                variant="standard"
                                                fullWidth
                                                InputLabelProps={{
                                                    style: {
                                                        color: 'black'
                                                    }
                                                }}
                                                autoComplete="off"
                                                onChange={e => handleAnswer(key, _key, questions[key][_key], e.target.value)}
                                                
                                            />
                                        </CardContent>
                                    </Card>
                                )
                            } 
                            else if ( questions[key][_key].type == 'select' ) {
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <MDInput
                                                id={questions[key][_key]?.title}
                                                label={questions[key][_key]?.title}
                                                select
                                                InputLabelProps={{
                                                    style: {
                                                        color: 'black'
                                                    }
                                                }}
                                                sx={{ height: "44px" }}
                                                fullWidth
                                                multiline
                                                onChange={e => handleAnswer(key, _key, questions[key][_key], e.target.value)}
                                                
                                                variant="standard"
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
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <FormControl fullWidth>
                                                <FormLabel>{questions[key][_key]?.title}</FormLabel>
                                                    <FormGroup>
                                                        {
                                                            questions[key][_key]?.value?.split(', ').map((__item, __key) => {
                                                                return (
                                                                    <FormControlLabel key={__key} control={
                                                                        <Checkbox onChange={e => handleAnswer(key, _key, questions[key][_key], __item)} />
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
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <FormControl fullWidth>
                                                <FormLabel sx={{ color: 'black' }}>{questions[key][_key]?.title}</FormLabel>
                                                <RadioGroup
                                                    onChange={e => handleAnswer(key, _key, questions[key][_key], e.target.value)}
                                                >
                                                    {
                                                        questions[key][_key]?.value?.split(', ').map((__item, __key) => (
                                                            <FormControlLabel key={__key} value={__item} control={<Radio />} label={__item} />
                                                        ))
                                                    }
                                                </RadioGroup>
                                            </FormControl>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            else if (questions[key][_key].type == 'file') {
                                return (
                                    <Card key={_key} sx={{ my: 2, py: 1 }}>
                                        <CardContent>
                                            <MDTypography sx={{ fontSize: 14 }} color="black" gutterBottom>{questions[key][_key]?.title}</MDTypography>
                                            <Button 
                                                id={questions[key][_key]?.title}
                                                component="label"
                                                role={undefined}
                                                variant="standard"
                                                fullWidth
                                                autoComplete="off"
                                                tabIndex={-1}
                                                startIcon={<Icon >cloudupload</Icon>}
                                            >
                                                Upload File
                                                <VisuallyHiddenInput 
                                                    type="file" 
                                                    accept={questions[key][_key]?.value} 
                                                    onChange={e => handleAnswer(key, _key, questions[key][_key], e.target.files[0])} 
                                                     
                                                />
                                            </Button>
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
                                                        <Link key={_key} color="blue" href={_item} target="_blank">{_item}</Link>
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

        })



        // const key = swipeIndex-1
        // if (swipeIndex == 0) {
        //     setComponent(
        //         <DialogContent>
                    
        //         </DialogContent>
        //     )
        // } else if (Object.keys(questions).length != 0) {
        //     setComponent(
        //         <DialogContent sx={{ bgcolor: 'grey.200' }}>
        //         {
                    
        //         }
        //         </DialogContent>
        //     )
        // }
    },[questions])

    const careerHandle = (key) => {

        setEntityCareer({
            entity_id: auth['id'],
            careers_id: careers[key].id
        });

        setSwipeIndex(0)
        setQuestions({})

        setContent(
            <MDBox px="2rem">
                <MDBox mb="3rem">
                    <MDTypography color='info' fontWeight="bold" sx={{ fontSize: 50, lineHeight: .9 }} >{careers[key].title}</MDTypography>
                    <Divider />
                    <MDTypography>Job type: {careers[key].type}</MDTypography>
                    <MDTypography>Full-time hours: {careers[key].benifits}</MDTypography>
                    <MDTypography>Experience: {careers[key].experience}</MDTypography>
                    <MDTypography>Salary: {careers[key].salary}</MDTypography>
                    <MDBox mt="2rem">
                        <MDButton onClick={isAuth ? handleOpen : handleRedirection} variant="gradient" color="info" py="2rem" px="3rem" sx={{ fontSize: 30, fontWeight: 'bold' }}>
                            Apply
                        </MDButton>
                    </MDBox>
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
                        'question_id': fileAnswers[item].question_id,
                        'files_id': result['data']['entity_career'].files_id,
                        'type': fileAnswers[item]['value'].type,
                        'value': fileAnswers[item]['value'].name,
                    }
                    
                    syncCount += 1
                    if ( Object.keys(fileAnswers).length == syncCount ) {
                        console.log('debug submit here1:', submitAnswers);
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
            submitDataSync(submitAnswers)
        }

    }

    //another function for synchronous method
    const submitDataSync = (data) => {
        dataService('POST', 'hr/careers/entity/submit', data).then((result) => {
            console.log('debug answer response:', result);
            snackBar('Form Successfully Submitted', 'success')
            handleClose()
        }, (err) => {
            console.log('debug answer error response:', err);
            var response = err?.response?.data ? err.response.data : 'Error Request'
            snackBar(response, 'error')
    
        })
    }

    const dataService = async (method, url, data, options={}) =>{
        switch (method) {
            case 'GET':
                return await axiosPrivate.get(url, data, options)

            case 'POST':
                return await axiosPrivate.post(url, data, options)
        }
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
                    onLoad={() => setSwipeIndex(swipeIndex+1)}
                    maxWidth="md"
                    scroll='body'
                    fullWidth
                    // fullScreen
                >
                    <MDBox >
                        <MDBox component='form' onSubmit={handleValidation}>
                            <DialogTitle align="center">Please fill out this form</DialogTitle>
                            <DialogContent>
                                <SwipeableViews axis={swipeDirection} index={swipeIndex} animateHeight >
                                    {
                                        swipeContent && Object.keys(swipeContent).map((item, key) => (
                                            swipeContent[key]
                                        ))
                                    }
                                </SwipeableViews>
                            </DialogContent>
                            <DialogActions>
                                { swipeIndex == Object.keys(questions).length ?
                                    (
                                        <MDBox sx={{ display: 'flex' }}>
                                            <FormControlLabel
                                            sx={{
                                                display: 'flex',
                                                fontWeight: '400',
                                                fontSize: '.75rem',
                                                lineHeight: 1.66,
                                                letterSpacing: '0.03333em',
                                                '& .MuiFormControlLabel-asterisk': {
                                                    display: 'none',
                                                }
                                            }}
                                            disableTypography
                                            required
                                            control={<Checkbox  />}
                                            label="I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                                            and that any dishonesty or falsification may jeopardize my employment application.*"
                                            />
                                            <MDBox sx={{ display: 'flex' }}>
                                                <MDButton onClick={ () => setSwipeIndex(swipeIndex-1) }>
                                                    Back
                                                </MDButton>
                                                <MDButton sx={{ mx: 1 }} type='submit' color="info">
                                                    Submit
                                                </MDButton>
                                            </MDBox>
                                        </MDBox>
                                    ) :
                                    (
                                        <MDBox >
                                            <MDButton sx={{ mx: 1, display: swipeIndex == 0 && 'none' }} onClick={ () => setSwipeIndex(swipeIndex-1) }>
                                                Back
                                            </MDButton>
                                            <MDButton sx={{ mx: 1 }} color="info" onClick={ () => setSwipeIndex(swipeIndex+1)}>
                                                Next
                                            </MDButton>
                                        </MDBox>
                                    )
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