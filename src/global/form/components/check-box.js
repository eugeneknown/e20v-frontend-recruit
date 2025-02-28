import { useState } from "react";
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, Divider, Button, Icon, FormHelperText } from "@mui/material";


export const CheckboxField = ({ props, sx, handleChange }) => {
    const [open, setOpen] = useState(false); // Dropdown open/close state
    const [selectedValues, setSelectedValues] = useState(
        props.value && Array.isArray(props.value) ? props.value : []
    );
    const [filteredOptions, setFilteredOptions] = useState(props.options || []); // Filtered options
    const [searchTerm, setSearchTerm] = useState(''); // Term for filtering

    const handleSelectionChange = (event) => {
        const {
            target: { value },
        } = event;
        const newValues = typeof value === 'string' ? value.split(', ') : value;
        setSelectedValues(newValues); 
        handleChange(event); 
    };

    const handleSaveCheckedFields = () => {
        console.log('Checked Fields:', selectedValues);
        setOpen(false); 
    };

    const handleFilter = (event) => {
        const typedChar = event.key.toLowerCase();
        const newSearchTerm = searchTerm + typedChar;
        setSearchTerm(newSearchTerm);
        const filtered = props.options.filter((option) =>
            option.toLowerCase().includes(newSearchTerm)
        );
        setFilteredOptions(filtered);
    };

    const clearSearchOnClose = () => {
        setSearchTerm(''); 
        setFilteredOptions(props.options); 
    };

    return (
        <FormControl sx={sx} fullWidth={props.fullWidth} error={props.error}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                {...props}
                multiple
                open={open}
                value={props.value || selectedValues}
                input={<OutlinedInput label={props.label} />}
                renderValue={(selected) => {
                    if (selected.length === 0) {
                        return (
                            <em style={{ color: '#9E9E9E' }}>
                                {props.placeholder || 'Select options'}
                            </em>
                        );
                    }
                    return (
                        <div>
                            {selected.map((value, index) => (
                                <div key={index}>{value}</div>
                            ))}
                        </div>
                    );
                }}
                onOpen={() => setOpen(true)}
                onClose={() => {
                    setOpen(false);
                    clearSearchOnClose();
                }}
                onChange={handleSelectionChange}
                onKeyDown={handleFilter} 
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 48 * 4.5 + 8,
                        },
                    },
                }}
            >
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            <Checkbox checked={selectedValues.includes(item)} />
                            <ListItemText primary={item} />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <em>No options available</em>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem disableRipple sx={{ justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>check_circle</Icon>}
                        sx={{
                            color: "#fff", 
                            backgroundColor: "primary.main", 
                            fontSize: "0.8rem",
                        }}
                        onClick={handleSaveCheckedFields}
                    >
                        OK
                    </Button>
                </MenuItem>

            </Select>
            {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
};