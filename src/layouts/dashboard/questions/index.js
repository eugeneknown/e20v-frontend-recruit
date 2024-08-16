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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Fade, FormControl, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, FormLabel, 
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, CardMedia, CardContent, Chip, Popover } from "@mui/material";

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

//img
import inputImg from 'assets/images/text-field-light.png';
import selectImg from 'assets/images/select-light.png';
import checkImg from 'assets/images/checkbox-light.png';
import radioImg from 'assets/images/radio-group-light.png';
import uploadImg from 'assets/images/snackbar-light.png';
import linkImg from 'assets/images/link-light.png';
import labelImg from 'assets/images/autocomplete-light.png';

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { axiosPrivate } from "api/axios";
import team3 from "assets/images/team-3.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import MDInput from "components/MDInput";
import moment from "moment";
import SwipeableViews from "react-swipeable-views";
import ConfirmDialog from "./confirm-dialog";
import { useSnackbar } from "notistack";
import { SimpleEditor } from "../positions/rte";


function Questions() {

    const [data, setData] = useState({});
    const [content, setContent] = useState();
    const [question, setQuestion] = useState({})
    const [options, setOptions] = useState({})
    const [addOption, setAddOption] = useState([])
    const [inputOption, setInputOption] = useState('')
    const [rows, setRows] = useState([]);

    const [open, setOpen] = useState(false);
    const [swipeIndex, setSwipeIndex] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState('x') // 'x-reverse' : 'x'
    const [popOpen, setPopOpen] = useState(null);

    const openPop = Boolean(popOpen);
    const popId = openPop ? 'simple-popover' : undefined;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handlePopOpen = (e) => setPopOpen(e.currentTarget);
    const handlePopClose = () => setPopOpen(null);

    // region confirm modal

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

    const [confirmModal, setConfirmModal] = useState(false)
    const [idDelete, setIdDelete] = useState(0)
    const [action, setAction] = useState('')

    const handleCloseModal = () => {
        setConfirmModal(false)
    }

    const handleDataModal = (e) => {
        console.log('debug confirm dialog data:', e)
        setConfirmModal(false)

        const confirmDelete = async () => {
            await axiosPrivate.post('hr/careers/questions/delete', {id: idDelete}).then((result) => {
                console.log("debug question delete", result.data);
                init()
            }, (e) => {
                console.log("debug question delete error", e);
            })
        }

        if ( e ) {
            confirmDelete()
        }
    }

    // endregion confirm modal

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        init()
    
    },[]);

    const init = async () => {
        try {
            await axiosPrivate.post('hr/careers/questions/all', {}).then((result) => {
                console.log("debug questions", result.data);
                var result = result.data['career_questions']
                // setData(result)

                setRows([])
                Object.keys(result).map((item, key) => {
                    setRows(prev => [
                        ...prev,
                        {
                            title: (<MDTypography display="block" variant="button" fontWeight="medium">{result[key].title}</MDTypography>),
                            type: (<MDTypography textTransform="capitalize" display="block" variant="caption" color="text" fontWeight="medium">{result[key].type}</MDTypography>),
                            created: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {formatDateTime(result[key].created_at)}
                                </MDTypography>
                            ),
                            status: (
                            <MDBox ml={-1}>
                                <MDBadge badgeContent={result[key].status} color={result[key].status == 'active' ? 'success' : 'dark'} variant="gradient" size="sm" />
                            </MDBox>
                            ),
                            actions: (
                                <MDBox>
                                    <Grid container spacing={.5}>
                                        {
                                            Object.keys(actions).map((_key) => {
                                                return (
                                                    <Grid item key={actions[_key].key}>
                                                        <MDButton onClick={() => handleAction({key: actions[_key].key, data: result[key]})} color={actions[_key].color}>{actions[_key].name}</MDButton>
                                                    </Grid> 
                                                )
                                            })
                                        }
                                    </Grid>
                                </MDBox>
                            ),
                        }
                    ])
                }) 
            });
        } catch (err) {
            console.log("debug questions error", err);
        }
    }

    const columns = [
        { Header: "question", accessor: "title", width: "45%", align: "left" },
        { Header: "type", accessor: "type", align: "left" },
        { Header: "created", accessor: "created", align: "center" },
        { Header: "status", accessor: "status", align: "center" },
        { Header: "actions", accessor: "actions", align: "center" },
    ]

    const actions = [
        { name: 'View', type: 'button', key: 'view', color: 'secondary' },
        { name: 'Edit', type: 'button', key: 'edit', color: 'warning' },
        { name: 'Delete', type: 'button', key: 'delete', color: 'error' },
    ]

    const componentList = [
        { label: 'Text Field', value: 'input', img: inputImg },
        { label: 'Select', value: 'select', img: selectImg },
        { label: 'Checkbox', value: 'check', img: checkImg },
        { label: 'Radio Group', value: 'radio', img: radioImg },
        { label: 'Upload File', value: 'file', img: uploadImg },
        { label: 'Link', value: 'link', img: linkImg },
        { label: 'Label', value: 'label', img: labelImg },
    ]

    useEffect(() => {
        console.log('debug add option data', addOption)
        setQuestion(prev => ({ ...prev, 'value': addOption.join(', ') }))
    },[addOption]);

    const handleLabelData = (data) => {
        setQuestion(prev => ({ ...prev, 'value': data }))

    }

    const handleAction = (params) => {
        console.log('debug action handle:', params, confirmModal)

        setAction(params['key'])
        if (params['key'] == 'create') {
            setSwipeIndex(0)
            setQuestion({})
        }
        if (params['key'] == 'view') {
            setSwipeIndex(1)
            setQuestion({
                title: params['data'].title,
                type: params['data'].type,
                value: params['data'].value,
            })
        }
        if (params['key'] == 'edit') {
            setSwipeIndex(1)
            setQuestion({
                id: params['data'].id,
                title: params['data'].title,
                type: params['data'].type,
                value: params['data'].value,
            })

            setAddOption(params['data'].value.split(', '))
        }
        if (params['key'] == 'delete') {
            setIdDelete(params['data'].id)
            setConfirmModal(true)
        } else {
            handleOpen()
        }
       
    }

    const handleDeleteAddOption = (item, data) => {
        console.log('debug delete add option', item, data)
        var option = data.split(', ')
        var index = option.indexOf(item)
        option.splice(index, 1)
        setAddOption(option)
    }

    const handleQuestion = (key, e) => {
        console.log('debug question key value', key, e)
        setQuestion(prev => ({ ...prev, [key]: e }))
    }

    const handleAddOptionSubmit = (value=undefined) => {
        if ( value != undefined ) {
            setAddOption(prev => [...prev, value])
        } else {
            setAddOption(prev => [...prev, inputOption])
        }
        setInputOption('')
    }

    const handleQuestionSubmit = () => {
        console.log('debug question:', question)

        submitDataService(question).then((result) => {
            console.log('debug submit question:', result)
            var result = result.data['career_questions']
            var submitAction = ''
            if (action == 'create') {
                submitAction = 'Created'
            } else if (action == 'edit') {
                submitAction = 'Edited'
            } else {
                submitAction = 'Deleted'
            }
            snackBar('Question Successfully '+ submitAction, 'success')
            init()
            handleClose()
        }).catch((err) => {
            console.log('debug error submit question:', err)
            // var response = err?.response?.data ? err.response.data : 'Error Request'
            snackBar('Question Submit Failed', 'error')
        })
    }

    const submitDataService = async (data) => {
        return await axiosPrivate.post('hr/careers/questions/define', data)
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
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                Questions
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                            <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                            />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Fab 
            onClick={() => handleAction({key: 'create'})}
            sx = {{
                display: "flex",
                bgcolor:"white.main",
                shadow: "sm",
                position: "fixed",
                right: "2rem",
                bottom: "2rem",
                zIndex: 99,
            }}
            color="dark"
            >
                <Icon fontSize="medium" >add</Icon>
            </Fab>
            <Footer />
            { confirmModal && <ConfirmDialog closeModal={handleCloseModal} title='Confirm Delete' content='Are you sure to Delete this Question?' data={handleDataModal} /> }
            <MDBox>
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle textAlign='center' textTransform='capitalize'>
                        {action} Question
                    </DialogTitle>
                    <DialogContent>
                        <SwipeableViews axis={swipeDirection} index={swipeIndex}
                        >
                            <Grid my={3} container spacing={2} sx={{ height: swipeIndex ? 0 : 'auto' }}>
                                {
                                    Object.keys(componentList).map((item, key) => (
                                        <Grid key={key} item xs={6}>
                                            <Card 
                                            onClick={() => {
                                                setSwipeIndex(1); 
                                                setQuestion(prev => ({ ...prev, 'type': componentList[item].value }));
                                                setAddOption([]);
                                            }} 
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
                                    <MDInput InputProps={{ readOnly: action == 'view' }} value={question?.title} onChange={(e) => handleQuestion('title', e.target.value)} label="Question" fullWidth sx={{ mb: '1rem' }} />
                                    <MDInput InputProps={{ readOnly: action == 'view' }} value={question?.type} onClick={(e) => action != 'view' && setSwipeIndex(0)} fullWidth sx={{ mb: '1rem' }} />
                                    <Divider />
                                    <MDTypography sx={{ display: question.type == 'input' ? 'none' : 'block' }} fontWeight="bold" variant="caption">Options:</MDTypography>
                                    {
                                        question?.type != 'input' && question?.type != 'label' && question?.value && question?.value.split(', ').map((item, key) => {
                                            if (action == 'edit') {
                                                return (<Chip key={key} label={item} variant="outlined" sx={{ m: "5px" }} onDelete={() => handleDeleteAddOption(item, question?.value)} />) 
                                            } else {
                                                return (<Chip key={key} label={item} variant="outlined" sx={{ m: "5px" }} />)
                                            }
                                        })
                                    }
                                    {
                                        action != 'view' && question.type != 'input' && question?.type != 'label' &&
                                        <Chip icon={<Icon fontSize="medium" >add</Icon>} label="Create" variant="outlined" sx={{ m: "5px" }} onClick={handlePopOpen} />
                                    }
                                    {
                                        question.type == 'label' &&
                                        <SimpleEditor readOnly={action == 'view'} onChange={e => handleLabelData(e)} content={question?.value} />
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
                                            question.type != 'file' ?
                                            (<MDBox display="flex">
                                                <MDInput value={inputOption} onChange={(e) => setInputOption(e.target.value)} size="small" label="Option" sx={{ mr: '3px' }} />
                                                <MDButton onClick={handleAddOptionSubmit} size="small" color='secondary' variant="outlined" >Add</MDButton>
                                            </MDBox>)
                                            :
                                            (<MDBox display='flex'>
                                                {
                                                    Object.keys(fileExtensionList).map((item, key) => (
                                                        <Chip variant="outlined" sx={{ m: "5px" }} label={fileExtensionList[key].title} onClick={() => {
                                                            handleAddOptionSubmit(fileExtensionList[key].value);
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
                        swipeIndex == 1 && 
                        <DialogActions>
                            <MDButton onClick={handleClose}>Close</MDButton>
                            <MDButton sx={{ display: action == 'view' ? 'none' : 'block' }} onClick={handleQuestionSubmit} variant="gradient" color="info">
                                Submit
                            </MDButton>
                        </DialogActions>
                    }
                </Dialog>
            </MDBox>
        </DashboardLayout>
    );
}

export default Questions;