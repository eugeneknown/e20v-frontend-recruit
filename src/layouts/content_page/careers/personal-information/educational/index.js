import {Card, CardContent, Typography, CardHeader, Checkbox, Chip, Container, Divider, FormControlLabel, Icon, IconButton, Link, Switch} from "@mui/material";
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
import { useMaterialUIController, setDialog } from "context";
import { useSnackbar } from "notistack";



function Educational(){
    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
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
                    // If a higher level has data, snackbar the user and stop deletion
                    snackBar(`You cannot delete ${level} because a higher level exists: ${educationOrder[i].level}`, 'error');
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
        e.preventDefault();
    
        // Check if elementary, high school, and college data exist
        if (!elem || !high || (!senior && !tech && !college)) {
            let missingFields = [];
            if (!elem) missingFields.push("Elementary");
            if (!high) missingFields.push("High School");
            if (!tech && !college) missingFields.push("Either Vocational or College");
    
            snackBar(`Please fill up the following required Educational Background: ${missingFields.join(", ")}`, 'error');
            return;
        }
    
        // Check if high school, senior high school, vocational, and college levels respect minimum year differences
        let error = false;
        let errorMessage = "";
    
        // Check if High School ends at least 4 years after Elementary
        if (high && moment(high.end_date).diff(moment(elem.end_date), 'years') < 4) {
            errorMessage = `High School year graduated ${moment(high.end_date).format('YYYY')} should be at least 4 years after Elementary year graduated ${moment(elem.end_date).format('YYYY')}.`;
            error = true;
        }
        // Check if High School ends before College starts
        else if (high && college && moment(high.end_date).isAfter(moment(college.start_date))) {
            errorMessage = `High School year graduated ${moment(high.end_date).format('YYYY')} should not be after College year started ${moment(college.start_date).format('YYYY')}.`;
            error = true;
        }
        // Check if Senior High School ends at least 2 years after High School
        else if (senior && (moment(senior.end_date).diff(moment(high.end_date), 'years') < 2 || moment(senior.end_date).isSame(moment(high.end_date), 'year'))) {
            errorMessage = `Senior High School year graduated ${moment(senior.end_date).format('YYYY')} should be at least 2 years after High School year graduated ${moment(high.end_date).format('YYYY')}.`;
            error = true;
        }
        // Check if High School ends before Vocational & Technical Education starts
        else if (high && tech && tech.is_applicable && moment(high.end_date).diff(moment(tech.start_date), 'years') < 1) {
            errorMessage = `High School year graduated ${moment(high.end_date).format('YYYY')} should be at least 1 year before Vocational year started ${moment(tech.start_date).format('YYYY')}.`;
            error = true;
        }
        // Check if Senior High School ends before College starts
        else if (senior && college && moment(senior.end_date).isAfter(moment(college.start_date))) {
            errorMessage = `Senior High School year graduated ${moment(senior.end_date).format('YYYY')} should not be after College year started ${moment(college.start_date).format('YYYY')}.`;
            error = true;
        }
        // Check if Vocational & Technical Education ends before College starts
        else if (tech && college && moment(tech.end_date).isAfter(moment(college.start_date))) {
            errorMessage = `Vocational & Technical Education year graduated ${moment(tech.end_date).format('YYYY')} should not be after College year started ${moment(college.start_date).format('YYYY')}.`;
            error = true;
        }
        // Check if Master’s starts at least 2 years after College ends
        else if (master && (moment(master.start_date).diff(moment(college.end_date), 'years') < 2 || moment(master.start_date).isSame(moment(college.end_date), 'year'))) {
            errorMessage = `Master year started ${moment(master.start_date).format('YYYY')} should be at least 2 years after College year graduated ${moment(college.end_date).format('YYYY')}.`;
            error = true;
        }
    
        // Ensure Vocational & Technical Education does not end after Senior High School starts
        if (tech && senior && moment(tech.end_date).isAfter(moment(senior.start_date))) {
            errorMessage = `Vocational & Technical Education year graduated ${moment(tech.end_date).format('YYYY')} should not be after Senior High School year started ${moment(senior.start_date).format('YYYY')}.`;
            error = true;
        }
    
        // Additional checks for Senior High School to be after Vocational & Technical Education or College
        if (senior && tech && moment(senior.end_date).isAfter(moment(tech.start_date))) {
            errorMessage = `Senior High School year graduated ${moment(senior.end_date).format('YYYY')} should not be after Vocational year started ${moment(tech.start_date).format('YYYY')}.`;
            error = true;
        } else if (senior && college && moment(senior.end_date).isAfter(moment(college.start_date))) {
            errorMessage = `Senior High School year graduated ${moment(senior.end_date).format('YYYY')} should not be after College year started ${moment(college.start_date).format('YYYY')}.`;
            error = true;
        }
    
        // If there's an error, display the error message
        if (error) {
            snackBar(errorMessage, 'error');
        } else {
            prevPage(); // Proceed to the next page or action
        }
    };
    
    
    
    const handleDialogClose = () => setDialog(dispatch, {...dialog, open: false})


    const deleteHandle = (id,level) => {
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
                    // If a higher level has data, snackbar the user and stop deletion
                    snackBar(`You cannot delete ${level} because a higher level exists: ${educationOrder[i].level}.`, 'error');
                    return;
                }
            }
        }
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
                Are you sure you want to delete {level}? This action cannot be undone.
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
                  handleDelete(id, level);
                  handleDialogClose();
                }}
              >
                <Icon sx={{ fontSize: 20 }}>delete</Icon>
                Confirm
              </MDButton>
            </MDBox>
          ),
        });
      };

    const EducationAttainment = ({ attainment, data, required = false, optional = false, disabled = false, end_date }) => {
        const [option, setOption] = useState(false);
    
        return (
            <MDBox>
                <MDBox my={1}>
                    <MDTypography variant="h5">{attainment}</MDTypography>
                    {!option && data && (
                        <Card variant="outlined" position="relative" sx={{ my: 2 }}>
                            <MDBox display="flex" position="absolute" right={0} p={1}>
                                <IconButton onClick={() => toPage('/careers/personalinfo/educational/form', { id: data.id, end_date })}>
                                    <Icon color="primary">edit</Icon>
                                </IconButton>
                                <IconButton onClick={() => deleteHandle(data.id,attainment)}>
                                    <Icon color="error">delete</Icon>
                                </IconButton>
                            </MDBox>
                            <CardContent>
                                <MDTypography variant="body2">School: {data.school}</MDTypography>
                                {data?.course && <MDTypography variant="body2">Course: {data.course}</MDTypography>}
                                {data.start_date ? 
                                <MDTypography variant='body2'>
                                   Year: {data.start_date ? formatDateTime(data.start_date, 'YYYY') : 'N/A'} 
                                    {data.present 
                                        ? ` to Present`
                                        : data.undergrad 
                                        ? ` - Undergraduate`
                                        : data.end_date 
                                        ? ` to ${formatDateTime(data.end_date, 'YYYY')}`
                                        : ''}
                                </MDTypography>: 
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
                            disabled={disabled} 
                            startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                            onClick={() => toPage('/careers/personalinfo/educational/form', { education: attainment, end_date })}
                            sx={{ 
                                mt: 2, 
                                borderColor: "secondary.main", 
                                "&:hover": {
                                color: "red", 
                                borderColor: "red", 
                                "& .MuiSvgIcon-root": {
                                    color: "red", 
                                },
                                },
                                transition: "all 0.3s ease", 
                            }} 
                        >
                            <MDTypography variant="body2" color="inherit">
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
                        {education !== undefined && education?.length === 0 && (
                        <MDTypography color="error" variant="h5" sx={{ my: 2, textAlign: "center" }}>
                            No educational background found
                        </MDTypography>
                        )}
                        <EducationAttainment attainment='Elementary' data={elem} required />
                    <EducationAttainment 
                        attainment='Secondary (High School)' 
                        data={high} 
                        required 
                        disabled={!elem} 
                        end_date={education && EduFinder({key: 'education', value: 'Elementary'}, 'end_date') 
                            ? moment(EduFinder({key: 'education', value: 'Elementary'}, 'end_date')).add(4, 'years').format('YYYY') 
                            : undefined} 
                    />
                    <EducationAttainment 
                        attainment='Senior High School' 
                        data={senior} 
                        optional 
                        disabled={!high} 
                        end_date={education && EduFinder({key: 'education', value: 'Secondary (High School)'}, 'end_date') 
                            ? moment(EduFinder({key: 'education', value: 'Secondary (High School)'}, 'end_date')).add(2, 'years').format('YYYY') 
                            : undefined} 
                    />
                    <EducationAttainment 
                        attainment='Vocational & Technical Education' 
                        data={tech} 
                        optional  
                        disabled={!high} 
                        end_date={education && EduFinder({key: 'education', value: senior ? 'Senior High School' : 'Secondary (High School)'}, 'end_date') 
                            ? moment(EduFinder({key: 'education', value: senior ? 'Senior High School' : 'Secondary (High School)'}, 'end_date')).add(1, 'years').format('YYYY') 
                            : undefined} 
                    />
                    <EducationAttainment 
                        attainment='College' 
                        data={college} 
                        required 
                        disabled={!high} 
                        end_date={education && EduFinder({key: 'education', value: tech ? 'Vocational & Technical Education' : senior ? 'Senior High School' : 'Secondary (High School)'}, 'end_date') 
                            ? moment(EduFinder({key: 'education', value: tech ? 'Vocational & Technical Education' : senior ? 'Senior High School' : 'Secondary (High School)'}, 'end_date')).add(1, 'years').format('YYYY') 
                            : undefined} 
                    />
                    <EducationAttainment 
                        attainment="Graduate School (Master's or Doctorate)" 
                        data={master} 
                        optional 
                        disabled={
                            !college || !college.end_date || moment(college.end_date, 'YYYY').isAfter(moment()) ||
                            college.end_date.includes('Undergraduate') || college.end_date === 'Present' ||
                            college?.undergrad || college?.present 
                          }
                        end_date={education && EduFinder({key: 'education', value: college ? 'College' : tech ? 'Vocational & Technical Education' : senior ? 'Senior High School' : 'Secondary (High School)'}, 'end_date')} 
                    />
                    <Divider />
                    <form onSubmit={handleSubmit}>
                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' disabled={!elem || !high || (!senior && !tech && !college)} startIcon={<Icon>save</Icon>}> Save</MDButton>
                    </form>
                </CardContent>
            </Card>
        </MDBox>
        <Footer />
    </PageLayout>
    );
}

export default Educational;