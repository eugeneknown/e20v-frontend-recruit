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


function Platform() {

    const [data, setData] = useState({});
    const [content, setContent] = useState();
    const [question, setQuestion] = useState({})
    const [platform, setplatform] = useState({})
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
            await axiosPrivate.post('hr/careers/platform/delete', {id: idDelete}).then((result) => {
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
            await axiosPrivate.post('hr/careers/platform/all', {}).then((result) => {
                console.log("debug platform", result.data);
                var result = result.data['career_platforms']
                // setData(result)

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
                                        border: `4px solid ${result[key].color}`,
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        color: result[key].color,
                                        textAlign: "center",
                                    }}
                                >
                                    {result[key].color}
                                </MDTypography>
                            ),                            
                            created: (
                                <MDTypography variant="caption" color="text" fontWeight="medium">
                                    {formatDateTime(result[key].created_at, 'MMM DD, YYYY HH:mm:ss')}
                                </MDTypography>
                            ),
                            status: (
                                <MDBadge
                                badgeContent={result[key].status}
                                color={['active', 'activate', 'activated'].includes(result[key].status.toLowerCase()) ? 'success' : 'dark'}
                                variant="gradient"
                                size="sm"
                                />
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
            console.log("debug platform error", err);
            console.error('Response Data:', err.response?.data);

        }
    }

    const columns = [
        { Header: "title", accessor: "title", width: "45%", align: "left" },
        { Header: "color", accessor: "color", align: "center" },
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
            setSwipeIndex(1);
            setQuestion({
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
            setQuestion({
                id: params['data'].id,
                title: params['data'].title,
                type: params['data'].type,
                value: params['data'].value,
                color: params['data'].color
                    ? params['data'].color.charAt(0).toUpperCase() + params['data'].color.slice(1)
                    : 'N/A',
                status: params['data'].status,
                created_at: formatDateTime(params['data'].created_at, 'MMM DD, YYYY HH:mm:ss'),
            });
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
        if (!question.title || !question.status) {
            snackBar('Please provide all required fields', 'error');
            return;
        }
      
        submitDataService(question)
            .then((result) => {
                console.log('debug platform result:', result);
                const careersPlatform = result.data['career_platforms'];
                let submitAction = action === 'create' ? 'Created' :
                                   action === 'edit' ? 'Edited' : 'Deleted';
                snackBar(`platform Successfully ${submitAction}`, 'success');
                init();
                handleClose();
            })
            .catch((err) => {
                console.error('debug error submit platform:', err.response?.data || err.message);
                const errorMessage = err.response?.data?.error || 'platform Submit Failed';
                snackBar(errorMessage, 'error');
            });
    };
    
    
    

    const submitDataService = async (data) => {
        try {
            const response = await axiosPrivate.post('hr/careers/platform/define', data);
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
                                Platform
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
            { confirmModal && <ConfirmDialog closeModal={handleCloseModal} title='Confirm Delete' content='Are you sure to Delete this Tag?' data={handleDataModal} /> }
            <MDBox>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle textAlign="center" textTransform="capitalize">
    {action === "view" ? "View Tag Details" : `${action} Tag`}
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
              {question?.title || "N/A"}
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
              Color:
            </MDTypography>
            <MDBox
              display="flex"
              alignItems="center"
              sx={{ gap: "8px" }}
            >
              <MDBox
                sx={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: question?.color || "#FFFFFF",
                  border: "1px solid #ddd",
                  borderRadius: "50%",
                }}
              />
              <MDTypography variant="body2" fontWeight="medium">
                {question?.color || "N/A"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
              Status:
            </MDTypography>
            <MDBadge
              badgeContent={question?.status || "N/A"}
              color={question?.status === "active" ? "success" : "dark"}
              variant="gradient"
              size="sm"
            />
          </Grid>
          <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
              Created At:
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {formatDateTime(question?.created_at, "MMM DD, YYYY HH:mm:ss") || "N/A"}
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <MDTypography variant="subtitle2" color="textSecondary">
              Updated At:
            </MDTypography>
            <MDTypography variant="body2" fontWeight="medium">
              {formatDateTime(question?.updated_at, "MMM DD, YYYY HH:mm:ss") || "N/A"}
            </MDTypography>
          </Grid>
        </Grid>
      </MDBox>
    ) : (
      <MDBox>
        <MDBox m={2}>
        <MDInput
            value={question?.title || ''}
            onChange={(e) => setQuestion({ ...question, title: e.target.value })}
            label="Title"
            fullWidth
            sx={{ mb: '1rem' }}
        />
    {question?.type !== 'input' && question?.type !== 'label' && question?.value && (
        <MDBox>
            <MDTypography variant="caption" fontWeight="medium" sx={{ mb: '1rem' }}>
                Options:
            </MDTypography>
            {question?.value.split(', ').map((item, key) => (
                <Chip
                    key={key}
                    label={item}
                    variant="outlined"
                    sx={{ m: '5px' }}
                    onDelete={() => {
                        const updatedValues = question?.value
                            .split(', ')
                            .filter((opt) => opt !== item)
                            .join(', ');
                        setQuestion({ ...question, value: updatedValues });
                    }}
                />
            ))}
        </MDBox>
    )}
    <MDInput
        type="color"
        value={question?.color || '#000000'}
        onChange={(e) => setQuestion({ ...question, color: e.target.value })}
        label="Color"
        fullWidth
        sx={{ mb: '1rem' }}
    />
    <MDInput
        value={question?.status || ''}
        onChange={(e) => setQuestion({ ...question, status: e.target.value })}
        label="Status"
        fullWidth
        sx={{ mb: '1rem' }}
    />
    <MDInput
        disabled
        value={question?.created_at || ''}
        label="Created At"
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
      <MDButton onClick={handleQuestionSubmit} variant="gradient" color="info">
        Submit
      </MDButton>
    )}
  </DialogActions>
</Dialog>

            </MDBox>
        </DashboardLayout>
    );
}

export default Platform;