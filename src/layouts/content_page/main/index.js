// Material UI
import { 
    Container,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import PageLayout from "examples/LayoutContainers/PageLayout";

import NavBar from "../nav_bar";

// assets
import containerBg1 from "assets/images/e20/header.jpg";
import img1 from "assets/images/e20/line_2_picture.png";
import img2 from "assets/images/e20/part time icon.png";
import img3 from "assets/images/e20/full time icon.png";
import img4 from "assets/images/e20/step1_icon.png";
import img5 from "assets/images/e20/step2_icon.png";
import img6 from "assets/images/e20/step3_icon.png";
import img7 from "assets/images/e20/step4_icon.png";
import img8 from "assets/images/e20/step5_icon.png";
import img9 from "assets/images/e20/female_icon_1.png";
import img10 from "assets/images/e20/philippine_map_icon.png";



function MainPage() {
  return (
      <PageLayout background="black">
        <Container maxWidth="xl">
          <NavBar color="white" />
          <MDBox>
            <MDBox py="10rem" sx={{
              backgroundImage: `url(${containerBg1})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}>
              <Grid container>
                <Grid xs={6}>
                  <MDBox >
                    <MDTypography color='info' fontWeight="bold" sx={{ fontSize: 140, lineHeight: .9 }}>Come Work With Us</MDTypography>
                    <MDButton sx={{ 
                      color: 'dark_info.main', 
                      borderRadius: '50px', 
                      fontSize: 30,
                      fontWeight: 'bold',
                      px: 13,
                      mt: '2rem',
                      }}
                      href="/careers"
                      >Apply Now</MDButton>
                  </MDBox>
                </Grid>
                <Grid xs={6}></Grid>
              </Grid>
            </MDBox>
            <MDBox mb="5rem">
              <Grid container>
                <Grid xs={6}>
                  <MDBox component="img" src={img1} width='100%' pr="5rem" />
                </Grid>
                <Grid xs={6}>
                  <MDBox my="3rem">
                    <MDBox display="flex">
                      <MDTypography color="info" fontWeight="bold" sx={{ fontSize: 50 }}>Part-time</MDTypography>
                      <MDBox component="img" src={img2} width="10%" height="10%" ml="10px" />
                    </MDBox>
                    <MDTypography color='white'>If you can only work for limited hours during the day, and you are looking for an additional income stream, these positions are for you.</MDTypography>
                  </MDBox>
                  <MDBox mt="6rem" mb="3rem" sx={{ border: 3, borderColor: 'common.white', borderRadius: '5px' }} />
                  <MDBox>
                    <MDBox display="flex">
                      <MDTypography color="info" fontWeight="bold" sx={{ fontSize: 50 }}>Full Time</MDTypography>
                      <MDBox component="img" src={img3} width="10%" height="10%" ml="10px" />
                    </MDBox>
                    <MDTypography color='white'>If you are looking for stability and long-term positions and can work full time, these positions are for you...</MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <MDBox px="5rem" py="3rem" sx={{
            bgcolor: 'common.white',
            borderRadius: '20px',
          }}>
            <MDBox>
              <Grid container>
                <Grid xs={6}>
                  <MDBox>
                    <MDTypography color='info' fontWeight="bold" mb="10px" sx={{ fontSize: 100, lineHeight: .9 }}>Let&apos;s<br/>Grow Together!</MDTypography>
                    <MDTypography pr="5rem" color="black">
                      With more than 10 years of collective experience in the outsourcing industry, we are looking to recruit and train 
                      Filipinos to become world-class support to our clients from sales, admin, tech, creative and more.
                      <br /><br />
                      If your are looking to join a family of go-getters, values-driven, and collaborative, click here to see different open positions and apply.
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid xs={6}>
                  <MDBox>
                    <MDBox py="7px" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MDBox component='img' src={img4} width="20%" height="20%"  />
                      <MDTypography color="black" sx={{ flexGrow: 1 }}>
                        Choose your desired position and click apply.
                        <br/><br/> 
                        Fill in the form and follow instructions for next steps
                      </MDTypography>
                    </MDBox>
                    <MDBox py="7px" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MDTypography color="black" sx={{ flexGrow: 1, flexDirection: 'row-reverse', textAlign: "right" }}>
                        Remi at Eighyt20 Virtual will reach out and schedule for your initial interview.
                      </MDTypography>
                      <MDBox component='img' src={img5} width="20%" height="20%"  />
                    </MDBox>
                    <MDBox py="7px" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MDBox component='img' src={img6} width="20%" height="20%"  />
                      <MDTypography color="black" sx={{ flexGrow: 1 }}>
                        You will then be scheduled for a final interview with the client.
                      </MDTypography>
                    </MDBox>
                    <MDBox py="7px" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MDTypography color="black" sx={{ flexGrow: 1, flexDirection: 'row-reverse', textAlign: "right" }}>
                        You will then be scheduled for a final interview with the client.
                      </MDTypography>
                      <MDBox component='img' src={img7} width="20%" height="20%"  />
                    </MDBox>
                    <MDBox py="7px" sx={{ display: 'flex', alignItems: 'center' }}>
                      <MDBox component='img' src={img8} width="20%" height="20%"  />
                      <MDTypography  color="black" fontWeight="bold" sx={{ flexGrow: 1, fontSize: 50 }}>HIRED!</MDTypography>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <Grid container>
                <Grid xs={9}>
                  <MDBox sx={{ display: 'flex', flexDirection: "row-reverse" }}>
                    <Card sx={{ maxWidth: 345, borderRadius: "50px", bgcolor: '#f4f4f4' }}>
                      <CardMedia
                        sx={{ height: 275 }}
                        image={img9}
                        title="green iguana"
                      />
                      <CardContent>
                        <MDBox component="img" />
                        <MDTypography px="2rem" fontWeight="bold" sx={{ flexGrow: 1, fontSize: 40, lineHeight: 1 }} color="info">
                          Virtual Professional
                        </MDTypography>
                      </CardContent>
                    </Card>
                  </MDBox>
                </Grid>
                <Grid xs={3} px="2rem" sx={{ display: 'flex', alignItems: 'center' }}>
                  <MDBox display="flex">
                    <MDTypography color="info" fontWeight="bold" textAlign='right' sx={{ flexGrow: 1, fontSize: 75, lineHeight: 1.1 }} >Choose Your Path</MDTypography>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <MDBox>
            <Grid container>
              <Grid xs={6}>
                <MDBox component="img" src={img10} width="100%" />
              </Grid>
              <Grid xs={6} py="3rem">
                <MDTypography color="info" fontWeight="bold" textAlign='right' sx={{ flexGrow: 1, fontSize: 75, lineHeight: 1.1 }}>
                  Advocates For Improving The Overall Standard Of The Philippines Online Workforce
                </MDTypography>
                <MDTypography color='white' textAlign="right" pt="1rem">
                  With more than 10 years of collective experience in the outsourcing industry, we are 
                  looking to recruit and train Filipinos to become world-calss support to our clients from sales, admin, tech, creative and more.
                </MDTypography>
              </Grid>
            </Grid>
          </MDBox>
        </Container>
      </PageLayout>
  );
}

export default MainPage;
