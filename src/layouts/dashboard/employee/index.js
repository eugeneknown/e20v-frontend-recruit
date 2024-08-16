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
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Popover, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, CardContent, CardHeader, Chip, 
    Link} from "@mui/material";

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

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { axiosPrivate } from "api/axios";
import team3 from "assets/images/team-3.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import MDInput from "components/MDInput";
import moment from "moment";
import SelectDialog from "./filter-dialog";
import FilterDialog from "./filter-dialog";

import PersonIcon from "@mui/icons-material/Person";
import BadgePopper from "./badge-popper";
import Notifications from "../../notifications/dynamic-notification";

import { useSnackbar } from "notistack";
import ImgsViewer from 'react-images-viewer';


function Employee() {

    const [recruit, setRecruit] = useState({});
    const [tags, setTags] = useState({})
    const [selectedTag, setSelectedTag] = useState(0)
    const [recruitID, setRecruitID] = useState(0)
    const [notif, setNotif] = useState()

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState();
    const [filterModal, setFilterModal] = useState(false)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // pop open
    const [popOpen, setPopOpen] = useState(null);

    const openPop = Boolean(popOpen);
    const popId = openPop ? 'simple-popover' : undefined;

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    // file viewer
    const fileOpenEvent = () => {
        console.log('w3w')
    } 

    const handlePopOpen = (e, data) => {
        setRecruitID(data)
        setPopOpen(e.currentTarget)
    }
    const handlePopClose = () => setPopOpen(null);


    const handleCloseModal = () => {
        setFilterModal(false)
    }

    const formHandle = (entity_id, careers_id, readOnly=true) => {
        console.log('debug employee formHandle:', entity_id +' '+ careers_id);

        dataService('POST', 'hr/careers/answers/all', {entity_id, careers_id}).then((result) => {
            console.log('debug employee formHandle response', result)
            result = result.data['career_answers']

            var orderlist = ['full_name', 'first_name', 'middle_name', 'last_name', 'email', 'contact_number']
            var blacklist = ['id', 'created_at', 'deleted_at', 'email_verified', 'email_verified_at', 'image', 'status', 'updated_at', 'users']

            const entity = recruit[Object.keys(recruit).find(key => recruit[key].entity == entity_id)].entity_data

            setContent((
                <Grid container>
                    <Grid item xs={6} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            orderlist.map(key => renderEntityInfo(key, entity[key]))
                        }
                        {
                            Object.keys(entity).map((key, item) => {
                                if (!blacklist.includes(key) && !orderlist.includes(key)) {
                                    return renderEntityInfo(key, entity[key])
                                }
                            })
                        }
                    </Grid>
                    <Grid item xs={6} px={2} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            Object.keys(result).map((item, key) => {
                                if (result[item]['question_data']['type'] == 'input') {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography>{result[item]['question_data']['title']}</MDTypography>
                                                <Divider />
                                                <MDTypography textTransform="capitalize" variant="caption">{result[item]['value']}</MDTypography>
                                            </CardContent>
                                        </Card>
                                    )
                                } else {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography>{result[item]['question_data']['title']}</MDTypography>
                                                <Divider />
                                                {
                                                    result[item]['files'] != null ? 
                                                        (
                                                            <MDBox
                                                            display="flex"
                                                            justifyContent='center'>
                                                                <Link href={result[item]['files_url']} target="_blank">
                                                                    Open File
                                                                    {/* <MDBox
                                                                        component="img"
                                                                        src={result[item]['files_url']}
                                                                        sx={{ width: 140, cursor: 'pointer' }}
                                                                    /> */}
                                                                </Link>
                                                            </MDBox>
                                                        ) 
                                                    :
                                                        result[item]['question_data']['value'].split(', ').map((_key) => {
                                                            if (result[item]['value'].split(', ').includes(_key)) {
                                                                return (<Chip key={_key} label={_key} sx={{ m: "5px" }} />)
                                                            } 
                                                            // else {
                                                            //     return (<Chip key={_key} label={_key} variant="outlined" sx={{ m: "5px" }} />)
                                                            // }
                                                        }) 
                                                }
                                            </CardContent>
                                        </Card>
                                    )
                                }
                            })
                        }
                    </Grid>
                </Grid>
            ))

            handleOpen();
        }, (err) => {
            console.log('debug employee formHandle error response', err)
            enqueueSnackbar(err.message, {
                variant: 'error',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })

        })

    }

    const renderEntityInfo = (key, value) => (
        <MDBox key={key} display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {key.split('_').join(' ')}: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{value}
            </MDTypography>
        </MDBox>
    )

    const dataService = async (method, url, data) =>{
        switch (method) {
            case 'GET':
                return await axiosPrivate.get(url, data)

            case 'POST':
                return await axiosPrivate.post(url, data)
        }
    }

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        const getInit = () => {
            getRecruit({
                'order': {
                    'target': 'created_at',
                    'value': 'desc',
                }
            })
            getTags()
        }

        getInit();
    },[]);

    const getRecruit = async (data = {}) => {
        await axiosPrivate.post('hr/careers/entity/all', data).then((result) => {
            console.log("debug employee", result.data);
            setRecruit(result.data['entity_career'])
        }, (err) => {
            console.log("debug employee error", err);
        });
    }

    const getTags = async (data = {}) => {
        await axiosPrivate.post('hr/careers/tags/all', data).then((result) => {
            console.log("debug career tags", result.data);
            setTags(result.data['career_tags'])
        }, (err) => {
            console.log("debug career tags error", err);
        });
    }

    const handleBadgePopperData = async (id, tags_id) => {
        console.log('debug badge popper data:', id, tags_id)

        await axiosPrivate.post('hr/careers/entity/define', { id, tags_id }).then((result) => {
            console.log("debug update career tag", result.data);
            getRecruit(selectedTag != 0 ? {
                'filter': [
                    {
                        target: 'tags',
                        operator: '=',
                        value: selectedTag != 'null' ? selectedTag : null
                    }
                ]
            } : {})
        }, (err) => {
            console.log("debug update career tag error", err);
        });
    }

    useEffect(() => {
        var rows = []
        Object.keys(recruit).map((key) => {
            rows.push(
                {
                    name: <Employee image={team3} name={recruit[key]['entity_data'].full_name} email={recruit[key]['entity_data'].email} />,
                    career: <Career title={recruit[key]['careers_data'].title} />,
                    platform: <Career title={recruit[key]['platforms_data'].title} />,
                    applied: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {formatDateTime(recruit[key].created_at)}
                        </MDTypography>
                    ),
                    status: (
                        <MDBox ml={-1}>
                            <BadgePopper
                                id={recruit[key].id}
                                badgeContent={recruit[key].tags != null ? recruit[key]['tags_data'].title : 'unassigned'} 
                                color={recruit[key].tags != null ? recruit[key]['tags_data'].color : 'light_grey'} 
                                variant="gradient" 
                                content={tags}
                                data={handleBadgePopperData}
                            />
                        </MDBox>
                    ),
                    // profile: (
                    // <MDTypography onClick={() => profileHandle(recruit[key]['entity_data'])} component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    //     View
                    // </MDTypography>
                    // ),
                    form: (
                    <MDTypography onClick={() => formHandle(recruit[key].entity, recruit[key].careers)} component="a" href="#" variant="caption" color="text" fontWeight="medium">
                        View
                    </MDTypography>
                    ),
                }
            )
        })

        if (rows) setRows(rows)

    },[recruit, tags])

    const columns = [
        { Header: "name", accessor: "name", width: "45%", align: "left" },
        { Header: "career", accessor: "career", align: "left" },
        { Header: "platform", accessor: "platform", align: "left" },
        { Header: "applied", accessor: "applied", align: "center" },
        { Header: (<MDBox onClick={() => setFilterModal(true)} component="a" href="#">Tags</MDBox>), accessor: "status", align: "center" },
        // { Header: "profile", accessor: "profile", align: "center" },
        { Header: "form", accessor: "form", align: "center" },
    ]

    const Employee = ({ image, name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                {name}
                </MDTypography>
                <MDTypography variant="caption">{email}</MDTypography>
            </MDBox>
        </MDBox>
    );

    const Career = ({ title }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                {title}
            </MDTypography>
        </MDBox>
    );

    const handleDataModal = (e) => {
        console.log('debug handle data modal', e, selectedTag)

        if (e) {
            getRecruit(selectedTag != 0 ? {
                'filter': [
                    {
                        target: 'tags',
                        operator: '=',
                        value: selectedTag != 'null' ? selectedTag : null
                    }
                ]
            } : {})
        }

        handleCloseModal()
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
            <Footer />
            { filterModal && <FilterDialog closeModal={handleCloseModal} title='Select Tag' content={(
                <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <FormControl sx={{ mt: 1 }}>
                        <InputLabel>Tags</InputLabel>
                        <Select
                            label='Tags'
                            value={selectedTag != null ? selectedTag : 'Unassigned'}
                            defaultValue='0'
                            autoWidth
                            sx={{ height: "44px", textTransform: 'capitalize'  }}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            <MenuItem value='0'>No Filter</MenuItem>
                            <MenuItem value='null'>Unassigned</MenuItem>
                            {
                                tags && Object.keys(tags).map((item, key) => (
                                    <MenuItem key={key} value={tags[item]['id']} sx={{ textTransform: 'capitalize' }}>{tags[item]['title']}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </MDBox>
            )} data={handleDataModal} /> }

            <Notifications data={notif} />

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle textAlign='center' sx={{ m: 0, p: 2 }}>
                    Application
                </DialogTitle>
                <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'grey.500',
                }}
                >
                    <Icon>close</Icon>
                </IconButton>
                <DialogContent>
                    {content}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}

export default Employee;