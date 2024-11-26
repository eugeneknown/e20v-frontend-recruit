/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import { Fade, FormControl, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, Grid, 
    Chip, Popover, Tabs, Tab, CardMedia, CardContent, CardActions, List, ListItemButton, ListItemText, ListItem, IconButton, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions} from "@mui/material";
import { Delete } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { EditorProvider } from "@tiptap/react";
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { axiosPrivate } from "api/axios";
import team3 from "assets/images/team-3.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import { Add } from "@mui/icons-material";
import MDInput from "components/MDInput";
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import PropTypes, { arrayOf, object } from 'prop-types';

import inputImg from 'assets/images/text-field-light.png';
import selectImg from 'assets/images/select-light.png';
import checkImg from 'assets/images/checkbox-light.png';
import radioImg from 'assets/images/radio-group-light.png';
import uploadImg from 'assets/images/snackbar-light.png';
import linkImg from 'assets/images/link-light.png';
import labelImg from 'assets/images/autocomplete-light.png';

import ConfirmDialog from "../dynamic/confirm-dialog";
import { useSnackbar } from "notistack";
import DragQuestions from "./new-questions";

// todo migrate the data that has question and constant questions
function Questions({data={}}) {

    const theme = useTheme();
    const [result, setResult] = useState({});
    const [open, setOpen] = useState(false);
    // const [content, setContent] = useState();
    const [value, setValue] = useState({});
    const [questions, setQuestions] = useState({});

    const [popOpen, setPopOpen] = useState(null);
    const [popOpenQuestion, setPopOpenQuestion] = useState(null);

    //question and answers
    const [careerQuestions, setCareerQuestions] = useState({});
    const [newQuestions, setNewQuestions] = useState({});
    const [newAnswer, setNewAnswer] = useState([]);
    const [inputAnswer, setInputAnswer] = useState('');
    const [section, setSection] = useState(0);

    const openPop = Boolean(popOpen);
    const popId = openPop ? 'simple-popover' : undefined;
    const openPopQuestion = Boolean(popOpenQuestion);
    const popQuestionId = openPopQuestion ? 'simple-popover' : undefined;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePopOpen = (e) => setPopOpen(e.currentTarget);
    const handlePopClose = () => setPopOpen(null);
    const handlePopOpenQuestion = (e) => setPopOpenQuestion(e.currentTarget);
    const handlePopCloseQuestion = () => setPopOpenQuestion(null);

    // region confirm modal

    const [confirmModal, setConfirmModal] = useState(false)
    const [actionhandle, setActionHandle] = useState('')
    const [idDelete, setIdDelete] = useState(0)
    const [action, setAction] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [modalData, setModalData] = useState({})

    const handleCloseModal = () => {
        setConfirmModal(false)
    }

    const handleDataModal = (e) => {
        console.log('debug confirm dialog data:', e, modalData)
        setConfirmModal(false)

        if ( e ) {
            if ( actionhandle == 'deleteQuestion' ) {
                handleDelete(modalData.key, modalData.id)
            }

            if ( actionhandle == 'addQuestion' ) {
                addQuestionHandle(modalData.id, modalData.data)
            }
        }
    }

    // endregion confirm modal

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()
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

    useEffect(() => {
        console.log('debug question data:', data)

        const getCareerQuestion = async () => {
            try {
                const response = await axiosPrivate.post('hr/careers/questions/all', {})
                console.log('debug career questions response:', response)
                const result = response.data['career_questions']
                setCareerQuestions(result)
            } catch (e) {
                console.log('debug career questions error response:', e)

            }
        }
        getCareerQuestion();
        
        if (data.action != 'create') {
            getCareerHasQuestion().then((result) => {
                setQuestions(sortQuestions(result))
            })
        }
    },[]);

    const getCareerHasQuestion = async () => {
        try {
            return await axiosPrivate.post('hr/careers/has/questions/all', {
                careers_id: data['questions'].id,
                relations: ['questions'],
            }).then((result) => {
                console.log('debug career has questions response:', result)
                return result.data['career_questions']
            })
        } catch (e) {
            console.log('debug career has questions error response:', e)

        }
    }

    const getSections = (data) => {
        var array = []
        Object.keys(data).map((item, key) => {
            if (!array.includes(data[key].section)) {
                array.push(data[key].section)
            }
        })
        return array.sort()
    }

    const sortQuestions = (data) => {
        var section = getSections(data)

        var object = {}
        section.map(key => {
            var order = 0
            Object.keys(data).map((_item, _key) => {
                data[_key]['questions']['has_id'] = data[_key].id
                if ( key == data[_key].section ) {
                    object[key] = {
                        ...object[key],
                        [order]: data[_key].questions
                    }
                    order += 1
                }
            })
        })
        return object
    }

    const addQuestionHandle = (career_id, question_data) => {
        console.log('debug add question handle', career_id, question_data, section)

        if (!questions) {
            submitHasQuestion(career_id, question_data.id, 0).then((result) => {
                question_data['has_id'] = result.id
    
                setQuestions({ 
                    [section]: {
                        0: question_data
                    } 
                })
            })
        } else {
            var count = 0
            Object.keys(questions[section]).map(() => {
                count+=1
            })
            submitHasQuestion(career_id, question_data.id, count).then((result) => {
                question_data['has_id'] = result.id

                setQuestions(prev => ({ 
                    ...prev, 
                    [section]: {
                        ...prev[section],
                        [count]: question_data
                    } 
                }))
            })
        }
        snackBar('Question Added', 'success')

    }

    useEffect(() => {
        setNewQuestions(prev => ({ ...prev, 'value': newAnswer.join(', ') }))
        console.log('debug question effect new Questions:', newQuestions)

    },[newAnswer]);

    const handleDelete = async (key, id) => {
        console.log('debug question delete:', key, id, questions)
        try {
            await axiosPrivate.post('hr/careers/has/questions/delete', {id}).then((result) => {
                getCareerHasQuestion().then((_result) => {
                    var question = sortQuestions(_result)
                    snackBar('Question Deleted', 'success')
                    setQuestions(question)
                    handleSort(question)
                })

                console.log("debug delete career has question response", result);
            });
        } catch (err) {
            console.log("debug delete career has question error response", err);
            snackBar('Question Deletion failed', 'error')

        }
    }

    const handleSort = async (data) => {
        try {
            return await axiosPrivate.post('hr/careers/has/questions/sort', data).then((result) => {
                console.log("debug sort career has question response", result);
                return result.data['career_questions']
            })
        } catch (err) {
            console.log("debug sort career has question error response", err);
        }
    }

    const handleNewQuestions = (key, e) => {
        console.log('debug question new answer key', key, e)
        setNewQuestions(prev => ({ ...prev, [key]: e }))
    }

    const handleNewQuestionsSubmit = () => {
        console.log('debug question new answer submit questions:', newQuestions)
        console.log('debug question new answer submit answers:', newAnswer)
        
        const submitQuestion = async () => {
            try {
                await axiosPrivate.post('hr/careers/questions/define', newQuestions).then((result) => {
                    console.log('debug submit question:', result)
                    var result = result.data['career_questions']
                    snackBar('Question Successfully Created', 'success')
                    if (!careerQuestions) {
                        setQuestions({ 
                            0: result
                        })
                    } else {
                        var count = 0
                        Object.keys(careerQuestions).map(() => {
                            count+=1
                        })

                        setCareerQuestions(prev => ({ 
                            ...prev, 
                            [count]: result
                        }))
                    }

                    setNewQuestions({})
                    setNewAnswer([])
                    handleClose()
                });
                
            } catch (err) {
                console.log("debug new question error", err);
                snackBar('Question Submit Failed', 'error')
            }
        }
        submitQuestion();

    }

    const submitHasQuestion = async (careers_id, questions_id, order) => {
        try {
            const response = await axiosPrivate.post('hr/careers/has/questions/define', {
                careers_id, 
                questions_id,
                order,
                section: section,
            });
            console.log("debug new has question", response.data);
            return response.data['career_questions']
        } catch (err) {
            console.log("debug new has question error", err);
        }
    }

    const handleNewAnswerSubmit = (value=undefined) => {
        console.log('debug question new answer submit', inputAnswer)

        if ( value != undefined ) {
            setNewAnswer(prev => [...prev, value])
        } else {
            setNewAnswer(prev => [...prev, inputAnswer])
        }
        setInputOption('')
    }

    const handleDeleteNewAnswer = (item, data) => {
        console.log('debug delete new answer', item, data)
        var option = data.join(', ').split(', ')
        var index = option.indexOf(item)
        option.splice(index, 1)
        setNewAnswer(option)
    }

    const [value1, setValue1] = useState(0);

    const handleChange = (newValue, type="") => {
        setValue1(newValue);

        if (type != "") {
            handleNewQuestions('type', type)
        }
    };

    const componentList = [
        { label: 'Text Field', value: 'input', img: inputImg },
        { label: 'Select', value: 'select', img: selectImg },
        { label: 'Checkbox', value: 'check', img: checkImg },
        { label: 'Radio Group', value: 'radio', img: radioImg },
        { label: 'Upload File', value: 'file', img: uploadImg },
        { label: 'Link', value: 'link', img: linkImg },
        { label: 'Label', value: 'label', img: labelImg },
    ]

    const addSectionHandle = () => {
        console.log('debug add section', questions)

        var count = 0
        Object.keys(questions).map(() => {
            count+=1
        })
        setQuestions(prev => ({ 
            ...prev, 
            [count]: {}
        }))
    }

    const dragOnCloseHandle = (e) => {
        getCareerHasQuestion().then((result) => {
            setQuestions(sortQuestions(result))
        })
    }

    const fileExtensionList = [
        {
            title: 'PDF',
            value: '.pdf'
        },
        {
            title: 'Images',
            value: 'image/*'
        },
        {
            title: 'DOC',
            value: '.docx'
        },
        {
            title: 'MP3',
            value: '.mp3'
        },
        {
            title: 'MP4',
            value: '.mp4'
        },
    ]

    return (
        <MDBox>
            <MDBox>
                {
                    questions && 
                    (
                        Object.keys(questions).map((item, key) => (
                            <Accordion
                                key={key}
                                sx={{
                                    mb: '1rem',
                                }}
                                onClick={() => setSection(key)}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    >
                                    <MDTypography 
                                    variant="h6" 
                                    noWrap 
                                    py=".5rem"
                                    sx={{ 
                                        textOverflow: 'ellipsis', 
                                        overflow: 'hidden', 
                                        width: '15rem',
                                    }}>
                                        Additional Questions {key+1}
                                    </MDTypography>
                                </AccordionSummary>
                                <AccordionDetails>
                                {questions[key] && Object.keys(questions[key]).map((_item, _key) => (
                                    <Accordion
                                        sx={{
                                            mb: '1rem',
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            >
                                            <MDTypography 
                                            variant="h6" 
                                            noWrap 
                                            py=".5rem"
                                            sx={{ 
                                                textOverflow: 'ellipsis', 
                                                overflow: 'hidden', 
                                                width: '15rem',
                                            }}>
                                                {questions[key][_key]?.title}
                                            </MDTypography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <MDInput label="Title" value={questions[key][_key]?.title} fullWidth readOnly sx={{ mb: '1rem' }} />
                                            <MDInput label="Type"  value={questions[key][_key]?.type} fullWidth readOnly sx={{ mb: '1rem' }} />
                                            <MDTypography sx={{ display: questions[key][_key]?.type == 'input' ? 'none' : 'block' }} fontWeight="bold" variant="caption">Options:</MDTypography>
                                            {
                                                questions[key][_key]?.type != 'input' && questions[key][_key]?.value && questions[key][_key]?.value?.split(', ').map((item, key) => (
                                                    <Chip key={key} label={item} variant="outlined" sx={{ m: "5px" }} />
                                                ))
                                            }
                                            <MDBox
                                            display='flex'
                                            justifyContent="end"
                                            my={1}
                                            >
                                                { data.action != 'view' && <MDButton onClick={() => {
                                                    setModalData({ key: _key, id: questions[key][_key]?.has_id })
                                                    setActionHandle('deleteQuestion')
                                                    setTitle('Confirm Delete Question')
                                                    setContent('Are you sure to Delete this Question?')
                                                    setConfirmModal(true)
                                                }} sx={{ mx: "3px" }} color="error" variant="outlined">Delete</MDButton> }
                                            </MDBox>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                                
                                { data.action != 'view' && 
                                <Grid container spacing={1}>
                                    <Grid item xs={6}><MDButton onClick={(e) => {
                                        handlePopOpenQuestion(e);
                                    }} variant="outlined" size="large" color="secondary" fullWidth
                                    >
                                        Add Question
                                    </MDButton></Grid>
                                    <Grid item xs={6}><DragQuestions id={data['questions'].id} section={key} onClose={dragOnCloseHandle} /></Grid>
                                </Grid>
                                }
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )
                }
                { data.action != 'view' && <MDButton onClick={addSectionHandle} variant="outlined" size="large" color="secondary" fullWidth>Add Additional Questions</MDButton> }
                <Popover 
                id={popQuestionId}
                open={openPopQuestion}
                onClose={handlePopCloseQuestion}
                anchorEl={popOpenQuestion}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                sx ={{
                    '& .MuiPaper-root': {
                        bgcolor: 'white.main',
                    },
                }}
                BackdropProps={{ invisible: false }}
                >
                    <MDBox p={2}>
                    {
                        Object.keys(careerQuestions).map((item, key) => (
                            <MDBox
                            key={key}
                            borderRadius="lg"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={3}
                            my={1}
                            sx={{
                                border: ({ borders: { borderWidth, borderColor } }) =>
                                `${borderWidth[1]} solid ${borderColor}`,
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setModalData({ id: data['questions'].id, data: careerQuestions[item] })
                                setActionHandle('addQuestion')
                                setTitle('Confirm Add Question')
                                setContent('Are you sure to Add this Question?')
                                setConfirmModal(true)
                            }}
                            >
                                <MDTypography variant="h6" fontWeight="medium">
                                    {careerQuestions[item].title}
                                </MDTypography>
                                {/* <MDBox 
                                ml="auto" 
                                mx={1}
                                lineHeight={0} 
                                // color={darkMode ? "white" : "dark"}
                                >
                                    <Tooltip title="Edit Question" placement="top">
                                        <Icon sx={{ cursor: "pointer" }} fontSize="small">
                                            edit
                                        </Icon>
                                    </Tooltip>
                                </MDBox> */}
                            </MDBox>
                        ))
                    }
                    <MDButton onClick={() => {handleOpen(); handleChange(0);}} variant="outlined" size="large" color="secondary" fullWidth>Create Question</MDButton>
                    </MDBox>
                </Popover>
            </MDBox>
            { confirmModal && <ConfirmDialog closeModal={handleCloseModal} title={title} content={content} data={handleDataModal} /> }
            <Dialog
            open={open}
            onClose={() => { handleClose(); handleChange(0) }}
            >
                <DialogTitle textAlign='center' textTransform='capitalize'>
                    Add Question
                </DialogTitle>
                <DialogContent>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value1}
                    >
                        <Grid my={3} container spacing={2} sx={{ height: value1 ? 0 : 'auto' }}>
                            {
                                Object.keys(componentList).map((item, key) => (
                                    <Grid key={key} item xs={6}>
                                        <Card 
                                        onClick={() => handleChange(1, componentList[item].value)} 
                                        sx={{ width: '-webkit-fill-available', cursor: 'pointer' }}>
                                            <CardMedia
                                                sx={{ height: 75 }}
                                                image={componentList[item].img}
                                            />
                                            <CardContent>
                                                <Divider />
                                                <MDTypography gutterBottom variant="h6" component="div">
                                                    {componentList[item].label}
                                                </MDTypography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <MDBox>
                            <MDBox my={3}>
                                <MDInput value={newQuestions?.title} onChange={(e) => handleNewQuestions('title', e.target.value)} label="Question" fullWidth sx={{ mb: '1rem' }} />
                                <Divider />
                                <MDTypography sx={{ display: newQuestions.type == 'input' ? 'none' : 'block' }} fontWeight="bold" variant="caption">Options:</MDTypography>
                                {
                                    newQuestions.type != 'input' && newQuestions.type != 'label' && newAnswer && Object.keys(newAnswer).map((key) => (
                                        <Chip key={key} label={newAnswer[key]} variant="outlined" sx={{ m: "5px" }} onDelete={() => handleDeleteNewAnswer(newAnswer[key], newAnswer)} />
                                    ))
                                }
                                {
                                    newQuestions.type != 'input' && newQuestions.type != 'label' &&
                                    <Chip icon={<Icon fontSize="medium" >add</Icon>} label="Create" variant="outlined" sx={{ m: "5px" }} onClick={handlePopOpen} />
                                }
                                {
                                    newQuestions.type == 'label' &&
                                    <SimpleEditor readOnly={action == 'view'} onChange={e => handleLabelData(e)} content={newQuestions?.value} />
                                }
                                <Popover
                                id={popId}
                                open={openPop}
                                onClose={handlePopClose}
                                anchorEl={popOpen}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                sx ={{
                                    '& .MuiPaper-root': {
                                        bgcolor: 'white.main',
                                    },
                                }}
                                // BackdropProps={{ invisible: false }}
                                >
                                    {
                                        newQuestions.type != 'file' ?
                                        (<MDBox display="flex">
                                            <MDInput value={inputAnswer} onChange={(e) => setInputOption(e.target.value)} size="small" label="Option" sx={{ mr: '3px' }} />
                                            <MDButton onClick={handleNewAnswerSubmit} size="small" color='secondary' variant="outlined" >Add</MDButton>
                                        </MDBox>)
                                        :
                                        (<MDBox display='flex'>
                                            {
                                                Object.keys(fileExtensionList).map((item, key) => (
                                                    <Chip variant="outlined" sx={{ m: "5px" }} label={fileExtensionList[key].title} onClick={() => {
                                                        handleNewAnswerSubmit(fileExtensionList[key].value);
                                                    }} />
                                                ))
                                            }
                                        </MDBox>)
                                    }
                                </Popover>
                            </MDBox>
                        </MDBox>
                    </SwipeableViews>
                </DialogContent>
                {
                    value1 == 1 && 
                    <DialogActions>
                        <MDButton onClick={() => { handleClose(); handleChange(0); setNewAnswer([]); }}>Close</MDButton>
                        <MDButton onClick={() => { handleChange(0); setNewAnswer([]); }} variant="gradient" color="warning">Back</MDButton>
                        <MDButton sx={{ display: action == 'view' ? 'none' : 'block' }} onClick={handleNewQuestionsSubmit} variant="gradient" color="info">
                            Submit
                        </MDButton>
                    </DialogActions>
                }
            </Dialog>
        </MDBox>

    );
}

export default Questions;