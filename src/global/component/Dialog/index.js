import { DialogActions, DialogContent, DialogTitle } from "@mui/material"
import MDBox from "components/MDBox"
import MDButton from "components/MDButton"
import { useState } from "react"



const Dialog = ({ open: openComponent, title, action, children }) => {
    const [open, setOpen] = useState(false)

    return (
        <MDBox>
            <MDButton onClick={()=>setOpen(true)}>{openComponent}</MDButton>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}
            >
                {title && <DialogTitle>{title}</DialogTitle>}
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <MDButton onClick={()=>setOpen(false)} color='error'>Close</MDButton>
                    {action}
                </DialogActions>
            </Dialog>
        </MDBox>
    )

}

export default Dialog