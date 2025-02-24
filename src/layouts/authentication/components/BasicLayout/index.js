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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication pages components
import Footer from "layouts/authentication/components/Footer";

function BasicLayout({ children }) {
  return (
    <PageLayout>
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, rgb(100, 140, 255) 30%, rgb(89, 50, 190) 100%)", 
          backgroundSize: "300% 300%",
          animation: "gradientAnimation 2.3s ease-in-out infinite alternate",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "@keyframes gradientAnimation": {
            "0%": { backgroundPosition: "0% 50%" },
            "100%": { backgroundPosition: "100% 50%" },
          },
        }}
      >
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <Footer light />
    </PageLayout>
  );
}

BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasicLayout;