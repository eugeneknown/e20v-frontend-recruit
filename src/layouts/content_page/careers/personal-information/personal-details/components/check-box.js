import { Button, Checkbox, Divider, FormControl, FormHelperText, Icon, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useState } from "react";


export const CheckboxField = ({ props, handleChange }) => {
    const [open, setOpen] = useState(false); // Dropdown open/close state
    const [selectedValues, setSelectedValues] = useState(
    props.value && Array.isArray(props.value) ? props.value : []
    );
    const [filteredOptions, setFilteredOptions] = useState(props.options || []); // Filtered options
    const [searchTerm, setSearchTerm] = useState(''); // Term for filtering

    const handleDropdownToggle = () => {
        setOpen((prevOpen) => !prevOpen); // Toggle dropdown open/close state
        };
        
        const handleSelectionChange = (event) => {
        let { value } = event.target;
        let newValues = typeof value === "string" ? value.split(",") : [...value];
        if (newValues.includes("None of the Above")) {
        if (!selectedValues.includes("None of the Above")) {
        // If "None of the Above" is selected, clear other selections
        newValues = ["None of the Above"];
        } else {
        // If "None of the Above" was unchecked, allow normal selection
        newValues = newValues.filter((item) => item !== "None of the Above");
        }
        } else {
        // Remove "None of the Above" if other selections are made
        newValues = newValues.filter((item) => item !== "None of the Above");
        }
        setSelectedValues(newValues);
        };
        const handleSaveCheckedFields = () => {
        setSelectedValues((prevValues) => {
        let finalSelectedValues = prevValues.length === 0 ? ["None of the Above"] : prevValues;
        if (finalSelectedValues.includes("None of the Above")) {
        finalSelectedValues = ["None of the Above"];
        }
        // Save the selected values properly
        handleChange({
        target: { name: props.name, value: finalSelectedValues },
        });
        return finalSelectedValues;
        });
        setTimeout(() => setOpen(false), 0);
        };
        const handleFilter = (event) => {
        const typedChar = event.key.toLowerCase();
        const newSearchTerm = searchTerm + typedChar;
        setSearchTerm(newSearchTerm);
        
        const filtered = props.options.filter((option) =>
        option.toLowerCase().includes(newSearchTerm) || option === "None of the Above"
        );
        setFilteredOptions(filtered);
        };
        
        const clearSearchOnClose = () => {
        setSearchTerm(''); // Clear the search term when the dropdown closes
        setFilteredOptions(props.options); // Reset options to the original list
        };
        

    return (
        <FormControl fullWidth={props.fullWidth} error={props.error}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                {...props}
                multiple
                open={open}
                value={selectedValues}
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
                onKeyDown={handleFilter} // Dynamically filter on typing
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
                <MenuItem disableRipple disableTouchRipple sx={{ justifyContent: "end", pointerEvents: "none", backgroundColor: "transparent", "&:hover": {backgroundColor: "transparent"}}}>
                    <div style={{ pointerEvents: "auto" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Icon>check_circle</Icon>}
                            sx={{
                                color: "#fff",
                                backgroundColor: "primary.main",
                                fontSize: "0.8rem",
                                "&:hover": {
                                    backgroundColor: "primary.main", // Ensures no hover color change
                                    boxShadow: "none", // Prevents any shadow on hover
                                },
                            }}
                            onClick={(event) => {
                                event.stopPropagation(); // Prevents unchecking "None of the Above"
                                handleSaveCheckedFields();
                            }}
                        >
                            OK
                        </Button>
                    </div>
                </MenuItem>


            </Select>
            {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
};