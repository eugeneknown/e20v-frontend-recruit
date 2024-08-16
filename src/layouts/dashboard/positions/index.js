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
import { Fade, FormControl, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, Grid, Fab } from "@mui/material";

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
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'

import useAuth from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "api/axios";
import team3 from "assets/images/team-3.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import MDInput from "components/MDInput";
import { SimpleEditor } from "./rte";
import Questions from "./questions";
import AddIcon from '@mui/icons-material/Add';
import ConfirmDialog from "../dynamic/confirm-dialog";

import { useSnackbar } from "notistack";
import { dataServicePrivate } from "global/function";

import moment from "moment";


function Positions() {

    const style = {
        position:'absolute',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '75%',
        minHeight:'90%',
        maxHeight: '100%',
        display:'block',
    };

    const [result, setResult] = useState({});
    const [change, setChange] = useState({})
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    // const [content, setContent] = useState();
    const [value, setValue] = useState({});
    const [questions, setQuestions] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // region confirm modal

    const [confirmModal, setConfirmModal] = useState(false)
    const [idDelete, setIdDelete] = useState(0)
    const [action, setAction] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleCloseModal = () => {
        setConfirmModal(false)
    }

    const handleDataModal = (e) => {
        console.log('debug confirm dialog data:', e)
        setConfirmModal(false)

        const confirmDelete = async () => {
            await axiosPrivate.post('hr/careers/delete', {id: idDelete}).then((result) => {
                console.log("debug position delete", result.data);
                init()
            }, (e) => {
                console.log("debug position delete error", e);
            })
        }

        if ( e ) {
            confirmDelete()
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
        init();
    },[]);

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    const init = async () => {
        try {
            const response = await axiosPrivate.post('hr/careers/all', {
                relations: ['questions', 'has'],
                order: {
                    target: 'created_at',
                    value: 'desc',
                }
            });
            console.log("debug positions", response.data);
            var result = response.data['careers']
            setResult(result)

            setRows([])
            Object.keys(result).map((key) => {
                setRows(prev => [
                    ...prev,
                    {
                        title: (
                            <MDTypography display="block" variant="button" fontWeight="medium">
                                {result[key].title}
                            </MDTypography>
                        ),
                        created: (
                            <MDTypography variant="caption" color="text" fontWeight="medium">
                                {formatDateTime(result[key].created_at)}
                            </MDTypography>
                        ),
                        status: (
                            <MDBox ml={-1}>
                                <MDBadge badgeContent={result[key].status} color={result[key].status == 'active' ? 'success' : 'white'} variant="gradient" size="sm" />
                            </MDBox>
                        ),
                        actions: (
                            <MDBox>
                                <Grid container spacing={.5}>
                                    {
                                        Object.keys(actions).map((_key) => {
                                            return (
                                                <Grid item key={actions[_key].key}>
                                                    <MDButton onClick={() => actionHandle({items: result[key], key: actions[_key].key})} color={actions[_key].color}>{actions[_key].name}</MDButton>
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
        } catch (err) {
            console.log("debug positions error", err);
        }
    }

    useEffect(() => {
        console.log('debug set change useEffect:', questions)
    },[questions])

    const changeHandle = (e) => {
        console.log('debug set change:', e)

        setQuestions(e)
    }

    const columns = [
        { Header: "title", accessor: "title", width: "45%", align: "left" },
        { Header: "created", accessor: "created", align: "center" },
        { Header: "status", accessor: "status", align: "center" },
        { Header: "actions", accessor: "actions", align: "center" },
    ]

    const actions = [
        { name: 'View', type: 'button', key: 'view', color: 'secondary' },
        { name: 'Edit', type: 'button', key: 'edit', color: 'warning' },
        { name: 'Delete', type: 'button', key: 'delete', color: 'error' },
    ]

    const url = {
        fetch: 'hr/careers/fetch',
        define: 'hr/careers/define',
    };

    const actionHandle = (data) => {
        console.log('debug position actionhandle data:', data)
        console.log('debug position actionhandle result:', result)
        setAction(data.key)

        if (data.key == 'create') {
            setValue({})
            setQuestions({ action: data.key });
        } else {
            var item = data.items
            setValue({
                title: item.title,
                type: item.type,
                benifits: item.benifits,
                experience: item.experience,
                salary: item.salary,
                descriptions: item.descriptions,
                action: data.key,
            })
            setQuestions(item);
        }
        
        if (data.key == 'edit') {
            setValue(prev => ({
                ...prev,
                id: item.id
            }))
        }
        if (data.key == 'delete') {
            setIdDelete(item.id)
            setConfirmModal(true)
        } else {
            handleOpen();
        }

    }

    const valueHandle = (key, e) => {
        setValue(prev => ({
            ...prev,
            [key]: e
        }))
        // console.log("debug positions value:", value);
    }

    const submitHandle = async () => {
        console.log("debug positions submit:", value);
        dataServicePrivate('POST', url.define, value).then((result) => {
            console.log("debug positions submit:", result);
            result = result.data
            snackBar('Position Successfully '.concat(value.action == 'create' ? 'Created' : 'Edited'), 'success')
            handleClose()
        }).catch((err) => {
            console.log("debug positions submit error:", err);
            snackBar('Error', 'error')

        })
    }

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
                                Recruit
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
            onClick={() => actionHandle({key: 'create'})}
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
                <AddIcon fontSize="medium" />
            </Fab>
            <Footer />
            { confirmModal && <ConfirmDialog closeModal={handleCloseModal} title='Confirm Delete' content='Are you sure to Delete this Position?' data={handleDataModal} /> }
            <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
            >
                <Fade in={open}>
                    <MDBox sx={style}>
                        <Card
                            sx={{
                                position: "relative",
                                px: '3rem',
                                maxHeight: '50rem',
                                overflow: 'auto',
                            }}
                        >
                            <MDTypography variant="h2" fontWeight="bold" pt="1rem" textAlign="center">
                                Form Application
                            </MDTypography>
                            <MDBox mt={5} mb={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <MDInput InputProps={{ readOnly: action == 'view' }}  onChange={(e) => valueHandle('title', e.target.value)} value={value?.title} label='Title' type='text' fullWidth />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDInput InputProps={{ readOnly: action == 'view' }} onChange={(e) => valueHandle('type', e.target.value)} value={value?.type} label='Job Type' type='text' fullWidth />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDInput InputProps={{ readOnly: action == 'view' }} onChange={(e) => valueHandle('benifits', e.target.value)} value={value?.benifits} label='Full-time Hours' type='text' fullWidth />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDInput InputProps={{ readOnly: action == 'view' }} onChange={(e) => valueHandle('experience', e.target.value)} value={value?.experience} label='Experience' type='text' fullWidth />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MDInput InputProps={{ readOnly: action == 'view' }} onChange={(e) => valueHandle('salary', e.target.value)} value={value?.salary} label='Salary' type='text' fullWidth />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <SimpleEditor readOnly={action == 'view'} onChange={(e) => valueHandle('descriptions', e)} content={value?.descriptions} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Questions data={{ questions: questions, action: action }} />
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                        {
                            action != 'view' && (
                                <Fab 
                                variant="extended"
                                onClick={submitHandle}
                                sx = {{
                                    display: "flex",
                                    bgcolor:"white.main",
                                    boxShadow: "1",
                                    position: "fixed",
                                    right: "2rem",
                                    top: "2rem",
                                    px: 3,
                                    zIndex: 99,
                                }}
                                color="dark"
                                >
                                    <MDTypography fontWeight="bold" sx={{ textTransform: 'uppercase' }}>Submit</MDTypography>
                                </Fab>
                            )
                        }
                    </MDBox>
                </Fade>
            </Modal>
        </DashboardLayout>
    );
}

export default Positions;