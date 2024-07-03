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

// @mui material components
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ImgsViewer from 'react-images-viewer';


const FileViewer = props => {
    return (
        <MDBox>
            <ImgsViewer 
                imgs={[ {src: props.img} ]}
                isOpen={props.isOpen}
                onClose={props.onClose}
            />
        </MDBox>
    );
}

export default FileViewer;