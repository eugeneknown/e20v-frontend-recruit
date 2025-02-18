import { Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { isSameDay } from "date-fns";
import { formatDateTime } from "global/function";
import moment from "moment";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";


export const DateRangeFilterFN = (rows, id, filterValues) => {
    const sd = filterValues[0] ? moment(filterValues[0]).startOf('day').toDate() : undefined;
    const ed = filterValues[1] ? moment(filterValues[1]).endOf('day').toDate() : undefined;
    if (ed || sd) {
        return rows.filter((r) => {
            const cellDate = moment(r.values[id]).toDate()
            console.log('range filter', sd, ed, cellDate);

            if (ed && sd) {
                return cellDate >= sd && cellDate <= ed;
            } else if (sd) {
                return cellDate >= sd;
            } else {
                return cellDate <= ed;
            }
        });
    } else {
        return rows;
    }
}

export const DateRangeFilterColumnFN = ({
    column: { filterValue = [], preFilteredRows, setFilter, id }
}) => {
    const [open, setOpen] = useState(false)
    const [state, setState] = useState([
        {
          startDate: moment().toDate(),
          endDate: moment().toDate(),
          key: 'selection'
        }
    ]);

    const staticRanges = [
        {
            label: 'Today',
            range: () => ({
                startDate: moment().startOf('day').toDate(),
                endDate: moment().endOf('day').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'Yesterday',
            range: () => ({
                startDate: moment().startOf('day').subtract(1, 'day').toDate(),
                endDate: moment().endOf('day').subtract(1, 'day').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'This Week',
            range: () => ({
                startDate: moment().startOf('week').toDate(),
                endDate: moment().endOf('week').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'Last Week',
            range: () => ({
                startDate: moment().startOf('week').subtract(1, 'week').toDate(),
                endDate: moment().endOf('week').subtract(1, 'week').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'This Month',
            range: () => ({
                startDate: moment().startOf('month').toDate(),
                endDate: moment().endOf('month').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'Last Month',
            range: () => ({
                startDate: moment().startOf('month').subtract(1, 'month').toDate(),
                endDate: moment().endOf('month').subtract(1, 'month').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'This Year',
            range: () => ({
                startDate: moment().startOf('year').toDate(),
                endDate: moment().endOf('year').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
        {
            label: 'Last Year',
            range: () => ({
                startDate: moment().startOf('year').subtract(1, 'year').toDate(),
                endDate: moment().endOf('year').subtract(1, 'year').toDate(),
            }),
            isSelected(range) {
                const definedRange = this.range();
                return (
                    isSameDay(range.startDate, definedRange.startDate) &&
                    isSameDay(range.endDate, definedRange.endDate)
                );
            },
        },
    ]

    const ApplyFilter = () => {
        const { startDate, endDate } = state[0]
        setFilter((old = []) => [startDate, old[1]]);
        setFilter((old = []) => [old[0], endDate]);
        setOpen(!open)
    }

    const ClearFilter = () => {
        setState([
            {
              startDate: moment().toDate(),
              endDate: moment().toDate(),
              key: 'selection'
            }
        ])
        setFilter([])
    }

    return (
        <MDBox>
            <MDInput
                label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
                fullWidth
                size='small'
                value={filterValue.length ? `${formatDateTime(filterValue[0], 'MM-DD-YYYY')} to ${formatDateTime(filterValue[1], 'MM-DD-YYYY')}` : ''}
                onClick={()=>setOpen(!open)}
                />
            <Dialog
                open={open}
                onClose={()=>setOpen(!open)}
                maxWidth='unset'
            >
                <DialogContent>
                    <DateRangePicker
                        onChange={item => setState([item.selection])}
                        showSelectionPreview={true}
                        editableDateInputs={true}
                        ranges={state}
                        direction="horizontal"
                        preventSnapRefocus={true}
                        calendarFocus="backwards"
                        staticRanges={staticRanges}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <MDButton color='error' onClick={()=>setOpen(!open)} autoFocus>
                        Close
                    </MDButton>
                    <MDBox>
                        <MDButton color='warning' onClick={ClearFilter}>
                            Clear
                        </MDButton>
                        <MDButton sx={{ ml: 1 }} color='info' onClick={ApplyFilter}>
                            Apply
                        </MDButton>
                    </MDBox>
                </DialogActions>
            </Dialog>
        </MDBox>
    )
}


const PlatformFilterColumnFN = ({ column: { filterValue, setFilter, id }, platforms }) => (
    <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel><MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography></InputLabel>
        <Select
            label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
            value={filterValue ?? ''}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ padding: '0.625rem!important' }}
        >
            <MenuItem value="">No Filter</MenuItem>
            {platforms && platforms.map((item, index) => (
                <MenuItem key={index} value={item.title}>{item.title}</MenuItem>
            ))}
        </Select>
    </FormControl>
)

const TagsFilterColumnFN = ({ column: { filterValue, setFilter, id }, tags }) => (
    <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel><MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography></InputLabel>
        <Select
            label={<MDTypography textTransform='capitalize' fontWeight='medium' variant='caption'>{id}</MDTypography>}
            value={filterValue ?? ''}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ padding: '0.625rem!important' }}
        >
            <MenuItem value="">No Filter</MenuItem>
            {tags && tags.map((item, index) => (
                <MenuItem key={index} value={item.title}>{item.title}</MenuItem>
            ))}
        </Select>
    </FormControl>
)