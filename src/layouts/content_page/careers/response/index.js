import {Card, CardContent, Chip, Container, Divider, Link} from "@mui/material";
import Grid from "@mui/material/Grid";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";
import ImageView from "layouts/dashboard/employee/image-viewer";
import AudioPlayer from "material-ui-audio-player";
import MDButton from "components/MDButton";


function Response(){

    const {isAuth, auth} = useAuth();
    const [params, setParams] = useSearchParams('');
    const [entity, setEntity] = useState()
    const [answers, setAnswers] = useState()

    useEffect(() => {
        var entity_id = params.get('entity')
        var careers_id = params.get('careers')
        console.log('debug response params', entity_id, careers_id);

        // fetch entity
        dataServicePrivate('POST', 'entity/entities/fetch', {id: entity_id}).then((result) => {
            console.log('debug entity result', result);
            setEntity(result.data['entity'][0])

        }).catch((err) => {
            console.log('debug entity error result', err);

        })

        // fetch answers
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
            relations: ['question'],
        }).then((result) => {
            console.log('debug answers result', result);
            setAnswers(result.data['career_answers'])

        }).catch((err) => {
            console.log('debug answers error result', err);

        })
    }, [])

    var orderlist = ['full_name', 'first_name', 'middle_name', 'last_name', 'email', 'contact_number']
    var blacklist = ['id', 'created_at', 'deleted_at', 'email_verified', 'email_verified_at', 'image', 'status', 'updated_at', 'users_id']

    const renderEntityInfo = (key, value) => (
        <MDBox key={key} display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {key.split('_').join(' ')}: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{moment(value).isValid() && typeof value != 'number' ? formatDateTime(value, 'MM-DD-YYYY') : value}
            </MDTypography>
        </MDBox>
    )

    return (
        <PageLayout>
            <Container maxWidth="xl">
                {/* <NavBar /> */}
                <MDBox pt="3rem">
                    <Grid container>
                        <Grid xs={4} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            entity && orderlist.map(key => renderEntityInfo(key, entity[key]))
                        }
                        {
                            entity && Object.keys(entity).map((key, item) => {
                                if (!blacklist.includes(key) && !orderlist.includes(key)) {
                                    return renderEntityInfo(key, entity[key])
                                }
                            })
                        }
                        </Grid>
                        <Grid xs={8} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            answers && Object.keys(answers).map((item, key) => {
                                if (answers[item]['question_data']['type'] == 'input') {
                                    return (
                                        <Card sx={{ m: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography>{answers[item]['question_data']['title']}</MDTypography>
                                                <Divider />
                                                <MDTypography textTransform="capitalize" variant="caption">{answers[item]['value']}</MDTypography>
                                            </CardContent>
                                        </Card>
                                    )
                                } else {
                                    return (
                                        <Card sx={{ m: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography>{answers[item]['question_data']['title']}</MDTypography>
                                                <Divider />
                                                {
                                                    answers[item]['files'] != null ? 
                                                        (
                                                            <MDBox
                                                            display="flex"
                                                            justifyContent='center'>
                                                                {
                                                                    String(answers[item]['files']['file_type']).split('/')[1] == 'pdf' &&
                                                                    <Link href={answers[item]['files_url']} target="_blank">
                                                                        Open File
                                                                    </Link>
                                                                }
                                                                {
                                                                    String(answers[item]['files']['file_type']).split('/')[0] == 'image' &&
                                                                    <ImageView data={answers[item]} />
                                                                }
                                                                {
                                                                    String(answers[item]['files']['file_type']).split('/')[0] == 'audio' &&
                                                                    <MDBox width='100%'>
                                                                        <AudioPlayer 
                                                                            elevation={1}
                                                                            src={[answers[item]['files_url']]} 
                                                                            width="100%"
                                                                        />
                                                                        <Link href={answers[item]['files_url']} target="_blank">
                                                                            <MDButton sx={{ width: '100%', borderRadius: 0, marginTop: '15px', }}>Download</MDButton>
                                                                        </Link>
                                                                    </MDBox>
                                                                }
                                                            </MDBox>
                                                        ) 
                                                    :
                                                        answers[item]['question_data']['value'].split(', ').map((_key) => {
                                                            if (answers[item]['value'].split(', ').includes(_key)) {
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
                </MDBox>
            </Container>
        </PageLayout>
    );
}

export default Response;