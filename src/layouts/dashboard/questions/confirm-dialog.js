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
import MDButton from "components/MDButton";

function ConfirmDialog({closeModal, title, content, data}) {
    return (
        <MDBox>
            <Dialog
                open={true}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {content}
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={() => closeModal()}>Cancel</MDButton>
                    <MDButton onClick={() => data(true)} autoFocus>
                        Confirm
                    </MDButton>
                </DialogActions>
            </Dialog>
        </MDBox>
    );
}

export default ConfirmDialog;