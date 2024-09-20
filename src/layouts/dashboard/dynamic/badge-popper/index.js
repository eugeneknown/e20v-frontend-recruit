import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useState } from "react";
import { Grow, Paper, ClickAwayListener, MenuList, MenuItem, Popper } from "@mui/material"


function BadgePopper({
    badgeContent,
    color,
    variant,
    content,
    data,
}) {

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
    
    const handleClose = (item) => {
        data(item)
        setState({ open: false, anchorEl: null });
    };
    
    const handleListKeyDown = (event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          setState({ open: false });
        }
    };
    
    return (
        <MDBox>
            <MDButton
                onClick={handleToggle}
            >
                <MDBadge
                    badgeContent={badgeContent}
                    color={color}
                    variant={variant}
                />
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
                                    Object.keys(content).map((item, key) => (
                                        <MenuItem 
                                            key={key} 
                                            onClick={() => handleClose(content[item])}
                                            sx={{ bgcolor: 'transparent' }}
                                        >
                                            <MDBadge
                                                badgeContent={content[item].title}
                                                color={content[item].color}
                                                variant={variant}
                                            />
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

export default BadgePopper