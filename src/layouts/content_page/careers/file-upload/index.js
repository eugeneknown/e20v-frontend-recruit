import { Icon, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import { useState } from "react";
import { MuiFileInput } from "mui-file-input";

function FileUpload({ question, data, disabled }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleFile = (e) => {
        const allowedFormats = question.options || [];
        const fileExtension = e?.name?.split(".").pop()?.toLowerCase();

        // Validate file format
        if (!allowedFormats.includes(fileExtension)) {
            setError(`Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`);
            setFile(null);
            data(null); // Reset the file data in parent
            return;
        }
        else{
            setError(""); // Clear error if valid
            setFile(e);
            data(e); // Pass the file data to parent
        }
    };

    return (
        <MDBox>
            <MuiFileInput
                variant="outlined"
                InputProps={{
                    inputProps: {
                        accept: question?.value,
                    },
                    startAdornment: <Icon>attach_file</Icon>,
                    endAdornment: (
                        <IconButton size="small" onClick={() => setFile(null)}>
                            <Icon>close</Icon>
                        </IconButton>
                    ),
                }}
                placeholder="Attach File"
                value={file}
                onChange={handleFile}
                disabled={disabled}
                error={Boolean(error)}
            />
            {error && <p style={{ color: "red", fontSize: "0.75rem" }}>{error}</p>}
        </MDBox>
    );
}

export default FileUpload;
