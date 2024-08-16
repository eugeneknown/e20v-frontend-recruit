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