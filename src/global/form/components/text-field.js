import React, { useState, useRef, useEffect } from "react";
import { IconButton, TextField as MUITextField, Tooltip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MDBox from "components/MDBox";

const TextField = ({ props, sx=null }) => {
  const [isLabelOverflowing, setIsLabelOverflowing] = useState(false);
  const labelRef = useRef(null);
  const textRef = useRef(null)
  const [state, setState] = useState(false)

  useEffect(() => {
    const label = labelRef.current;
    const text = textRef.current;
    if (label && text) {
        setIsLabelOverflowing(label.scrollWidth > text.scrollWidth);
    }
  }, []);

  const handleOpen = () => setState(true)
  const handleClose = () => setState(false)

  return (
    <MDBox width='100%' sx={sx}>
        <MDBox display='flex' alignItems='center'>
            <MUITextField
                {...props}
                {...props?.options}
                ref={textRef}
                onFocus={handleOpen}
                onBlur={handleClose}
                slotProps={{
                    inputLabel: {
                        ref: labelRef,
                        style: {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        },
                    }
                }}
            />
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

export default TextField;
