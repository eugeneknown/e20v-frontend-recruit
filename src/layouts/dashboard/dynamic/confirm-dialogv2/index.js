import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";

function ConfirmDialog({id, buttonTitle, title, children, color, data}) {

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <MDBox>
            <MDBox>
                <MDButton onClick={handleOpen} color={color}>{buttonTitle}</MDButton>
            </MDBox>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={handleClose}>Cancel</MDButton>
                    <MDButton onClick={() => data(id ? id : true)} autoFocus color={color}>
                        {buttonTitle}
                    </MDButton>
                </DialogActions>
            </Dialog>
        </MDBox>
    );
}

ConfirmDialog.defaultProps = {
    variant: 'none',
}

ConfirmDialog.prototype = {
    id: PropTypes.any,
    buttonTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['none', 'submit', 'delete']),
    data: PropTypes.func,
}

export default ConfirmDialog;