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
import { Fade, OutlinedInput, IconButton, Typography, FormControl, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, FormLabel, 
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Fab, CardMedia, CardContent, Chip, Popover, 
    Switch} from "@mui/material";

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
import { useMaterialUIController, setDialog } from "context";
import { dataServicePrivate } from "global/function";
import BadgePopper from "../dynamic/badge-popper";


function Tags() {
    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
    const [data, setData] = useState({});
    const [content, setContent] = useState();
    const [tags, setTags] = useState({})
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

    const handleDialogClose = () => {
        setDialog(dispatch, { ...dialog, open: false });
      };
    
       const status = [
        {
            'id': 1,
            'title': 'active',
            'color': 'success',
        },
        {
            'id': 2,
            'title': 'close',
            'color': 'error',
        },
        {
            'id': 3,
            'title': 'paused',
            'color': 'warning',
        },
    ]
      const deleteHandle = (id) => {
        setDialog(dispatch, {
            open: true,
            title: (
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
                        onClick={handleDialogClose} 
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
            ),
            content: (
                <MDBox p={2}>
                    <Typography variant="body1" color="textSecondary">
                        Are you sure you want to delete this item? This action cannot be undone.
                    </Typography>
                </MDBox>
            ),
            action: (
                <MDBox p={2} display="flex" justifyContent="flex-end" gap={2}>
                    <MDButton
                        onClick={handleDialogClose}
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
                        onClick={() => handleDataModal(id)}
                    >
                        <Icon sx={{ fontSize: 20 }}>delete</Icon>
                        Confirm
                    </MDButton>
                </MDBox>
            ),
        });
    };
    
    const handleDataModal = async (id) => {
        try {
            if (!id) return; // Ensure an ID is provided
    
            await axiosPrivate.post('hr/careers/tags/delete', { id });
            snackBar('Tags Successfully Deleted', 'success');
            setDialog(dispatch, { ...dialog, open: false }); // Close the dialog
            init(); // Refresh the table data
        } catch (err) {
            console.error("Error deleting tags:", err.response?.data || err.message);
            snackBar('Error deleting tags', 'error');
        }
    };
    
    

    // endregion confirm modal

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        init()
    
    },[]);

    const statusColor = (status, list) => {
        for ( var i=0; i<Object.keys(list).length; i++ ) {
            if (status == list[i].title) return list[i].color
        }

        return 'light_grey'
    }

    const init = async () => {
        try {
            await axiosPrivate.post('hr/careers/tags/all', {}).then((result) => {
                console.log("debug tags", result.data);
                var result = result.data['career_tags']
                setData(result)

                setRows([])
                Object.keys(result).map((item, key) => {
                    setRows(prev => [
                        ...prev,
                        {
                            title: (<MDTypography display="block" variant="button" fontWeight="medium">{result[key].title}</MDTypography>),
                            color: (
                                <MDTypography
                                    textTransform="capitalize"
                                    display="inline-block"
                                    variant="caption"
                                    fontWeight="medium"
                                    sx={{
                                        border: `4px solid ${result[key].color || "black"}`,
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        color: result[key].color || "black",
                                        textAlign: "center",
                                    }}
                                >
                                    {result[key].color || "Black"}
                                </MDTypography>
                            ),                                                       
                            created: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {formatDateTime(result[key].created_at, 'MMM DD, YYYY HH:mm:ss')}
                                </MDTypography>
                            ),
                            posted: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {result[key].posted_at ? formatDateTime(result[key].posted_at, 'MMM DD, YYYY HH:mm:ss') : 'No Data'}
                                </MDTypography>
                            ),
                            closed: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {result[key].closed_at ? formatDateTime(result[key].closed_at, 'MMM DD, YYYY HH:mm:ss') : 'No Data'}
                                </MDTypography>
                            ),
                            status: (
                                // <MDBadge
                                // badgeContent={result[key].status}
                                // color={['active', 'activate', 'activated'].includes(result[key].status.toLowerCase()) ? 'success' : 'dark'}
                                // variant="gradient"
                                // size="sm"
                                // data={(e) => handleBadgePopperData(e, result[key])}
                                // />
                                <MDBox ml={-1}>
                                <BadgePopper
                                    badgeContent={result[key].status} 
                                    color={statusColor(result[key].status, status)} 
                                    variant="gradient" 
                                    content={status}
                                    data={(e) => handleBadgePopperData(e, result[key])}
                                />
                                 </MDBox>
                            ),
                            actions: (
                                <MDBox>
                                    <Grid container spacing={0.5}>
                                        {Object.keys(actions).map((_key) => (
                                            <Grid item key={actions[_key].key}>
                                                <MDButton
                                                    onClick={() => {
                                                        if (actions[_key].key === 'delete') {
                                                            deleteHandle(result[key].id);
                                                        } else {
                                                            handleAction({ key: actions[_key].key, data: result[key] });
                                                        }
                                                    }}
                                                    color={actions[_key].color}
                                                >
                                                    {actions[_key].name}
                                                </MDButton>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </MDBox>
                            ),   
                        }
                    ])
                }) 
            });
        } catch (err) {
            console.log("debug tags error", err);
            console.error('Response Data:', err.response?.data);

        }
    }
     const handleBadgePopperData = (data, career) => {
            console.log('debug handle badge popper data:', data, career);
            career['status'] = data['title']
            if ( data['title'] == 'active' ) {
                career['posted_at'] = moment()
            }
            if ( data['title'] == 'close' ) {
                career['closed_at'] = moment()
            }
            dataServicePrivate('POST', 'hr/careers/tags/define', career).then((result) => {
                console.log('debug submit career status result', result);
                init()
            }).catch((err) => {
                console.log('debug submit career status error result', err);
    
            })
        }
        
    //Default color when there is no selection in create tags
    useEffect(() => {
        if (!tags.color) {
          setTags({ ...tags, color: '#2196F3' });
        }
      }, [tags]);

    const columns = [
        { Header: "tags title", accessor: "title", align: "left" },
        { Header: "date created", accessor: "created", align: "center" },
        { Header: "date posted", accessor: "posted", align: "center" },
        { Header: "date closed", accessor: "closed", align: "center" },
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
        setTags(prev => ({ ...prev, 'value': addOption.join(', ') }))
    },[addOption]);

    const handleLabelData = (data) => {
        setTags(prev => ({ ...prev, 'value': data }))

    }

    const handleAction = (params) => {
        console.log('debug action handle:', params, confirmModal)

        setAction(params['key'])
        if (params['key'] == 'create') {
            setSwipeIndex(0)
            setTags({})
        }
        if (params['key'] == 'view') {
            setSwipeIndex(1);
            setTags({
                id: params['data'].id,
                title: params['data'].title,
                type: params['data'].type,
                value: params['data'].value,
                color: params['data'].color
                    ? params['data'].color.charAt(0).toUpperCase() + params['data'].color.slice(1)
                    : 'N/A',
                status: params['data'].status,
                created_at: formatDateTime(params['data'].created_at, 'MMM DD, YYYY HH:mm:ss'),
                updated_at: params['data'].updated_at
                    ? formatDateTime(params['data'].updated_at, 'MMM DD, YYYY HH:mm:ss')
                    : 'Tag is not edited',
            });
        }        
        if (params['key'] == 'edit') {
            setSwipeIndex(1);
            setTags({
                id: params['data'].id,
                title: params['data'].title,
                type: params['data'].type,
                value: params['data'].value,
                color: params['data'].color 
                    ? params['data'].color.charAt(0).toUpperCase() + params['data'].color.slice(1)
                    : 'N/A',
                status: params['data'].status,
            });
        }             
        if (params['key'] == 'delete') {
            setIdDelete(params['data'].id)
            handleDataModal(true);
        } else {
            handleOpen()
        }
       
    }

    const handleTagsSubmit = async () => {
        // Validate tags and title
        if (!tags || !tags.title) {
            snackBar("Please provide all required fields", "error");
            return;
        }
    
        // Validate data availability
        if (!data || !Array.isArray(data)) {
            snackBar("Data is not available. Please try again later.", "error");
            console.error("Data is not available or not an array:", data);
            return;
        }
    
        // Check for duplicate title
        const existingTagsIndex = data.findIndex((item) => item.title === tags.title);
        console.log("Existing Tags Index:", existingTagsIndex);
    
        if (action === "edit") {
            // Allow editing the current tags without triggering duplicate check
            const currentTagsIndex = data.findIndex((item) => item.id === tags.id);
    
            if (existingTagsIndex > -1 && existingTagsIndex !== currentTagsIndex) {
                snackBar("A tags with this title already exists", "error");
                return;
            }
        } else {
            // For "create" action, ensure no duplicate titles
            if (existingTagsIndex > -1) {
                snackBar("A tags with this title already exists", "error");
                return;
            }
        }
        try {
            const response = await submitDataService(tags); // Pass the `tags` object here
            const submitAction = action === "create" ? "Created" : "Edited";
            snackBar(`Tags Successfully ${submitAction}`, "success");
            init(); // Refresh tags list
            handleClose(); // Close the dialog
        } catch (err) {
            console.error("Error submitting tags:", err.response?.data || err.message);
    
            // Use error message from the backend if available, otherwise fallback
            const errorMessage = err.response?.data?.message || err.message || "Tags Submit Failed";
            snackBar(errorMessage, "error");
        }
    };
    
    
    const submitDataService = async (data) => {
        try {
            const response = await axiosPrivate.post('hr/careers/tags/define', data);
            return response;
        } catch (err) {
            console.error('Submit error:', err.response?.data || err.message);
            throw err;
        }
    };
        
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
                                Tags
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
            
            <MDBox>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle textAlign="center" textTransform="capitalize">
  {action === "view" ? "View Tags" : `${action === 'create' ? 'Create Tags' : 'Edit Tags'}`}
    </DialogTitle>
    <DialogContent>
    {action === "view" ? (
        <MDBox my={2}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
                Title:
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
                {tags?.title || "N/A"}
            </MDTypography>
            </Grid>
            <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
                Color:
            </MDTypography>
            <MDBox display="flex" alignItems="center" sx={{ gap: "8px" }}>
                <MDBox
                sx={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: tags?.color || "#FFFFFF",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                }}
                />
                <MDTypography variant="body2" fontWeight="medium">
                {tags?.color || "N/A"}
                </MDTypography>
            </MDBox>
            </Grid>
            <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
                Status:
            </MDTypography>
            <MDBadge
                badgeContent={tags?.status || "N/A"}
                color={statusColor(tags?.status, status)}
                variant="gradient"
                size="lg"
            />
            </Grid>
        </Grid>
        </MDBox>
    ) : (
        <MDBox>
        <MDBox m={2}>
            {/* Title Input */}
            <MDInput
            value={tags?.title || ''}
            onChange={(e) => setTags({ ...tags, title: e.target.value })}
            label="Title"
            fullWidth
            sx={{ mb: '1rem' }}
            />

            {/* Options Section */}
            {tags?.type !== 'input' && tags?.type !== 'label' && tags?.value && (
            <MDBox>
                <MDTypography variant="caption" fontWeight="medium" sx={{ mb: '1rem' }}>
                Options:
                </MDTypography>
                {tags?.value.split(', ').map((item, key) => (
                <Chip
                    key={key}
                    label={item}
                    variant="outlined"
                    sx={{ m: '5px' }}
                    onDelete={() => {
                    const updatedValues = tags?.value
                        .split(', ')
                        .filter((opt) => opt !== item)
                        .join(', ');
                    setTags({ ...tags, value: updatedValues });
                    }}
                />
                ))}
            </MDBox>
            )}

            {/* Color Picker */}
            <MDInput
                type="color"
                value={tags?.color || '#FFFFFF'}  // Ensure the value is properly set, default to white if not set
                onChange={(e) => {
                    const selectedColor = e.target.value;
                    setTags({ ...tags, color: selectedColor });  // Ensure the tags color gets updated
                }}
                label="Color"
                fullWidth
                sx={{ mb: '1rem' }}
            />
        </MDBox>
        </MDBox>
    )}
</DialogContent>

  <DialogActions>
    <MDButton onClick={handleClose}>Close</MDButton>
    {action !== "view" && (
      <MDButton onClick={handleTagsSubmit} variant="gradient" color="info">
        Submit
      </MDButton>
    )}
  </DialogActions>
</Dialog>

            </MDBox>
        </DashboardLayout>
    );
}

export default Tags;