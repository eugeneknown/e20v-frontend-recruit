import React, { useState, useRef, useEffect } from "react";
import { FormControl, IconButton, InputLabel, Tooltip, Select as MUISelect, MenuItem, FormHelperText } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MDBox from "components/MDBox";

const Select = ({ props, sx=null }) => {
  const [isLabelOverflowing, setIsLabelOverflowing] = useState(false);
  const labelRef = useRef(null);
  const targetRef = useRef(null)
  const [state, setState] = useState(false)

  useEffect(() => {
    const label = labelRef.current;
    const target = targetRef.current;
    console.log('adsw', label.getAttribute('data-shrink'), target);
    if (label && target) {
        label.style.maxWidth = 'calc(100% - 35px)'
        setIsLabelOverflowing(label.scrollWidth > target.scrollWidth);
    }
  }, []);

  const handleOpen = () => setState(true)
  const handleClose = () => setState(false)

  return (
    <MDBox width='100%' sx={sx}>
        <MDBox display='flex' alignItems='center'>
            <FormControl required={props.required} fullWidth={props.fullWidth} error={props?.error}>
                <InputLabel ref={labelRef}>{props.label}</InputLabel>
                <MUISelect
                    {...props}
                    ref={targetRef}
                >
                    {props?.options &&
                        props.options.map((item, index) =>
                            typeof item === 'object' ? (
                                <MenuItem key={index} value={item.id}>
                                    {item.title}
                                </MenuItem>
                            ) : (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            )
                        )}
                </MUISelect>
                {props?.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
            </FormControl>
            {isLabelOverflowing && <Tooltip title={props.label} open={state} arrow>
                <IconButton
                    color="warning"
                    fontSize="small"
                    style={{ cursor: "pointer" }}
                    onClick={()=>setState(!state)}
                    onMouseEnter={handleOpen}
                    onMouseLeave={handleClose}
                >
                    <WarningAmberIcon />
                </IconButton>
            </Tooltip>}
        </MDBox>
    </MDBox>
  );
};

export default Select;
