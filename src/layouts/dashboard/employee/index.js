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
import { Fade, FormControl, Typography, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, FormLabel, Menu,
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Popover, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, CardContent, CardHeader, Chip, 
    Link} from "@mui/material";
//Icon
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download'; 
import VisibilityIcon from '@mui/icons-material/Visibility';

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



function Employee() {
    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
    const [recruit, setRecruit] = useState({});
    const [tags, setTags] = useState()
    const [platforms, setPlatforms] = useState()
    const [selectedTag, setSelectedTag] = useState(0)
    const [recruitID, setRecruitID] = useState(0)
    const [experience, setExperience] = useState()

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
    const [anchorEl, setAnchorEl] = useState(null);


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
    // const formHandle = (entity_id, careers_id, readOnly=true) => {
    //     console.log('debug employee formHandle:', entity_id +' '+ careers_id);

    //     // entity_career_id for filtering
    //     dataServicePrivate('POST', 'hr/careers/answers/all', {
    //         filter: [
    //             {
    //                 operator: '=',
    //                 target: 'entity_id',
    //                 value: entity_id,
    //             },
    //             {
    //                 operator: '=',
    //                 target: 'careers_id',
    //                 value: careers_id,
    //             },
    //         ],
    //         'relations': ['question', 'files']
    //     }).then((result) => {
    //         console.log('debug employee formHandle response', result)
    //         result = result.data['career_answers']

    //         dataServicePrivate('POST', 'entity/entities/all', {
    //             filter: [{
    //                 operator: '=',
    //                 target: 'id',
    //                 value: entity_id,
    //             }],
    //         }).then((_result) => {
    //             console.log('debug entity result', _result);
    //             _result = _result.data['entity'][0]

    //         setContent((
    //             <Grid container>
    //                 <Grid item xs={6} style={{maxHeight: '100vh', overflow: 'auto'}}>
    //                     {
    //                         entityData.map((key) => renderInfo(key.label, _result[key.id]))
    //                     }
    //                     <GenerateExel data={{entity_id, careers_id}} />
    //                 </Grid>
    //                 <Grid item xs={6} px={2} style={{maxHeight: '100vh', overflow: 'auto'}}>
    //                     {
    //                         Object.keys(result).map((item, key) => {
    //                             if (result[item]['question']['type'] == 'input') {
    //                                 return (
    //                                     <Card sx={{ my: 2 }} key={key}>
    //                                         <CardContent>
    //                                             <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
    //                                             <Divider />
    //                                             <MDTypography textTransform="capitalize" variant="caption">{result[item]['value']}</MDTypography>
    //                                         </CardContent>
    //                                     </Card>
    //                                 )
    //                             } else {
    //                                 return (
    //                                     <Card sx={{ my: 2 }} key={key}>
    //                                         <CardContent>
    //                                             <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
    //                                             <Divider />
    //                                             {
    //                                                 result[item]['files'] != null ? 
    //                                                     (
    //                                                         <MDBox
    //                                                         display="flex"
    //                                                         justifyContent='center'>
    //                                                             {
    //                                                                 String(result[item]['files']['file_type']).split('/')[1] == 'pdf' &&
    //                                                                 <Link href={result[item]['files']['files_url']} target="_blank">
    //                                                                     Open File
    //                                                                 </Link>
    //                                                             }
    //                                                             {
    //                                                                 String(result[item]['files']['file_type']).split('/')[0] == 'image' &&
    //                                                                 <ImageView data={result[item]['files']} />
    //                                                             }
    //                                                             {
    //                                                                 String(result[item]['files']['file_type']).split('/')[0] == 'audio' &&
    //                                                                 <MDBox width='100%'>
    //                                                                     <AudioPlayer
    //                                                                         src={[result[item]['files']['files_url']]} 
    //                                                                     />
    //                                                                     <Link href={result[item]['files']['files_url']} target="_blank">
    //                                                                         <MDButton sx={{ width: '100%', borderRadius: 0, marginTop: '15px', }}>Download</MDButton>
    //                                                                     </Link>
    //                                                                 </MDBox>
    //                                                             }
    //                                                         </MDBox>
    //                                                     ) 
    //                                                 :
    //                                                     result[item]['question']['value'].split(', ').map((_key) => {
    //                                                         if (result[item]['value'].split(', ').includes(_key)) {
    //                                                             return (<Chip key={_key} label={_key} sx={{ m: "5px" }} />)
    //                                                         } 
    //                                                     }) 
    //                                             }
    //                                         </CardContent>
    //                                     </Card>
    //                                 )
    //                             }
    //                         })
    //                     }
    //                 </Grid>
    //             </Grid>
    //         ))

    //         handleOpen();
    //         }).catch((_err) => {
    //             console.log('debug entity error result', _err);

    //         })
    //     }, (err) => {
    //         console.log('debug employee formHandle error response', err)
    //         enqueueSnackbar(err.message, {
    //             variant: 'error',
    //             preventDuplicate: true,
    //             anchorOrigin: {
    //                 horizontal: 'right',
    //                 vertical: 'top',
    //             }
    //         })

    //     })

    // }

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

    const handleTagsData = async (data) => {
        console.log('debug badge popper tags data:', data)

        if ( data.action == 'select' ) {
            dataServicePrivate('POST', 'hr/careers/entity/tag', { id: data.id, tags_id: data.data_id }).then((result) => {
                console.log("debug update career tag", result.data);
                getInit();
            }, (err) => {
                console.log("debug update career tag error", err);
            });
        }

        if ( data.action == 'add' || data.action == 'edit' ) {
            dataServicePrivate('POST', 'hr/careers/tags/define', data).then((result) => {
                console.log("debug define tag", result.data);
                getTags();
            }, (err) => {
                console.log("debug define tag error", err);
            });
        }

        if ( data.action == 'delete' ) {
            setConfirmModal(true)
            setIdDelete(data.id)
            setContentURL('hr/careers/tags/delete')
            setConfirmContent('Are you sure to Delete this Tag?')
        }

    }

    const handlePlatformData = (data) => {
        console.log('debug handle platform data:', data);

        if ( data.action == 'select' ) {
            dataServicePrivate('POST', 'hr/careers/entity/define', { id: data.id, platforms_id: data.data_id }).then((result) => {
                console.log("debug update career platform", result.data);
                getInit();
            }, (err) => {
                console.log("debug update career platform error", err);
            });
        }

        if ( data.action == 'add' || data.action == 'edit' ) {
            dataServicePrivate('POST', 'hr/careers/platform/define', data).then((result) => {
                console.log("debug define platform", result.data);
                getPlatforms()
            }, (err) => {
                console.log("debug define platform error", err);
            });

        } 

        if (data.action == 'delete') {
            setConfirmModal(true)
            setIdDelete(data.id)
            setContentURL('hr/careers/platform/delete')
            setConfirmContent('Are you sure to Delete this Plaform?')
        }

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
    

    const handleMenuOpen = (event, id) => {
        setAnchorElMap(prev => ({ ...prev, [id]: event.currentTarget }));
    };
    
    const handleMenuClose = (id) => {
        setAnchorElMap(prev => ({ ...prev, [id]: null }));
    };
    
    const handleSelect = (type, entityId, careerId) => {
        if (type === "info") {
            fetchEntityInfo(entityId); // Fetch only entity info
        } else if (type === "answers") {
            fetchCareerAnswers(entityId, careerId); // Fetch only answers
        }
        handleMenuClose();
    };
    const fetchEntityInfo = (entityId) => {
        dataServicePrivate('POST', 'entity/entities/all', {
            filter: [{
                operator: '=',
                target: 'id',
                value: entityId,
            }],
        }).then((_result) => {
            console.log('debug entity result', _result);
            _result = _result.data['entity'][0];
    
            setContent((
                <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle textAlign='center' sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Applicant Information
                    </DialogTitle>
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 8, color: 'grey.500' }}>
                        <Icon>close</Icon>
                    </IconButton>
                    <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto', p: 2, '&::-webkit-scrollbar':{width: '20px',},'&::-webkit-scrollbar-track': {background: '#f1f1f1', borderRadius: '15px',},'&::-webkit-scrollbar-thumb': {
                    background: '#888',  
                    borderRadius: '10px',
                   '&:hover': {
                   background: '#555',  
                    }
                     }}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {entityData.map((key) => (
                                    <Card sx={{ my: 2, p: 2 }} key={key.id}>
                                        <CardContent>
                                            <MDTypography variant='h6' sx={{ fontWeight: 'bold' }}>
                                                {key.label}
                                            </MDTypography>
                                            <MDTypography sx={{ fontSize: '1rem', color: '#222', mt: 2 }}>
                                                {_result[key.id]}
                                            </MDTypography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    {/* <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
                        <GenerateExel data={{ entity_id: entityId }} />
                    </DialogActions> */}
                </Dialog>
            ));
    
            handleOpen();
        }).catch((_err) => {
            console.log('debug entity error result', _err);
        });
    };    
    const fetchCareerAnswers = (entity_id, careers_id) => {    
        dataServicePrivate('POST', 'hr/careers/answers/all', {
            filter: [
                { operator: '=', target: 'entity_id', value: entity_id },
                { operator: '=', target: 'careers_id', value: careers_id },
            ],
            'relations': ['question', 'files']
        }).then((result) => {
            console.log('Career answers response', result);
            result = result.data['career_answers'] ?? [];
    
            setContent((
                <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle textAlign='center' sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                        Applicant Answers
                    </DialogTitle>
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 10, top: 8, color: 'grey.500' }}>
                        <Icon>close</Icon>
                    </IconButton>
                    <DialogContent sx={{ 
                        maxHeight: '70vh', 
                        overflowY: 'auto', 
                        p: 2,
                        '&::-webkit-scrollbar': { width: '20px' },
                        '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '10px' },
                        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '10px', '&:hover': { background: '#555' } }
                    }}>
                        <Grid container spacing={2}>
                            {result.length > 0 ? (
                                result.map((item, key) => (
                                    <Grid item xs={12} key={key}>
                                        <Card sx={{ my: 2, p: 2 }}>
                                            <CardContent>
                                                <MDTypography variant='h6' sx={{ fontWeight: 'bold' }}>
                                                    {item.question?.title ?? "No Question"}
                                                </MDTypography>
    
                                                {/* Text-Based Answer */}
                                                {item.question?.type === 'input' ? (
                                                    <MDTypography sx={{ fontSize: '1rem', color: '#222', mt: 1 }}>
                                                        {item.value || "No Answer"}
                                                    </MDTypography>
                                                ) : (
                                                    // File-Based Answer
                                                    <MDBox display="flex" mt={1}>
                                                        {item.files?.file_type.includes('pdf') && (
                                                            <Link href={item.files?.files_url} target="_blank">
                                                                Open File
                                                            </Link>
                                                        )}
                                                        {item.files?.file_type.includes('image') && (
                                                            <ImageView data={item.files} />
                                                        )}
                                                        {item.files?.file_type.includes('audio') && (
                                                            <MDBox width="100%">
                                                                <AudioPlayer src={[item.files?.files_url]} />
                                                                <Link href={item.files?.files_url} target="_blank">
                                                                    <MDButton sx={{ width: '100%', borderRadius: 0, mt: 2 }}>
                                                                        Download
                                                                    </MDButton>
                                                                </Link>
                                                            </MDBox>
                                                        )}
                                                        {/* Multiple Choice Answer Display */}
                                                        {!item.files && item.question?.value?.split(', ').map((_key) => (
                                                            item.value?.split(', ').includes(_key) && (
                                                                <Chip key={_key} label={_key} sx={{ m: "5px" }} />
                                                            )
                                                        ))}
                                                    </MDBox>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <MDTypography sx={{ fontSize: '1rem', color: 'grey', textAlign: 'center', width: '100%', mt: 2 }}>
                                    No answers available.
                                </MDTypography>
                            )}
                        </Grid>
                    </DialogContent>
                </Dialog>
            ));
    
            handleOpen();
        }).catch((err) => {
            console.log('Error fetching answers', err);
            enqueueSnackbar(err.message, {
                variant: 'error',
                preventDuplicate: true,
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
        });
    };
    
    
    const [anchorElMap, setAnchorElMap] = useState({});

    const rows = useMemo(() => {
        // Log recruit to check its value before proceeding
        console.log("recruit:", recruit);
    
        // Ensure recruit is defined and is an object before proceeding
        if (!recruit || typeof recruit !== "object") {
            console.error("🚨 recruit is invalid:", recruit);
            return []; // Return an empty array to prevent errors
        }
    
        // Process recruit safely
        return Object.keys(recruit).map((key) => {
            const recruitItem = recruit[key];

            // Log recruitItem to inspect its contents
            console.log("recruitItem:", recruitItem);

            return {
                full_name: recruitItem?.entity?.full_name || "N/A",
                email: recruitItem?.entity?.email || "N/A",
                career: recruitItem?.careers?.title || "N/A",
                number: recruitItem?.entity?.contact_number || "N/A",
                alternative: recruitItem?.entity?.alternative_number || "N/A",
                platforms_id: recruitItem?.platforms?.id || "N/A",
                applied: formatDateTime(recruitItem?.created_at, 'MMM DD, YYYY HH:mm:ss') || "N/A",
                entity_careers_id: recruitItem?.id || "N/A",
                tags_id: recruitItem?.tags?.id || "N/A",
                actions: (
                    <MDBox>
                        <Grid container spacing={0.5}>
                            <Grid item>
                                <IconButton onClick={(e) => handleSelect("info", recruitItem?.entity?.id)} color="primary">
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteRecruit(recruitItem?.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton onClick={(e) => handleMenuOpen(e, recruitItem?.id)}>
                                    <MoreVertIcon />
                                </IconButton>

                                <Menu
                                    anchorEl={anchorElMap[recruitItem?.id]}
                                    open={Boolean(anchorElMap[recruitItem?.id])}
                                    onClose={() => handleMenuClose(recruitItem?.id)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    PaperProps={{
                                        style: {
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            marginLeft: '-100px',
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => handleSelect("answers", recruitItem?.entity?.id, recruitItem?.careers?.id)}
                                        style={{ color: '#1976d2' }}
                                    >
                                        <AssignmentIcon style={{ marginRight: '8px' }} /> Answers
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleDownload(recruitItem?.id)}
                                        style={{ color: '#388e3c' }}
                                    >
                                        <DownloadIcon style={{ marginRight: '8px' }} /> Download
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuClose(recruitItem?.id)}
                                        style={{ color: '#d32f2f' }}
                                    >
                                        <CancelIcon style={{ marginRight: '8px' }} /> Close
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </MDBox>
                )
            };
        });
    }, [recruit, anchorElMap]);
    
    

    const DateRangeFilterFN = (rows, id, filterValues) => {
        const sd = filterValues[0] ? moment(filterValues[0]).startOf('day').toDate() : undefined;
        const ed = filterValues[1] ? moment(filterValues[1]).endOf('day').toDate() : undefined;
        if (ed || sd) {
            return rows.filter((r) => {
                const cellDate = moment(r.values[id]).toDate()
                console.log('range filter', sd, ed, cellDate);

                if (ed && sd) {
                    return cellDate >= sd && cellDate <= ed;
                } else if (sd) {
                    return cellDate >= sd;
                } else {
                    return cellDate <= ed;
                }
            });
        } else {
            return rows;
        }
    }

    const DateRangeFilterColumnFN = ({
        column: { filterValue = [], preFilteredRows, setFilter, id }
    }) => {
        const [open, setOpen] = useState(false)
        const [state, setState] = useState([
            {
              startDate: moment().toDate(),
              endDate: moment().toDate(),
              key: 'selection'
            }
        ]);

        // var exMoment = moment().startOf('day').toDate()
        // var exFns = startOfDay(new Date())
        // console.log('date comparison', exMoment, exFns );

        const staticRanges = [
            {
                label: 'Today',
                range: () => ({
                    startDate: moment().startOf('day').toDate(),
                    endDate: moment().endOf('day').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'Yesterday',
                range: () => ({
                    startDate: moment().startOf('day').subtract(1, 'day').toDate(),
                    endDate: moment().endOf('day').subtract(1, 'day').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'This Week',
                range: () => ({
                    startDate: moment().startOf('week').toDate(),
                    endDate: moment().endOf('week').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'Last Week',
                range: () => ({
                    startDate: moment().startOf('week').subtract(1, 'week').toDate(),
                    endDate: moment().endOf('week').subtract(1, 'week').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'This Month',
                range: () => ({
                    startDate: moment().startOf('month').toDate(),
                    endDate: moment().endOf('month').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'Last Month',
                range: () => ({
                    startDate: moment().startOf('month').subtract(1, 'month').toDate(),
                    endDate: moment().endOf('month').subtract(1, 'month').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'This Year',
                range: () => ({
                    startDate: moment().startOf('year').toDate(),
                    endDate: moment().endOf('year').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
            {
                label: 'Last Year',
                range: () => ({
                    startDate: moment().startOf('year').subtract(1, 'year').toDate(),
                    endDate: moment().endOf('year').subtract(1, 'year').toDate(),
                }),
                isSelected(range) {
                    const definedRange = this.range();
                    return (
                        isSameDay(range.startDate, definedRange.startDate) &&
                        isSameDay(range.endDate, definedRange.endDate)
                    );
                },
            },
        ]

        const ApplyFilter = () => {
            const { startDate, endDate } = state[0]
            setFilter((old = []) => [startDate, old[1]]);
            setFilter((old = []) => [old[0], endDate]);
            setOpen(!open)
        }

        const ClearFilter = () => {
            setState([
                {
                  startDate: moment().toDate(),
                  endDate: moment().toDate(),
                  key: 'selection'
                }
            ])
            setFilter([])
        }

        return (
            <MDBox>
                <MDInput
                    label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
                    fullWidth
                    size='small'
                    value={filterValue.length ? `${formatDateTime(filterValue[0], 'MM-DD-YYYY')} to ${formatDateTime(filterValue[1], 'MM-DD-YYYY')}` : ''}
                    onClick={()=>setOpen(!open)}
                    />
                <Dialog
                    open={open}
                    onClose={()=>setOpen(!open)}
                    maxWidth='unset'
                >
                    <DialogContent>
                        <DateRangePicker
                            onChange={item => setState([item.selection])}
                            showSelectionPreview={true}
                            editableDateInputs={true}
                            ranges={state}
                            direction="horizontal"
                            preventSnapRefocus={true}
                            calendarFocus="backwards"
                            staticRanges={staticRanges}
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-between' }}>
                        <MDButton color='error' onClick={()=>setOpen(!open)} autoFocus>
                            Close
                        </MDButton>
                        <MDBox>
                            <MDButton color='warning' onClick={ClearFilter}>
                                Clear
                            </MDButton>
                            <MDButton sx={{ ml: 1 }} color='info' onClick={ApplyFilter}>
                                Apply
                            </MDButton>
                        </MDBox>
                    </DialogActions>
                </Dialog>
            </MDBox>
        )
    }

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
        { 
            Header: "name", 
            accessor: (row) => `${row?.full_name || ''} ${row?.email || ''}`, 
            id: 'name', 
            Cell: ({ row }) => {
                const employee = row?.original || {};
                return (
                    <Employee 
                        image={team3} 
                        name={employee.full_name || 'N/A'} 
                        email={employee.email || 'N/A'} 
                    />
                );
            }, 
            align: "left", 
            sort: true 
        },
        { 
            Header: "contact number", 
            accessor: "number", 
            Cell: ({ value }) => (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {value ? formatPhoneNumber(value) : "N/A"}
                </MDTypography>
            ), 
            align: "left", 
            sort: true 
        },
        { 
            Header: "position applied", 
            accessor: "career", 
            Cell: ({ value }) => (
                <Career title={value || "N/A"} />
            ), 
            align: "left", 
            sort: true 
        },
        { 
            Header: "source", 
            accessor: (row) => (
                platforms && Object.keys(platforms || {}).length > 0
                    ? platforms[Object.keys(platforms).find(key => platforms[key]?.id === row?.platforms_id)]?.title
                    : 'unassigned'
            ), 
            id: "platform", 
            align: "center", 
            sort: true, 
            Cell: ({ row }) => {
                const entityId = row?.original?.entity_careers_id;
                const platformId = row?.original?.platforms_id;
                return (
                    <BadgePopper
                        id={entityId || 0}
                        badgeId={platformId || 0}
                        variant="customGradient"
                        content={platforms || {}}
                        data={handlePlatformData}
                        editable={true}
                        deletable={true}
                    />
                );
            }, 
            Filter: PlatformFilterColumnFN
        },
        { 
            Header: "applied date", 
            accessor: "applied", 
            align: "center", 
            Cell: ({ value }) => (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {value || "N/A"}
                </MDTypography>
            ), 
            Filter: DateRangeFilterColumnFN, 
            filter: DateRangeFilterFN, 
            sort: true 
        },
        { 
            Header: "status", 
            accessor: (row) => (
                tags && Object.keys(tags || {}).length > 0
                    ? tags[Object.keys(tags).find(key => tags[key]?.id === row?.tags_id)]?.title
                    : 'unassigned'
            ), 
            id: 'status', 
            align: "center", 
            sort: true, 
            Cell: ({ row }) => {
                const entityId = row?.original?.entity_careers_id;
                const tagId = row?.original?.tags_id;
                return (
                    <BadgePopper
                        id={entityId || 0}
                        badgeId={tagId || 0}
                        variant="customGradient"
                        content={tags || {}}
                        data={handleTagsData}
                        editable={true}
                        deletable={true}
                    />
                );
            }, 
            Filter: TagsFilterColumnFN
        },
        { 
            Header: "actions", 
            accessor: "actions", 
            align: "center", 
            disableFilters: true, 
            disableGlobalFilter: true 
        }
    ];
    

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

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle textAlign='center' sx={{ m: 0, p: 2 }}>
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