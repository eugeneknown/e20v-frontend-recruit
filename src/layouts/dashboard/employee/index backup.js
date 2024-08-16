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
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Popover } from "@mui/material";

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


function Employee() {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "60%",
        bgcolor: 'white.main',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'grey.700',
        boxShadow: 24,
        p: 4,
    };

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

    const handlePopOpen = (e, data) => {
        setRecruitID(data)
        setPopOpen(e.currentTarget)
    }
    const handlePopClose = () => setPopOpen(null);


    const handleCloseModal = () => {
        setFilterModal(false)
    }

    const profileHandle = (data) => {
        console.log('debug employee profileHandle:', data);
        setContent((
            <MDBox>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
                    </Grid>
                    <Grid item>
                        <MDBox height="100%" mt={0.5} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                {data.full_name}
                            </MDTypography>
                            {/* <MDTypography variant="button" color="text" fontWeight="regular">
                                CEO / Co-Founder
                            </MDTypography> */}
                        </MDBox>
                    </Grid>
                </Grid>
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} sx={{ display: "flex" }}>
                            <Card sx={{ height: "100%", boxShadow: "none" }}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                                    <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                                        Profile Information
                                    </MDTypography>
                                    <MDTypography variant="body2" color="secondary">
                                        <Tooltip title='profile edit' placement="top">
                                            <Icon>edit</Icon>
                                        </Tooltip>
                                    </MDTypography>
                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox mb={2} lineHeight={1}>
                                    <MDTypography variant="button" color="text" fontWeight="light">
                                        Eiusmod excepteur ea Lorem est dolor occaecat ea officia esse minim ullamco.
                                    </MDTypography>
                                    </MDBox>
                                    <MDBox opacity={0.3}>
                                    <Divider />
                                    </MDBox>
                                    <MDBox>
                                        <MDBox display="flex" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                Email: &nbsp;
                                            </MDTypography>
                                            <MDTypography variant="button" fontWeight="regular" color="text">
                                                &nbsp;{data.email}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox display="flex" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                Contact Number: &nbsp;
                                            </MDTypography>
                                            <MDTypography variant="button" fontWeight="regular" color="text">
                                                &nbsp;{data.contact_number}
                                            </MDTypography>
                                        </MDBox>
                                        <MDBox display="flex" py={1} pr={2}>
                                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                                Address: &nbsp;
                                            </MDTypography>
                                            <MDTypography variant="button" fontWeight="regular" color="text">
                                                &nbsp;{data.address}
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        <Divider orientation="vertical" sx={{ mx: 0 }} />
                        </Grid>
                        <Grid item xs={6}>
                            <Card sx={{ height: "100%", boxShadow: "none" }}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
                                    <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                                        Additional Information
                                    </MDTypography>
                                </MDBox>
                                <MDBox p={2}>
                                    <MDBox mb={2} lineHeight={1}>
                                        <MDTypography variant="button" color="text" fontWeight="light">
                                            Resume Image
                                        </MDTypography>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
        ));
        handleOpen();
    }

    const formHandle = async (entity_id, careers_id, readOnly=true) => {
        console.log('debug employee formHandle:', entity_id +' '+ careers_id);

        await axiosPrivate.post('hr/careers/answers/all', {
            entity_id,
            careers_id
        }).then((result) => {
            result = result.data['career_answers'];
            console.log('debug employee formHandle response', result)
    
            setContent((
                <MDBox>
                    <MDTypography variant="h2" fontWeight="Bold" textAlign="center">
                        Form Application
                    </MDTypography>
                    <Grid my={3} container spacing={2}>
                        {
                            Object.keys(result).map((key, item) => {
                                const question = result[key].question_data;
    
                                switch (question?.type) {
                                    case 'text':
                                        return (
                                            <Grid key={key} item xs={6}>
                                                <FormControl fullWidth>
                                                    {
                                                        readOnly ? (
                                                            <MDInput 
                                                                type="text" 
                                                                label={question?.title}
                                                                fullWidth
                                                                autoComplete="off"
                                                                readOnly
                                                                value={result[key].value !== undefined ? result[key].value : ''}
                                                            />
                                                        ) : (
                                                            <MDInput 
                                                                type="text" 
                                                                label={question?.title}
                                                                fullWidth
                                                                autoComplete="off"
                                                            />
                                                        )
                                                    }
                                                </FormControl>
                                            </Grid>
                                        );
    
                                    case 'select':
                                        return (
                                            <Grid key={key} item xs={6}>
                                                {
                                                    readOnly ? (
                                                        <FormControl fullWidth>
                                                            <InputLabel>{question.title}</InputLabel>
                                                            <Select
                                                            label={question.title}
                                                            sx={{ height: "44px" }}
                                                            value={result[key].value !== undefined ? result[key].value : ''}
                                                            readOnly
                                                            >
                                                                {
                                                                    result[key].value?.split(', ').map((_item, _key) => (
                                                                        <MenuItem key={_key} value={_item}>{_item}</MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <FormControl fullWidth>
                                                            <InputLabel>{question.title}</InputLabel>
                                                            <Select
                                                            label={question.title}
                                                            sx={{ height: "44px" }}
                                                            value={result[key].value !== undefined ? result[key].value : ''}
                                                            >
                                                                {
                                                                    result[key].value?.split(', ').map((_item, _key) => (
                                                                        <MenuItem key={_key} value={_item}>{_item}</MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    )
                                                }
                                            </Grid>
                                        );
    
                                    case 'check':
                                        return (
                                            <Grid key={key} item xs={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>{question.title}</FormLabel>
                                                        <FormGroup>
                                                            {
                                                                question.value?.split(', ').map((_item, _key) => {
                                                                    if (readOnly) {
                                                                        if ( result[key].value.split(', ').includes(_item) ) {
                                                                            return (
                                                                                <FormControlLabel key={_key} control={
                                                                                    <Checkbox disabled checked />
                                                                                } label={_item} />
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <FormControlLabel key={_key} control={
                                                                                    <Checkbox disabled />
                                                                                } label={_item} />
                                                                            );
                                                                        }
                                                                    } else {
                                                                        return (
                                                                            <FormControlLabel key={_key} control={
                                                                                <Checkbox />
                                                                            } label={_item} />
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </FormGroup>
                                                </FormControl>
                                            </Grid>
                                        )
    
                                    case 'radio':
                                        return (
                                            <Grid key={key} item xs={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>{question.title}</FormLabel>
                                                    {
                                                        readOnly ? (
                                                            <RadioGroup
                                                            readOnly
                                                            value={result[key].value !== undefined ? result[key].value : ''}
                                                            >
                                                                {
                                                                    question.value?.split(', ').map((_item, _key) => (
                                                                        <FormControlLabel key={_key} value={_item} control={<Radio disabled />} label={_item} />
                                                                    ))
                                                                }
                                                            </RadioGroup>
                                                        ) : (
                                                            <RadioGroup
                                                            value={result[key].value !== undefined ? result[key].value : ''}
                                                            >
                                                                {
                                                                    question.value?.split(', ').map((_item, _key) => (
                                                                        <FormControlLabel key={_key} value={_item} control={<Radio />} label={_item} />
                                                                    ))
                                                                }
                                                            </RadioGroup>
                                                        )
                                                    }
                                                </FormControl>
                                            </Grid>
                                        )
                                }
                            })
                        }
                    </Grid>
                </MDBox>
            ));

            handleOpen();
        }, (err) => {
            console.log('debug employee formHandle error response', err)
            // setNotif({
            //     color: 'error',
            //     icon: "warning",
            //     title: err.name,
            //     content: err.message,
            // })
            enqueueSnackbar(err.message, {
                variant: 'error',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
        });
    }

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
            getRecruit()
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
                    applied: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {formatDateTime(recruit[key].created_at, 'YYYY-MM-DD')}
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

    },[recruit])

    const columns = [
        { Header: "name", accessor: "name", width: "45%", align: "left" },
        { Header: "career", accessor: "career", align: "left" },
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
            <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
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
                        {content}
                    </MDBox>
                </Fade>
            </Modal>
        </DashboardLayout>
    );
}

export default Employee;