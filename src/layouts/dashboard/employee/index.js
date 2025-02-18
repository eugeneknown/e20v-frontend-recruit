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
import { Fade, FormControl, Typography, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, FormLabel, 
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Popover, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, CardContent, CardHeader, Chip, 
    Link,
    Popper,
    Paper,
    Grow,
    MenuList,
    ClickAwayListener} from "@mui/material";

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
import { useEffect, useMemo, useState } from "react";
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

import { useSnackbar } from "notistack";
import ImgsViewer from 'react-images-viewer';
import { dataServicePrivate } from "global/function";
import { ChromePicker } from 'react-color'
import ConfirmDialog from "../dynamic/confirm-dialog";
import ImageView from "./image-viewer";
import AudioPlayer from 'react-h5-audio-player';
import GenerateExel from "./generate-exel";
import { DateRangePicker } from "react-date-range";
import { useMaterialUIController, setDialog } from "context";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { isSameDay, startOfDay } from "date-fns";
import entityData from "./entityData";
import { DateRangeFilterColumnFN, DateRangeFilterFN } from "./filter-fn";
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";


function Employee() {
    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
    const [recruit, setRecruit] = useState({});
    const [tags, setTags] = useState()
    const [platforms, setPlatforms] = useState()
    const [selectedTag, setSelectedTag] = useState(0)
    const [recruitID, setRecruitID] = useState(0)
    const [experience, setExperience] = useState()

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

    // add data
    const [openAddData, setOpenAddData] = useState(false)
    const [addData, setAddData] = useState()
    const [addDataColor, setAddDataColor] = useState()

    // region confirm modal
    const [confirmModal, setConfirmModal] = useState(false)
    const [idDelete, setIdDelete] = useState()
    const [confirmContent, setConfirmContent] = useState()
    const [contentURL, setContentURL] = useState()

    const handlePopOpen = (e, data) => {
        setRecruitID(data)
        setPopOpen(e.currentTarget)
    }
    const handlePopClose = () => setPopOpen(null);

    const handleCloseModal = () => {
        setFilterModal(false)
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

    const formHandle = (entity_id, careers_id, readOnly=true) => {
        console.log('debug employee formHandle:', entity_id +' '+ careers_id);

        // entity_career_id for filtering
        dataServicePrivate('POST', 'hr/careers/answers/all', {
            filter: [
                {
                    operator: '=',
                    target: 'entity_id',
                    value: entity_id,
                },
                {
                    operator: '=',
                    target: 'careers_id',
                    value: careers_id,
                },
            ],
            'relations': ['question', 'files']
        }).then((result) => {
            console.log('debug employee formHandle response', result)
            result = result.data['career_answers']

            dataServicePrivate('POST', 'entity/entities/all', {
                filter: [{
                    operator: '=',
                    target: 'id',
                    value: entity_id,
                }],
            }).then((_result) => {
                console.log('debug entity result', _result);
                _result = _result.data['entity'][0]

            setContent((
                <Grid container>
                    <Grid item xs={6} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            entityData.map((key) => renderInfo(key.label, _result[key.id]))
                        }
                        <GenerateExel data={{entity_id, careers_id}} />
                    </Grid>
                    <Grid item xs={6} px={2} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            Object.keys(result).map((item, key) => {
                                if (result[item]['question']['type'] == 'input') {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
                                                <Divider />
                                                <MDTypography textTransform="capitalize" variant="caption">{result[item]['value']}</MDTypography>
                                            </CardContent>
                                        </Card>
                                    )
                                } else {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
                                                <Divider />
                                                {
                                                    result[item]['files'] != null ? 
                                                        (
                                                            <MDBox
                                                            display="flex"
                                                            justifyContent='center'>
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[1] == 'pdf' &&
                                                                    <Link href={result[item]['files']['files_url']} target="_blank">
                                                                        Open File
                                                                    </Link>
                                                                }
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[0] == 'image' &&
                                                                    <ImageView data={result[item]['files']} />
                                                                }
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[0] == 'audio' &&
                                                                    <MDBox width='100%'>
                                                                        <AudioPlayer
                                                                            src={[result[item]['files']['files_url']]} 
                                                                        />
                                                                        <Link href={result[item]['files']['files_url']} target="_blank">
                                                                            <MDButton sx={{ width: '100%', borderRadius: 0, marginTop: '15px', }}>Download</MDButton>
                                                                        </Link>
                                                                    </MDBox>
                                                                }
                                                            </MDBox>
                                                        ) 
                                                    :
                                                        result[item]['question']['value'].split(', ').map((_key) => {
                                                            if (result[item]['value'].split(', ').includes(_key)) {
                                                                return (<Chip key={_key} label={_key} sx={{ m: "5px" }} />)
                                                            } 
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
            }).catch((_err) => {
                console.log('debug entity error result', _err);

            })
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

    const renderInfo = (title, value) => (
        <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {title}: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{moment(value).isValid() && typeof value != 'number' && value != '0' ? formatDateTime(value, 'MM-DD-YYYY') : value}
            </MDTypography>
        </MDBox>
    )

    const fetchUrl = (id) => dataServicePrivate('POST', 'files/files/url', {id}).then((result) => {console.log('files', result);})

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
        getInit()
        getTags()
        getPlatforms()

    },[]);

    // revice generate excel
    const getEntityExperience = (id) => {
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [
                {
                    operator: '=',
                    target: 'entity_id',
                    value: id,
                },
            ],
            relations: ['details']
        }).then((result) => {
            console.log('debug entity experience result:', result);
            return result.data['experience']
            
        }).catch((err) => {
            console.log('debug entity experience error result:', err);
            
        })
    }

    const getInit = () => {
        getRecruit({
            relations: ['careers', 'platforms', 'tags', { entity: { relations: ['details'] } }],
            order: {
                'target': 'created_at',
                'value': 'desc',
            },
        })
    }

    const getPlatforms = () => {
        dataServicePrivate('POST', 'hr/careers/platform/all', {}).then((result) => {
            console.log('debug platform result:', result);
            result = result.data['career_platforms']
            setPlatforms(result)
        }).catch((err) => {
            console.log('debug platform error result:', err);
            
        })
    }

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
            result = result.data['career_tags']
            var tags = [{
                id: null,
                title: 'Unnasigned',
                color: '#D3D3D3',
            }]
            for (let i=0; i<Object.keys(result).length; i++) {
                tags[i+1] = {
                    id: result[i].id,
                    title: result[i].title,
                    color: result[i].color,
                }
            }
            console.log("debug career tags result", tags);
            setTags(tags)

        }, (err) => {
            console.log("debug career tags error", err);
        });
    }

    const handleTagUpdate = (id, tags_id) => {
        dataServicePrivate('POST', 'hr/careers/entity/tag', { id, tags_id }).then((result) => {
            console.log("debug update career tag", result);
            getInit();
        }, (err) => {
            console.log("debug update career tag error", err);
        });
    }

    const handlePlatformsUpdate = (id, platforms_id) => {
        dataServicePrivate('POST', 'hr/careers/entity/define', { id, platforms_id }).then((result) => {
            console.log("debug update career platform", result);
            getInit();
        }, (err) => {
            console.log("debug update career platform error", err);
        });
    }

    const handleDeleteData = (data) => {
        if (data) {
            dataServicePrivate('POST', contentURL, {id: idDelete}).then((result) => {
                console.log("debug delete", result.data);
                snackBar('Recruit successfully deleted','success')
                getPlatforms()
                getTags()
                getInit()
                setConfirmModal(false)
            }, (err) => {
                console.log("debug delete error", err);
                snackBar('Recruit unsuccessfully deleted','error')
            });
        }
    }

    function formatPhoneNumber(data) {
        var cleaned = ('' + data).replace(/\\D/g, '');
        var match = cleaned.match(/(\d{4})(\d{3})(\d{4})/);
        return match ? match[1] + '-' + match[2] + '-' + match[3] : 'Invalid Number'
    }

    useEffect(() => {
        var rows = []
        Object.keys(recruit).map((key) => {
            rows.push(
                {
                    full_name: recruit[key]['entity'].full_name,
                    email: recruit[key]['entity'].email,
                    career: recruit[key]['careers'].title,
                    number: recruit[key]['entity'].contact_number,
                    alternative: recruit[key]['entity'].alternative_number,
                    platforms: recruit[key]['platforms'],
                    applied: formatDateTime(recruit[key].created_at, 'MMM DD, YYYY HH:mm:ss'),
                    entity_careers_id: recruit[key].id,
                    tag: recruit[key]['tags'],
                    actions: (
                        <MDBox>
                            <Grid container spacing={.5}>
                                <Grid item>
                                    <MDButton onClick={() => formHandle(recruit[key]['entity'].id, recruit[key]['careers'].id)} color='secondary'>View</MDButton>
                                </Grid> 
                                {/* <Grid item>
                                    <MDButton color='primary'>Download</MDButton>
                                </Grid>  */}
                                <Grid item>
                                    <MDButton onClick={() => handleDeleteRecruit(recruit[key].id)} color='error'>Delete</MDButton>
                                </Grid> 
                            </Grid>
                        </MDBox>
                    )
                }
            )
        })

        if (rows) setRows(rows)

    },[recruit, tags, platforms])

    const PlatformFilterColumnFN = ({ column: { filterValue, setFilter, id } }) => (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel><MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography></InputLabel>
            <Select
                label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
                value={filterValue ?? ''}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ padding: '0.625rem!important' }}
            >
                <MenuItem value="">No Filter</MenuItem>
                {platforms && platforms.map((item, index) => (
                    <MenuItem key={index} value={item.title}>{item.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    const TagsFilterColumnFN = ({ column: { filterValue, setFilter, id } }) => (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel><MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography></InputLabel>
            <Select
                label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
                value={filterValue ?? ''}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ padding: '0.625rem!important' }}
            >
                <MenuItem value="">No Filter</MenuItem>
                {tags && tags.map((item, index) => (
                    <MenuItem key={index} value={item.title}>{item.title}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    const columns = [
        { Header: "name", accessor: (row) => `${row.full_name} ${row.email}`, id: 'name', Cell: ({row}) => (
            <Employee image={team3} name={row.original.full_name} email={row.original.email} />
        ), align: "left", sort: true },
        { Header: "contact number", accessor: "number", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {formatPhoneNumber(value)}
            </MDTypography>
        ), align: "left", sort: true },
        { Header: "alternative number", accessor: "alternative", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {formatPhoneNumber(value)}
            </MDTypography>
        ), align: "left", sort: true },
        { Header: "position applied", accessor: "career", Cell: ({value}) => (<Career title={value} />), align: "left", sort: true},
        { Header: "source", accessor: (row) => (row?.platforms ? row.platforms['title'] : 'unassigned' ), 
            id: "platform", 
            align: "center", 
            sort: true, 
            Cell: ({row}) => PlatformPopperFn(row), 
            Filter: PlatformFilterColumnFN},
        { Header: "applied date", accessor: "applied", align: "center", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {value}
            </MDTypography>
        ), Filter: DateRangeFilterColumnFN, filter: DateRangeFilterFN, sort: true},
        { Header: 'status', accessor: (row) => (row?.tag ? row.tag['title'] : 'unassigned' ), 
            id: 'status', 
            align: "center", 
            sort: true, 
            Cell: ({row}) => TagPopperFn(row), 
            Filter: TagsFilterColumnFN},
        { Header: "actions", accessor: "actions", align: "center", disableFilters: true, disableGlobalFilter: true },
    ]

    const PlatformPopperFn = (row) => (
        <PopupState variant="popper">
            {(popupState) => (
                <MDBox>
                    <MDButton {...bindToggle(popupState)}>
                        <MDBadge 
                            badgeContent={row.original?.platforms ? row.original.platforms['title'] : 'unassigned'} 
                            color={row.original?.platforms ? row.original.platforms['color'] : '#D3D3D3'} 
                            variant='customGradient'
                            sx={{ cursor: 'pointer' }}
                        />
                    </MDButton>
                    <Popper
                        placement="left"
                        transition
                        {...bindPopper(popupState)}
                    >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement="center right"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={popupState.close}>
                                    <MenuList
                                        autoFocusItem={popupState.isOpen}
                                    >
                                        {
                                            platforms && Object.keys(platforms).map((item, key) => (
                                                <MenuItem 
                                                    key={key} 
                                                    onClick={() => handlePlatformsUpdate(row.original.entity_careers_id, platforms[item].id)}
                                                    sx={{ 
                                                        bgcolor: 'transparent', 
                                                        justifyContent: 'space-between' 
                                                    }}
                                                    
                                                >
                                                    <MDBadge
                                                        badgeContent={platforms[item].title}
                                                        color={platforms[item].color}
                                                        variant='customGradient'
                                                    />
                                                </MenuItem>
                                            ))
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                    </Popper>
                </MDBox>
            )}
        </PopupState>
    )

    const TagPopperFn = (row) => (
        <PopupState variant="popper">
            {(popupState) => (
                <MDBox>
                    <MDButton {...bindToggle(popupState)}>
                        <MDBadge 
                            badgeContent={row.original?.tag ? row.original.tag['title'] : 'unassigned'} 
                            color={row.original?.tag ? row.original.tag['color'] : '#D3D3D3'} 
                            variant='customGradient'
                            sx={{ cursor: 'pointer' }}
                        />
                    </MDButton>
                    <Popper
                        placement="left"
                        transition
                        {...bindPopper(popupState)}
                    >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement="center right"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={popupState.close}>
                                    <MenuList
                                        autoFocusItem={popupState.isOpen}
                                    >
                                        {
                                            tags && Object.keys(tags).map((item, key) => (
                                                <MenuItem 
                                                    key={key} 
                                                    onClick={() => handleTagUpdate(row.original.entity_careers_id, tags[item].id)}
                                                    sx={{ 
                                                        bgcolor: 'transparent', 
                                                        justifyContent: 'space-between' 
                                                    }}
                                                    
                                                >
                                                    <MDBadge
                                                        badgeContent={tags[item].title}
                                                        color={tags[item].color}
                                                        variant='customGradient'
                                                    />
                                                </MenuItem>
                                            ))
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                    </Popper>
                </MDBox>
            )}
        </PopupState>
    )

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

    const handleDeleteRecruit = (id) => {
        setIdDelete(id)
        setContentURL('hr/careers/entity/delete')
        setConfirmContent('Are you sure to Delete this Candidate?')
        setConfirmModal(true)
    }

    const handleDataModal = (e) => {
        console.log('debug handle data modal', e, selectedTag)

        if (e) {
            if (selectedTag) {
                getRecruit({
                    'filter': [
                        {
                            target: 'tags',
                            operator: '=',
                            value: selectedTag != 'null' ? selectedTag : null
                        }
                    ]
                })
            } else {
                getInit()
            }
            
        }

        handleCloseModal()
    }

    const handleDebugPicker = (e) => {
        console.log('debug color picker:', e);
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
                                showTotalEntries
                                entriesPerPage
                                noEndBorder
                                canSearch
                            />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />

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

            {/* { confirmModal && <ConfirmDialog closeModal={() => setConfirmModal(false)} title='Confirm Delete' content={confirmContent} data={handleDeleteData} /> } */}
            {confirmModal && (
            <Dialog
                open={confirmModal}
                onClose={() => setConfirmModal(false)} // Close modal on background click or close button
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle textAlign="center" sx={{ m: 0, p: 2 }}>
                    <MDBox
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#2E3B55",
                            padding: "12px 20px",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            position: "relative",
                        }}
                    >
                        <MDTypography
                            variant="h6"
                            color="white"
                            sx={{
                                fontWeight: "600",
                                fontSize: "1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Icon sx={{ color: "#FF9800", fontSize: 30 }}>info</Icon>
                            Confirm Delete
                        </MDTypography>
                        <IconButton
                            onClick={() => setConfirmModal(false)} // Close modal on close button click
                            sx={{
                                position: "absolute",
                                top: "10px",
                                right: "20px",
                                color: "#FFFFFF",
                                "&:hover": {
                                    color: "red",
                                },
                            }}
                        >
                            <Icon sx={{ fontSize: 30, color: "white" }}>close</Icon>
                        </IconButton>
                    </MDBox>
                </DialogTitle>

                <DialogContent>
                    <MDBox p={2}>
                        <Typography variant="body1" color="textSecondary">
                            {confirmContent} This action cannot be undone.
                        </Typography>
                    </MDBox>
                </DialogContent>

                <DialogActions>
                    <MDBox p={2} display="flex" justifyContent="flex-end" gap={2}>
                        <MDButton
                            onClick={() => setConfirmModal(false)}
                            color="secondary"
                            variant="outlined"
                            sx={{
                                padding: "8px 16px",
                                borderColor: "#f44336",
                                color: "#f44336",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#ffcccc",
                                    borderColor: "#f44336",
                                },
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Icon sx={{ fontSize: 20 }}>cancel</Icon>
                            Cancel
                        </MDButton>
                        <MDButton
                            color="primary"
                            variant="contained"
                            sx={{
                                padding: "8px 16px",
                                backgroundColor: "#4caf50",
                                "&:hover": {
                                    backgroundColor: "#388e3c",
                                },
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                            onClick={() => handleDeleteData(idDelete)} // Call handleDeleteData to perform the deletion
                        >
                            <Icon sx={{ fontSize: 20 }}>delete</Icon>
                            Confirm
                        </MDButton>
                    </MDBox>
                </DialogActions>
            </Dialog>
          )}
        </DashboardLayout>
    );
}

export default Employee;