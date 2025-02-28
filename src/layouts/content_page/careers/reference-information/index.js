import {Card, CardContent, CardHeader, Checkbox, Chip, Container, Dialog, DialogActions, DialogContent, Divider, Icon, IconButton, Link} from "@mui/material";
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


function ReferenceInformation(){

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

    const authorization = (
        <MDBox mt={3}>
            <MDBox display='flex' justifyContent='center'>
                <MDTypography
                    component="a"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Authorization Letter
                </MDTypography>
            </MDBox>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                In the course of conducting an investigation into my background, I authorize the Company to contact any government agencies, 
                previous employers, educational institutions, public or private entities, and individuals, as well as the listed references.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I authorize the Company to release all background investigation data to the Company's designated hiring officers for use in evaluating
                my application for employment or for continued empoyment. I understand and acknowledge that the information gathered and provided to hiring officers by the 
                Company may be detrimental to my application for employment or continued employment.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I also authorize any individual, company, firm corporation, or public agency to disclose any and all information pertaining to me, whether verbal or written.
                I hereby release from all liability any person, firm, or organition that provides information or records in accordance with this authorization.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                By signing this document, I give the Company my permission to conduct an initial background check for employment application purposes, as well as any
                subsequent background checks deemed necessary during the course of my employment with the Company.
            </MDTypography>
        </MDBox>
    )

    const term = (
        <MDBox mt={3}>
            <MDBox display='flex' justifyContent='center'>
                <MDTypography
                    component="a"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Terms and Conditions
                </MDTypography>
            </MDBox>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                and that any dishonesty or falsification may jeopardize my employment application.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I hereby release all persons, companies, or corporations who provide such information from any liability or responsibility. I also 
                agree to submit any future examination that Eighty20 Virtual may require of me, and that the foregoing examination questions and answers may be 
                used in any way that the company desires.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I am fully aware of the consequences of non-declaration, untruthfulness, and dishonesty that may result in the termination of my employment contract.
            </MDTypography>
        </MDBox>
    )

    const AuthLetter = () => (
        <MDBox>
            <MDBox>
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block', cursor: 'pointer' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ ml: '4px' }}
                            onClick={() => {
                                setContent(authorization);
                                setOpen(true)
                            }}
                        >
                            Authorization Letter
                        </MDTypography>
                    </MDTypography>
                </MDBox> 
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ mx: '4px', cursor: 'pointer' }}
                            onClick={() => {
                                setContent(term);
                                setOpen(true)
                            }}
                        >
                            Terms and Conditions
                        </MDTypography>  
                    </MDTypography>
                </MDBox> 
            </MDBox>
        </MDBox>
    )

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/reference/delete', {id}).then((result) => {
            console.log('debug reference details delete result', result);
            init()
        }).catch((err) => {
            console.log('debug reference details delete error result', err);

        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if ( ref && (Object.keys(ref).length >= 2) ) {
            toPage('/careers/submitted')
        } else {
            err.current.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center'
            })
        }

    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <Grid container pt={6} pb={3}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox maxWidth="sm" mx={{ xs: 3, md: 'auto', lg: 3, xl: 'auto' }} pt="5rem">
                        <Card variant="outlined">
                            <CardContent>
                                <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                                <MDTypography sx={{ mt: 3 }} variant='h3'>CHARACTER REFERENCES</MDTypography>
                                <MDTypography variant='button' color='error'>(Please exclude relatives/friends; kindly provide previous employment head, colleague, and HR)</MDTypography>
                                <Divider />
                                {ref && Object.keys(ref).map((item, index) => (
                                    <Card position='relative' sx={{ my: 2 }}>
                                        <MDBox display='flex' position='absolute' right={0} p={1}>
                                            <IconButton onClick={() => toPage('/careers/reference/referenceform', { id: ref[item].id })}><Icon>edit</Icon></IconButton>
                                            <IconButton onClick={() => handleDelete(ref[item].id)}><Icon>delete</Icon></IconButton>
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
                                {ref && Object.keys(ref).length < 3 && <MDButton
                                    variant='outlined' 
                                    color='secondary' 
                                    fullWidth
                                    startIcon={<Icon>add</Icon>}
                                    onClick={() => toPage('/careers/reference/referenceform')}
                                >
                                    <MDTypography ref={err} variant='body2' color='secondary'>Add References</MDTypography>
                                </MDButton>}
                                <MDTypography my={1} sx={{ display: ref && (Object.keys(ref).length >= 2) ? 'none' : 'block' }} color='error' variant='button'>Add atleast 2 reference</MDTypography>
                                <Divider />
                                <form onSubmit={handleSubmit}>
                                <AuthLetter />
                                <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Submit Application</MDButton>
                                </form>
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={2} orientation='vertical' position='fixed' />
                </Grid>
            </Grid>
            <Footer />
            <Dialog
                open={open}
            >
                <DialogContent>{content}</DialogContent>
                <DialogActions>
                    <MDButton onClick={()=>setOpen(false)} color='error'>Close</MDButton>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
}

export default ReferenceInformation;