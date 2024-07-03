import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useState } from "react";
import { Grow, Paper, ClickAwayListener, MenuList, MenuItem, Popper } from "@mui/material"


function PopOverMenu({ icon, badgecount, menu }) {

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
  
    const show = (event) => {
      setState({
        open: true,
        anchorEl: event.currentTarget
      });
    };
    const hide = (event) => {
      setState({
        open: false,
        anchorEl: null
      });
    };
    const handleClose = () => {
      setState({ open: false, anchorEl: null });
    };
  
    const handleListKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        setState({ open: false });
      }
    };
  
    return (
        <MDBox
            style={{
            marginLeft: "20px",
            marginTop: "10px"
            }}
            className="popover-menu"
            onMouseEnter={show}
            onMouseLeave={hide}
        >
            <MDButton
            aria-controls={state.open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={handleToggle}
            >
                <MDBadge badgeContent={badgecount} color="primary">
                    {icon}
                </MDBadge>
            </MDButton>

            <Popper
            placement="bottom"
            anchorEl={state.anchorEl}
            open={state.open}
            role={undefined}
            transition
            disablePortal
            >
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                style={{
                    transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                                autoFocusItem={state.open}
                                id="menu-list-grow"
                                onKeyDown={handleListKeyDown}
                            >
                                {
                                    menu.map((item, i) => (
                                        <MenuItem key={i} onClick={handleClose}>
                                            {item.label}
                                        </MenuItem>
                                    ))
                                }
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
            </Popper>
        </MDBox>
    );
  }

export default PopOverMenu