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
import elemData from "./elemData";
import seniorData from "./seniorData";
import collegeData from "./collegeData";


function Educational(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [education, setEducation] = useState(null)
    const [elem, setElem] = useState()
    const [high, setHigh] = useState()
    const [senior, setSenior] = useState()
    const [college, setCollege] = useState()
    const [master, setMaster] = useState()
    const err = useRef()
    var entity_id = auth['id']

    localStorage.removeItem('education')

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
            // setEducation(result)
            setAttainment(result)

        }).catch((err) => {
            console.log('debug education error result', err);

        })
    }

    const setAttainment = (data) => {
        Object.keys(data).map((item, index) => {
            if ( data[item]['education'] == 'Elementary' ) setElem(data[item]) 
            if ( data[item]['education'] == 'Secondary (High School)' ) setHigh(data[item]) 
            if ( data[item]['education'] == 'Senior High' ) setSenior(data[item]) 
            if ( data[item]['education'] == 'College' ) setCollege(data[item]) 
            if ( data[item]['education'] == "Graduate School (Master's or Doctorate)" ) setMaster(data[item]) 
        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/education/delete', {id}).then((result) => {
            console.log('debug education education delete result', result);
            setElem()
            setHigh()
            setSenior()
            setCollege()
            setMaster()
            init()
        }).catch((err) => {
            console.log('debug education education delete error result', err);

        })
    }

    const handleSubmit = (e) => {
        prevPage()
    }

    const EducationAttainment = ({attainment, data, required=false}) => (
        <MDBox my={1}>
            <MDTypography variant='h5'>{attainment}</MDTypography>
            {data && <Card variant="outlined" position='relative' sx={{ my: 2 }}>
                <MDBox display='flex' position='absolute' right={0} p={1}>
                    <IconButton onClick={() => toPage('/careers/personalinfo/educational/form', { id: data.id })}><Icon>edit</Icon></IconButton>
                    <IconButton onClick={() => handleDelete(data.id)}><Icon>delete</Icon></IconButton>
                </MDBox>
                <CardContent>
                    {/* <MDTypography variant='h5'>{data.education}</MDTypography> */}
                    {data?.course && <MDTypography variant='body2'>Course: {data.course}</MDTypography>}
                    <MDTypography variant='body2'>School: {data.school}</MDTypography>
                    {data.start_date ? 
                    <MDTypography variant='body2'>
                        Year: {formatDateTime(data.start_date, 'YYYY')} to {data?.present ? `Present` : formatDateTime(data.end_date, 'YYYY')}
                    </MDTypography> : 
                    <MDTypography variant='body2'>
                        Year: {formatDateTime(data.end_date, 'YYYY')}
                    </MDTypography>}
                </CardContent>
            </Card>}
            {!(data) && <MDButton
                variant='outlined' 
                color='secondary' 
                fullWidth
                startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                onClick={() => toPage('/careers/personalinfo/educational/form', { education: attainment })}
            >
                <MDTypography variant='body2' color='secondary'>{`${data ? 'Edit' : 'Create'} ${attainment} Background`}</MDTypography>
            </MDButton>}
            {!(data) && required && <MDTypography color='error' variant='button'>{attainment} is required</MDTypography>}
        </MDBox>
    )

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Educational Background</MDTypography>
                        <Divider />
                        <EducationAttainment attainment='Elementary' data={elem} required />
                        <EducationAttainment attainment='Secondary (High School)' data={high} required />
                        <EducationAttainment attainment='Senior High' data={senior} required />
                        <EducationAttainment attainment='College' data={college} required />
                        <EducationAttainment attainment="Graduate School (Master's or Doctorate)" data={master} />
                        <Divider />
                        <form onSubmit={handleSubmit}>
                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Save</MDButton>
                        </form>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default Educational;