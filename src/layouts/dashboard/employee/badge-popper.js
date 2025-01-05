import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useState, useEffect } from "react";
import { Grow, Paper, ClickAwayListener, MenuList, MenuItem, Popper, Icon, IconButton, Button, Dialog, DialogContent, DialogActions } from "@mui/material"
import MDTypography from "components/MDTypography";
import { ChromePicker } from "react-color";
import MDInput from "components/MDInput";
import { useSnackbar } from "notistack";


function BadgePopper({
    id,
    badgeId,
    variant,
    content,
    data,
    editable,
    deletable,
}) {

    const [openAddData, setOpenAddData] = useState(false)
    const [colorPicker, setColorPicker] = useState()
    const [dataId, setDataId] = useState()
    const [title, setTitle] = useState()
    const [action, setAction] = useState()
    const [currentBadge, setCurrentBadge] = useState()

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        // console.log('debug badge popper content:', content);
        setCurrentBadge(content[Object.keys(content).find(key => content[key].id == badgeId)] || 0)
    },[])

    const [state, setState] = useState({
        open: false, 
        anchorEl: null,
    })
    const handleToggle = (event) => {
        setState({
          open: !state.open,
          anchorEl: state.anchorEl ? null : event.currentTarget
        });
    };
    
    const handleClose = (data_id) => {
        data({id, data_id, action: 'select'})
        setState({ open: false, anchorEl: null });
    };
    
    const handleListKeyDown = (event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          setState({ open: false });
        }
    };

    const handleAdd = () => {
        setAction('add')
        setOpenAddData(true)
    }

    const handleEdit = (e, data) => {
        e.stopPropagation()
        console.log('debug edit data:', data);
        setAction('edit')
        setDataId(data.id)
        setTitle(data.title)
        setColorPicker(data.color)
        setOpenAddData(true)
    }

    const handleDelete = (e, id) => {
        e.stopPropagation()
        data({
            id: id,
            action: 'delete',
        })
    }

    const hadndleColorPicker = (e) => {
        console.log('debug color picker:', e);
        setColorPicker(e.hex)
    }

    const handleSubmit = () => {
        console.log('debug add submit:', title, colorPicker, action);

        switch (action) {
            case 'add':
                if ( title != undefined && colorPicker != undefined ) {
                    setOpenAddData(false)
                    data({title, color: colorPicker, action})
                } else {
                    let err
                    if ( title == undefined ) {
                        err = 'Title is empty'
                    } else {
                        err = 'Please select color'
                    }
        
                    enqueueSnackbar(err, {
                        variant: 'error',
                        preventDuplicate: true,
                        anchorOrigin: {
                          horizontal: 'right',
                          vertical: 'top',
                        }
                    })
                }
                break

            case 'edit':
                setOpenAddData(false)
                data({
                    id: dataId,
                    title,
                    color: colorPicker,
                    action,
                })
                break

        }

    }
    
    return (
        <MDBox>
            <MDButton
                onClick={handleToggle}
            >
                {currentBadge 
                ?   <MDBadge
                        badgeContent={currentBadge.title}
                        color={currentBadge.color}
                        variant={variant}
                    />
                :   <MDBadge
                        badgeContent='unassigned'
                        color='#D3D3D3'
                        variant={variant}
                    />
                }
            </MDButton>

            <Popper
            placement="left"
            anchorEl={state.anchorEl}
            open={state.open}
            transition
            disablePortal
            sx={{ zIndex: 1 }}
            >
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement="center right"
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={() => setState({ open: false, anchorEl: null })}>
                            <MenuList
                                autoFocusItem={state.open}
                                onKeyDown={handleListKeyDown}
                            >
                                {
                                    content && Object.keys(content).map((item, key) => (
                                        <MenuItem 
                                            key={key} 
                                            onClick={(e) => handleClose(content[item].id)}
                                            sx={{ 
                                                bgcolor: 'transparent', 
                                                justifyContent: 'space-between' 
                                            }}
                                            
                                        >
                                            <MDBadge
                                                badgeContent={content[item].title}
                                                color={content[item].color}
                                                variant={variant}
                                            />
                                            <MDBox ml={2} display='flex'>
                                            {
                                                editable &&
                                                (
                                                    <IconButton 
                                                        onClick={(e) => handleEdit(e, content[item])}
                                                        color="warning"
                                                        sx={{
                                                            fontSize: '1.1rem'
                                                        }}
                                                    >
                                                        <Icon>edit</Icon>
                                                    </IconButton>
                                                )
                                            }
                                            {
                                                deletable &&
                                                (
                                                    <IconButton 
                                                        onClick={(e) => handleDelete(e, content[item].id)}
                                                        color="error"
                                                        sx={{
                                                            fontSize: '1.1rem'
                                                        }}
                                                    >
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                )
                                            }
                                            </MDBox>
                                        </MenuItem>
                                    ))
                                }
                                <MenuItem
                                    onClick={handleAdd}
                                    sx={{ justifyContent: 'center' }}
                                >
                                    <Button 
                                        color="info" 
                                        startIcon={<Icon>add</Icon>}
                                        sx={{ py: 0 }}
                                    >
                                        Add
                                    </Button>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
            </Popper>
            <Dialog
                open={openAddData}
                onClose={() => setOpenAddData(false)}
            >
                <DialogContent>
                    <MDInput value={title} onChange={(e) => setTitle(e.target.value)} type="text" label="Title" variant="standard" />
                    <MDTypography variant='button' fontWeight="bold" sx={{ my: 1, display: 'block' }}>Select Color</MDTypography>
                    <ChromePicker
                        color={colorPicker}
                        onChangeComplete={hadndleColorPicker}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <MDButton onClick={() => setOpenAddData(false)} color='warning'>Close</MDButton>
                    <MDButton onClick={handleSubmit} color='info'>Submit</MDButton>
                </DialogActions>
            </Dialog>
        </MDBox>
    );
}

export default BadgePopper