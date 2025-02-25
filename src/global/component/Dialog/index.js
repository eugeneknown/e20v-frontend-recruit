import { DialogActions, DialogContent, DialogTitle, Dialog, Icon, IconButton } from "@mui/material"
import MDBox from "components/MDBox"
import { useMaterialUIController, setDialog } from "context"


const DynamicDialog = () => {

    const [controller, dispatch] = useMaterialUIController()
    const { dialog } = controller
    const {
        open,
        title,
        content,
        action,
        props,
    } = dialog

    const handleClose = () => {
        setDialog(dispatch, {...dialog, open: false})
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            {...props}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            {content && <DialogContent>{content}</DialogContent>}
            {action && <DialogActions sx={{ display: 'block' }}>{action}</DialogActions>}
        </Dialog>
    )

}

export default DynamicDialog