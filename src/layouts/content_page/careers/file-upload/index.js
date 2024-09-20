import { Button, Icon, IconButton } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { useState } from "react";
import { MuiFileInput } from 'mui-file-input'

function FileUpload({question, data}) {

    const [ file, setFile ] = useState(null)

    const handleFile = (e) => {
        console.log('debug file upload data', e);
        setFile(e)
        data(e)
    }

    return (
        <MDBox>
            <MuiFileInput
                variant="outlined"
                InputProps={{
                    inputProps: {
                        accept: question?.value,
                    },
                    startAdornment: <Icon>attach_file</Icon>,
                    endAdornment: <IconButton size="small" onClick={e => setFile(null)}><Icon>close</Icon></IconButton>,
                }}
                placeholder="Attach File"
                value={file}
                onChange={handleFile}
            />
        </MDBox>
    );
}

export default FileUpload;