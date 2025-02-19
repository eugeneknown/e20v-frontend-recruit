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
    Switch,
    Popper,
    Grow,
    ClickAwayListener,
    MenuList,
    Paper} from "@mui/material";

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
import { useSnackbar } from "notistack";
import { SimpleEditor } from "../positions/rte";
import { useMaterialUIController, setDialog } from "context";
import { dataServicePrivate } from "global/function";
import BadgePopper from "../dynamic/badge-popper";
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";


function Designation() {
    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
    const [data, setData] = useState({});
    const [tags, setTags] = useState({})
    const [rows, setRows] = useState([]);
    const [designation, setDesignation] = useState()

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
        getDesignation()
    },[]);

    const getDesignation = () => {
        dataServicePrivate('POST', 'hr/careers/designation/all', {}).then((result) => {
            console.log('debug designation result', result);
            result = result.data['career_designation']

            setDesignation(result)
        }).catch((err) => {
            console.log('debug designation error result', err);

        })
    }

    const statusColor = (status, list) => {
        for ( var i=0; i<Object.keys(list).length; i++ ) {
            if (status == list[i].title) return list[i].color
        }

        return 'light_grey'
    }

    const init = () => {
        dataServicePrivate('POST', 'hr/careers/entity/all', {
            filter: [
                {
                    operator: '<>',
                    target: 'hired_at',
                    value: false,
                },
            ],
            relations: ['designation', 'entity', 'platforms'],
        }).then((result) => {
            console.log("debug designation", result);
            var result = result.data['entity_career']
            setData(result)

            var rows = []
            setRows([])
            Object.keys(result).map((item, key) => {
                rows.push({
                    id: result[key].id,
                    name: (<MDTypography display="block" variant="button" fontWeight="medium">{result[key]['entity'].full_name}</MDTypography>),
                    platforms: (
                        <MDBadge 
                            badgeContent={result[key]?.platforms ? result[key].platforms['title'] : 'unassigned'} 
                            color={result[key]?.platforms ? result[key].platforms['color'] : '#D3D3D3'} 
                            variant='customGradient'
                        />
                    ),
                    jo: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {result[key].jo_at ? formatDateTime(result[key].hired_at, 'MMM DD, YYYY HH:mm:ss') : 'No Data'}
                        </MDTypography>
                    ),
                    hired: (
                        <MDTypography variant="caption" color="text" fontWeight="medium">
                            {result[key].hired_at ? formatDateTime(result[key].hired_at, 'MMM DD, YYYY HH:mm:ss') : 'No Data'}
                        </MDTypography>
                    ),
                    designation: result[key].designation,
                })
            }) 

            if (rows) setRows(rows)
        }).catch((err) => {
            console.log("debug tags error", err);
            console.error('Response Data:', err.response?.data);
        });
    }

    const columns = [
        { Header: "employee name", accessor: "name", align: "left", sort: true, },
        { Header: "source", accessor: "platforms", align: "center", sort: true, },
        { Header: "jo date", accessor: "jo", align: "center", sort: true, },
        { Header: "date hired", accessor: "hired", align: "center", sort: true, },
        {
            Header: "designation", 
            align: "center",
            accessor: (row) => (row?.designation ? row.designation['title'] : 'unassigned' ), 
            id: "platform", 
            align: "center", 
            sort: true, 
            Cell: ({row}) => PopperFn(row),
        },
    ]

    const PopperFn = (row) => (
        <PopupState variant="popper">
            {(popupState) => (
                <MDBox>
                    <MDButton {...bindToggle(popupState)}>
                        <MDBadge 
                            badgeContent={row.original?.designation ? row.original.designation['title'] : 'unassigned'} 
                            color={row.original?.designation ? row.original.designation['color'] : '#D3D3D3'} 
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
                                            Object.keys(designation).map((item, key) => (
                                                <MenuItem 
                                                    key={key} 
                                                    onClick={() => handlePopperUpdate(row.original.id, designation[item].id)}
                                                    sx={{ 
                                                        bgcolor: 'transparent', 
                                                        justifyContent: 'space-between' 
                                                    }}
                                                    
                                                >
                                                    <MDBadge
                                                        badgeContent={designation[item].title}
                                                        color={designation[item].color}
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
    
    const handlePopperUpdate = (id, updated_id) => {
        dataServicePrivate('POST', 'hr/careers/entity/define', {id, designation_id: updated_id}).then((result) => {
            console.log("debug update career designation", result);
            init()
        }, (err) => {
            console.log("debug update career designation error", err);
        });
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
                                Hired
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
        </DashboardLayout>
    );
}

export default Designation;