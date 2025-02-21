import {Card, CardContent, Typography, CardHeader, Checkbox, Chip, Container, Dialog, DialogActions, DialogContent, Divider, Icon, IconButton, Link} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";

import CareersStepper from "../careers-stepper";
import MDButton from "components/MDButton";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "examples/Footer";
import { formatDateTime } from "global/function";
import { dataServicePrivate } from "global/function";
import SendIcon from '@mui/icons-material/Send';
import { useMaterialUIController, setDialog } from "context";

function ReferenceInformation(){
    const [controller, dispatch] = useMaterialUIController();
    const { dialog } = controller;
    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [ref, setRef] = useState(null)
    const err = useRef()
    var entity_id = auth['id']

    const [open, setOpen] = useState(false)
    const [content, setContent] = useState()

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        // fetch reference
        dataServicePrivate('POST', 'entity/reference/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug reference result', result);
            result = result.data['entity_reference']
            setRef(result)

        }).catch((err) => {
            console.log('debug reference error result', err);

        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/reference/delete', {id}).then((result) => {
            console.log('debug reference details delete result', result);
            init()
        }).catch((err) => {
            console.log('debug reference details delete error result', err);

        })
    }
    const deleteHandle = (id) => {
        setDialog(dispatch, {
            open: true,
            id: id,
            title: (
                <MDBox
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#2E5B6F",
                        padding: "12px 20px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        position: "relative",
                    }}
                >
                    <Typography
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
                    </Typography>
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
                        onClick={() => setDialog(dispatch, { ...dialog, open: false })}
                        color="secondary"
                        variant="outlined"
                        sx={{
                        padding: "8px 16px",
                        borderColor: "#F44336",
                        color: "#F44336",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#FFC5C5",
                            borderColor: "#F44336",
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
                        backgroundColor: "#4CAF50",
                        "&:hover": {
                            backgroundColor: "#388E3C",
                        },
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        }}
                        autoFocus
                        onClick={() => {
                        handleDelete(id);
                        setDialog(dispatch, { ...dialog, open: false });
                        }}
                    >
                        <Icon sx={{ fontSize: 20 }}>delete</Icon>
                        Confirm
                    </MDButton>
                </MDBox>
            ),
        });
    };

   const handleSubmit = (e) => {
        e.preventDefault();

        if (ref && Object.keys(ref).length >= 2) {
            toPage('/careers/submitted');
        } else {
            if (err.current) {
                err.current.scrollIntoView({
                    behavior: 'smooth', // Changed to smooth for better experience
                    block: 'center',
                    inline: 'center',
                });
            }
        }
    };

    return (
        <MDBox>
            <MDTypography sx={{ mt: 3 }} variant='h3'>CHARACTER REFERENCES</MDTypography>
            <MDTypography variant='button' color='error'>(Please exclude relatives/friends; kindly provide previous employment head, colleague, and HR)</MDTypography>
            <Divider />
            {ref && Object.keys(ref).map((item, index) => (
                <Card position='relative' sx={{ my: 2 }}>
                    <MDBox display='flex' position='absolute' right={0} p={1}>
                        <IconButton onClick={() => toPage('/careers/reference/referenceform', { id: ref[item].id })}><Icon color="primary">edit</Icon></IconButton>
                        <IconButton onClick={() => deleteHandle(ref[item].id)}><Icon color="error">delete</Icon></IconButton>
                    </MDBox>
                    <CardContent>
                        <MDTypography variant='h5'>{ref[item].name}</MDTypography>
                        <MDTypography variant='body2'>{ref[item].company}</MDTypography>
                        <MDTypography variant='body2'>{ref[item].company_email}</MDTypography>
                        <MDTypography variant='body2'>{ref[item].position}</MDTypography>
                        <MDTypography variant='body2'>{ref[item].email}</MDTypography>
                        <MDTypography variant='body2'>{ref[item].contact_number}</MDTypography>
                    </CardContent>
                </Card>
            ))}
            {ref && Object.keys(ref).length < 3 && (
                <MDButton
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={<Icon>add</Icon>}
                    onClick={() => toPage('/careers/reference/referenceform')}
                    sx={{
                        borderColor: "secondary.main",
                        "&:hover": {
                            color: "red", 
                            borderColor: "red",
                            "& .MuiSvgIcon-root": {
                                color: "red", 
                            },
                            "& .MuiTypography-root": {
                                color: "red",
                            },
                        },
                        transition: "all 0.01s ease", 
                    }}
                >
                    <MDTypography variant="body2" color="secondary">
                        Add References
                    </MDTypography>
                </MDButton>
            )}
            <MDTypography my={1} sx={{ display: ref && (Object.keys(ref).length >= 2) ? 'none' : 'block' }} color='error' variant='button'>Add atleast 2 reference</MDTypography>
        </MDBox>
    );
}

export default ReferenceInformation;