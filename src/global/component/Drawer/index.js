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

import { useState, useEffect } from "react";

// react-github-btn
import GitHubButton from "react-github-btn";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// @mui icons
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Custom styles for the Configurator
import DrawerRoot from "./DrawerRoot";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
} from "context";

function Drawer({ open: i, title, sx, children }) {
  const [controller] = useMaterialUIController();
  const {
    darkMode,
  } = controller;

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(i)
  },[i])

  return (
    <MDBox {...sx}>
      <DrawerRoot variant="permanent" ownerState={{open}}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
          pt={4}
          pb={0.5}
          px={3}
        >
          <MDTypography variant="h5">{title}</MDTypography>
          <Icon
            sx={({ typography: { size }, palette: { dark, white } }) => ({
              fontSize: `${size.lg} !important`,
              color: darkMode ? white.main : dark.main,
              stroke: "currentColor",
              strokeWidth: "2px",
              cursor: "pointer",
              transform: "translateY(5px)",
            })}
            onClick={() => setOpen(false)}
          >
            close
          </Icon>
        </MDBox>
        <Divider />
        {children}
      </DrawerRoot>
    </MDBox>
  );
}

export default Drawer;
