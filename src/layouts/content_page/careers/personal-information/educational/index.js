import {Card, CardContent, CardHeader, Checkbox, Chip, Container, Divider, Icon, IconButton, Link} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";

import MDButton from "components/MDButton";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "examples/Footer";
import { formatDateTime } from "global/function";
import { dataServicePrivate } from "global/function";


function Educational(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [education, setEducation] = useState(null)
    const err = useRef()
    var entity_id = auth['id']

    useEffect(() => {
        init()
    }, [])

    const init = () => {
        // fetch reference
        dataServicePrivate('POST', 'entity/education/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug education result', result);
            result = result.data['entity_education']
            setEducation(result)

        }).catch((err) => {
            console.log('debug education error result', err);

        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/education/delete', {id}).then((result) => {
            console.log('debug education education delete result', result);
            init()
        }).catch((err) => {
            console.log('debug education education delete error result', err);

        })
    }

    const handleSubmit = (e) => {
        prevPage()
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Education Attainment</MDTypography>
                        <Divider />
                        {education && Object.keys(education).map((item, index) => (
                            <Card position='relative' sx={{ my: 2 }}>
                                <MDBox display='flex' position='absolute' right={0} p={1}>
                                    <IconButton onClick={() => toPage('/careers/personalinfo/educational/form', { id: education[item].id })}><Icon>edit</Icon></IconButton>
                                    <IconButton onClick={() => handleDelete(education[item].id)}><Icon>delete</Icon></IconButton>
                                </MDBox>
                                <CardContent>
                                    <MDTypography variant='h5'>{education[item].education}</MDTypography>
                                    <MDTypography variant='body2'>{education[item].course}</MDTypography>
                                    <MDTypography variant='body2'>{education[item].school}</MDTypography>
                                    <MDTypography variant='body2'>
                                        {formatDateTime(education[item].start_date, 'MMMM YYYY')} to {education[item].present ? `Present` : formatDateTime(education[item].end_date, 'MMMM YYYY')}
                                    </MDTypography>
                                </CardContent>
                            </Card>
                        ))}
                        {education && Object.keys(education).length < 3 && <MDButton
                            variant='outlined' 
                            color='secondary' 
                            fullWidth
                            startIcon={<Icon>add</Icon>}
                            onClick={() => toPage('/careers/personalinfo/educational/form')}
                        >
                            <MDTypography variant='body2' color='secondary'>Add Educational Attainment</MDTypography>
                        </MDButton>}
                        <MDTypography education={err} color='error' variant='button'>Add atleast 4 attainment</MDTypography>
                        <Divider />
                        <form onSubmit={handleSubmit}>
                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Submit Application</MDButton>
                        </form>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default Educational;