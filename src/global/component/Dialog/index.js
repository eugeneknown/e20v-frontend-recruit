import { DialogActions, DialogContent, DialogTitle, Dialog } from "@mui/material"
import MDButton from "components/MDButton"
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
            <DialogActions sx={{ display: 'block' }}>{action ?? <MDButton color='error' onClick={handleClose}>Close</MDButton>}</DialogActions>
        </Dialog>
    )

}

export default DynamicDialog