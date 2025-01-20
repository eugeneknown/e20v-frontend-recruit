import {Card, CardContent, CardHeader, Checkbox, Chip, Container, Divider, FormControlLabel, Icon, IconButton, Link, Switch} from "@mui/material";
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
    const [education, setEducation] = useState()
    const [elem, setElem] = useState()
    const [high, setHigh] = useState()
    const [senior, setSenior] = useState()
    const [tech, setTech] = useState()
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
            setEducation(result)
            setAttainment(result)

        }).catch((err) => {
            console.log('debug education error result', err);

        })
    }

    const setAttainment = (data) => {
        Object.keys(data).map((item, index) => {
            if ( data[item]['education'] == 'Elementary' ) setElem(data[item]) 
            if ( data[item]['education'] == 'Secondary (High School)' ) setHigh(data[item]) 
            if ( data[item]['education'] == 'Senior High School' ) setSenior(data[item]) 
            if ( data[item]['education'] == 'Vocational & Technical Education' ) setTech(data[item]) 
            if ( data[item]['education'] == 'College' ) setCollege(data[item]) 
            if ( data[item]['education'] == "Graduate School (Master's or Doctorate)" ) setMaster(data[item]) 
        })
    }

    const handleDelete = (id, level) => {
        // Define the hierarchy of educational levels
        const educationOrder = [
            { level: "Elementary", stateKey: elem },
            { level: "Secondary (High School)", stateKey: high },
            { level: "Senior High School", stateKey: senior },
            { level: "Vocational & Technical Education", stateKey: tech },
            { level: "College", stateKey: college },
            { level: "Graduate School (Master's or Doctorate)", stateKey: master }
        ];

        // Find the current level index
        const deleteIndex = educationOrder.findIndex(item => item.level === level);

        // Check if the level to delete has a dependency on higher levels
        if (deleteIndex !== -1) {
            // Loop through levels after the current one to check if there's data for them
            for (let i = deleteIndex + 1; i < educationOrder.length; i++) {
                if (educationOrder[i].stateKey) {
                    // If a higher level has data, alert the user and stop deletion
                    alert(`You cannot delete ${level} because a higher level exists: ${educationOrder[i].level}`);
                    return;
                }
            }

            // Proceed with deletion if no higher levels have data
            dataServicePrivate('POST', 'entity/education/delete', { id }).then((result) => {
                console.log('debug education delete result', result);

                // Reset the specific state variable based on the education level
                if (level === "Elementary") setElem(null);
                if (level === "Secondary (High School)") setHigh(null);
                if (level === "Senior High School") setSenior(null);
                if (level === "Vocational & Technical Education") setTech(null);
                if (level === "College") setCollege(null);
                if (level === "Graduate School (Master's or Doctorate)") setMaster(null);

                // Reinitialize to fetch the latest data
                init();
            }).catch((err) => {
                console.log('debug education delete error result', err);
            });
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

    // Check if elementary, high school, and college data exist
    if (!elem || !high || (!senior && !tech && !college)) {
        let missingFields = [];
        if (!elem) missingFields.push("Elementary");
        if (!high) missingFields.push("High School");
        if (!college) missingFields.push("College");

        alert(`Please fill up the following required Educational Background: ${missingFields.join(", ")}`);
        return; // Prevent navigation if validation fails
    }
    if (!elem) {
        alert("Please fill up Elementary Education before proceeding.");
        return; // Stop submission
    }

    // Check if high school data exists (requires elementary)
    if (!high) {
        alert("Please fill up Secondary (High School) Education before proceeding.");
        return; // Stop submission
    }

    // Check if college data exists (requires elementary and secondary)
    if ((!senior && !tech && !college)) {
        alert("Please fill up any Educational Background for Senior High, Vocational, and College before proceeding.");
        return; // Stop submission
    }
        prevPage()
    }

    const EducationAttainment = ({ attainment, data, required = false, optional = false, disabled = false, end_date }) => {
        const [option, setOption] = useState(false);
    
        return (
            <MDBox>
                <MDBox my={1}>
                    <MDTypography variant="h5">{attainment}</MDTypography>
                    {!option && data && (
                        <Card variant="outlined" position="relative" sx={{ my: 2 }}>
                            <MDBox display="flex" position="absolute" right={0} p={1}>
                                <IconButton onClick={() => toPage('/careers/personalinfo/educational/form', { id: data.id })}>
                                    <Icon>edit</Icon>
                                </IconButton>
                                <IconButton onClick={() => handleDelete(data.id,attainment)}>
                                    <Icon>delete</Icon>
                                </IconButton>
                            </MDBox>
                            <CardContent>
                                <MDTypography variant="body2">School: {data.school}</MDTypography>
                                {data?.course && <MDTypography variant="body2">Course: {data.course}</MDTypography>}
                                {data.start_date ? 
                                <MDTypography variant='body2'>
                                    Year: {formatDateTime(data.start_date, 'YYYY')} {
                                        data?.present 
                                        ? `to Present` 
                                        : data?.undergrad
                                        ? `Undergraduate`
                                        : `to ${formatDateTime(data.end_date, 'YYYY')}`
                                    }
                                </MDTypography> : 
                                <MDTypography variant='body2'>
                                    Year: {formatDateTime(data.end_date, 'YYYY')}
                                </MDTypography>}
                            </CardContent>
                        </Card>
                    )}
                    {!option && !data && (
                        <MDButton
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            disabled={disabled} // Disable the button if prerequisites are not met
                            startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                            onClick={() => toPage('/careers/personalinfo/educational/form', { education: attainment, end_date })}
                        >
                            <MDTypography variant="body2" color="secondary">
                                {`${data ? 'Edit' : 'Add'} ${attainment} Background`}
                            </MDTypography>
                        </MDButton>
                    )}
                    {!option && !data && required && (
                        <MDTypography color="error" variant="button">
                            {attainment} is required
                        </MDTypography>
                    )}
                </MDBox>
                {optional && (
                    <FormControlLabel
                        label="Not Applicable"
                        sx={{ my: 1 }}
                        control={
                            <Switch
                                name="option"
                                checked={option}
                                onChange={(value) => setOption(value.target.checked)}
                            />
                        }
                    />
                )}
            </MDBox>
        );
    }
    
    const EduFinder = (edu, key) => education[Object.keys(education).findIndex(item => education[item][edu.key] == edu.value)]?.[key] ?? undefined

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
                        <EducationAttainment attainment='Secondary (High School)' data={high} required disabled={!elem} end_date={education && EduFinder({key: 'education', value: 'Elementary'}, 'end_date')} />
                        <EducationAttainment attainment='Senior High School' data={senior} optional disabled={!high} end_date={education && EduFinder({key: 'education', value: 'Secondary (High School)'}, 'end_date')} />
                        <EducationAttainment attainment='Vocational & Technical Education' data={tech} optional  disabled={!high} end_date={education && EduFinder({key: 'education', value: senior?'Senior High School':'Secondary (High School)'}, 'end_date')} />
                        <EducationAttainment attainment='College' data={college} required disabled={!high} end_date={education && EduFinder({key: 'education', value: tech?'Vocational & Technical Education':senior?'Senior High School':'Secondary (High School)'}, 'end_date')} />
                        <EducationAttainment attainment="Graduate School (Master's or Doctorate)" data={master} optional disabled={!college} end_date={education && EduFinder({key: 'education', value: college?'College':tech?'Vocational & Technical Education':senior?'Senior High School':'Secondary (High School)'}, 'end_date')} />
                        <Divider />
                        <form onSubmit={handleSubmit}>
                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' disabled={!elem || !high || (!senior && !tech && !college)}>Save</MDButton>
                        </form>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default Educational;