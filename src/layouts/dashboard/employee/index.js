/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Fade, FormControl, InputLabel, MenuItem, Modal, Select, Backdrop, Divider, Tooltip, Icon, FormLabel, 
    FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Popover, Dialog, DialogContent, DialogActions, DialogTitle, IconButton, CardContent, CardHeader, Chip, 
    Link} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { axiosPrivate } from "api/axios";
import team3 from "assets/images/team-3.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import MDInput from "components/MDInput";
import moment from "moment";
import SelectDialog from "./filter-dialog";
import FilterDialog from "./filter-dialog";

import PersonIcon from "@mui/icons-material/Person";
import BadgePopper from "./badge-popper";

import { useSnackbar } from "notistack";
import ImgsViewer from 'react-images-viewer';
import { dataServicePrivate } from "global/function";
import { ChromePicker } from 'react-color'
import ConfirmDialog from "../dynamic/confirm-dialog";
import ImageView from "./image-viewer";
import AudioPlayer from 'react-h5-audio-player';
import GenerateExel from "./generate-exel";
import { DateRangePicker } from "react-date-range";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { isSameDay, startOfDay } from "date-fns";
import entityData from "./entityData";



function Employee() {

    const [recruit, setRecruit] = useState({});
    const [tags, setTags] = useState()
    const [platforms, setPlatforms] = useState()
    const [selectedTag, setSelectedTag] = useState(0)
    const [recruitID, setRecruitID] = useState(0)
    const [experience, setExperience] = useState()

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState();
    const [filterModal, setFilterModal] = useState(false)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // pop open
    const [popOpen, setPopOpen] = useState(null);

    const openPop = Boolean(popOpen);
    const popId = openPop ? 'simple-popover' : undefined;

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    // file viewer
    const fileOpenEvent = () => {
        console.log('w3w')
    } 

    // add data
    const [openAddData, setOpenAddData] = useState(false)
    const [addData, setAddData] = useState()
    const [addDataColor, setAddDataColor] = useState()

    // region confirm modal
    const [confirmModal, setConfirmModal] = useState(false)
    const [idDelete, setIdDelete] = useState()
    const [confirmContent, setConfirmContent] = useState()
    const [contentURL, setContentURL] = useState()

    const handlePopOpen = (e, data) => {
        setRecruitID(data)
        setPopOpen(e.currentTarget)
    }
    const handlePopClose = () => setPopOpen(null);


    const handleCloseModal = () => {
        setFilterModal(false)
    }

    const formHandle = (entity_id, careers_id, readOnly=true) => {
        console.log('debug employee formHandle:', entity_id +' '+ careers_id);

        // entity_career_id for filtering
        dataServicePrivate('POST', 'hr/careers/answers/all', {
            filter: [
                {
                    operator: '=',
                    target: 'entity_id',
                    value: entity_id,
                },
                {
                    operator: '=',
                    target: 'careers_id',
                    value: careers_id,
                },
            ],
            'relations': ['question', 'files']
        }).then((result) => {
            console.log('debug employee formHandle response', result)
            result = result.data['career_answers']

            dataServicePrivate('POST', 'entity/entities/all', {
                filter: [{
                    operator: '=',
                    target: 'id',
                    value: entity_id,
                }],
            }).then((_result) => {
                console.log('debug entity result', _result);
                _result = _result.data['entity'][0]

            setContent((
                <Grid container>
                    <Grid item xs={6} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            entityData.map((key) => renderInfo(key.label, _result[key.id]))
                        }
                        <GenerateExel data={{entity_id, careers_id}} />
                    </Grid>
                    <Grid item xs={6} px={2} style={{maxHeight: '100vh', overflow: 'auto'}}>
                        {
                            Object.keys(result).map((item, key) => {
                                if (result[item]['question']['type'] == 'input') {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
                                                <Divider />
                                                <MDTypography textTransform="capitalize" variant="caption">{result[item]['value']}</MDTypography>
                                            </CardContent>
                                        </Card>
                                    )
                                } else {
                                    return (
                                        <Card sx={{ my: 2 }} key={key}>
                                            <CardContent>
                                                <MDTypography variant='h5'>{result[item]['question']['title']}</MDTypography>
                                                <Divider />
                                                {
                                                    result[item]['files'] != null ? 
                                                        (
                                                            <MDBox
                                                            display="flex"
                                                            justifyContent='center'>
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[1] == 'pdf' &&
                                                                    <Link href={result[item]['files_url']} target="_blank">
                                                                        Open File
                                                                    </Link>
                                                                }
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[0] == 'image' &&
                                                                    <ImageView data={result[item]} />
                                                                }
                                                                {
                                                                    String(result[item]['files']['file_type']).split('/')[0] == 'audio' &&
                                                                    <MDBox width='100%'>
                                                                        <AudioPlayer
                                                                            src={[result[item]['files_url']]} 
                                                                        />
                                                                        <Link href={result[item]['files_url']} target="_blank">
                                                                            <MDButton sx={{ width: '100%', borderRadius: 0, marginTop: '15px', }}>Download</MDButton>
                                                                        </Link>
                                                                    </MDBox>
                                                                }
                                                            </MDBox>
                                                        ) 
                                                    :
                                                        result[item]['question']['value'].split(', ').map((_key) => {
                                                            if (result[item]['value'].split(', ').includes(_key)) {
                                                                return (<Chip key={_key} label={_key} sx={{ m: "5px" }} />)
                                                            } 
                                                        }) 
                                                }
                                            </CardContent>
                                        </Card>
                                    )
                                }
                            })
                        }
                    </Grid>
                </Grid>
            ))

            handleOpen();
            }).catch((_err) => {
                console.log('debug entity error result', _err);

            })
        }, (err) => {
            console.log('debug employee formHandle error response', err)
            enqueueSnackbar(err.message, {
                variant: 'error',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })

        })

    }

    const renderInfo = (title, value) => (
        <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {title}: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{moment(value).isValid() && typeof value != 'number' && value != '0' ? formatDateTime(value, 'MM-DD-YYYY') : value}
            </MDTypography>
        </MDBox>
    )

    const fetchUrl = (id) => dataServicePrivate('POST', 'files/files/url', {id}).then((result) => {console.log('files', result);})

    const dataService = async (method, url, data) =>{
        switch (method) {
            case 'GET':
                return await axiosPrivate.get(url, data)

            case 'POST':
                return await axiosPrivate.post(url, data)
        }
    }

    const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
        return moment( date ).format( output );
    }

    useEffect(() => {
        getInit()
        getTags()
        getPlatforms()

    },[]);

    // revice generate excel
    const getEntityExperience = (id) => {
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [
                {
                    operator: '=',
                    target: 'entity_id',
                    value: id,
                },
            ],
            relations: ['details']
        }).then((result) => {
            console.log('debug entity experience result:', result);
            return result.data['experience']
            
        }).catch((err) => {
            console.log('debug entity experience error result:', err);
            
        })
    }

    const getInit = () => {
        getRecruit({
            relations: ['careers', 'platforms', 'tags', { entity: { relations: ['details'] } }],
            order: {
                'target': 'created_at',
                'value': 'desc',
            },
        })
    }

    const getPlatforms = () => {
        dataServicePrivate('POST', 'hr/careers/platform/all', {}).then((result) => {
            console.log('debug platform result:', result);
            result = result.data['career_platforms']
            setPlatforms(result)
        }).catch((err) => {
            console.log('debug platform error result:', err);
            
        })
    }

    const getRecruit = async (data = {}) => {
        await axiosPrivate.post('hr/careers/entity/all', data).then((result) => {
            console.log("debug employee", result.data);
            setRecruit(result.data['entity_career'])
        }, (err) => {
            console.log("debug employee error", err);
        });
    }

    const getTags = async (data = {}) => {
        await axiosPrivate.post('hr/careers/tags/all', data).then((result) => {
            console.log("debug career tags", result.data);
            result = result.data['career_tags']
            var tags = [{
                id: null,
                title: 'Unnasigned',
                color: '#D3D3D3',
            }]
            for (let i=0; i<Object.keys(result).length; i++) {
                tags[i+1] = {
                    id: result[i].id,
                    title: result[i].title,
                    color: result[i].color,
                }
            }
            console.log("debug career tags result", tags);
            setTags(tags)

        }, (err) => {
            console.log("debug career tags error", err);
        });
    }

    const handleTagsData = async (data) => {
        console.log('debug badge popper tags data:', data)

        if ( data.action == 'select' ) {
            dataServicePrivate('POST', 'hr/careers/entity/tag', { id: data.id, tags_id: data.data_id }).then((result) => {
                console.log("debug update career tag", result.data);
                getInit();
            }, (err) => {
                console.log("debug update career tag error", err);
            });
        }

        if ( data.action == 'add' || data.action == 'edit' ) {
            dataServicePrivate('POST', 'hr/careers/tags/define', data).then((result) => {
                console.log("debug define tag", result.data);
                getTags();
            }, (err) => {
                console.log("debug define tag error", err);
            });
        }

        if ( data.action == 'delete' ) {
            setConfirmModal(true)
            setIdDelete(data.id)
            setContentURL('hr/careers/tags/delete')
            setConfirmContent('Are you sure to Delete this Tag?')
        }

    }

    const handlePlatformData = (data) => {
        console.log('debug handle platform data:', data);

        if ( data.action == 'select' ) {
            dataServicePrivate('POST', 'hr/careers/entity/define', { id: data.id, platforms_id: data.data_id }).then((result) => {
                console.log("debug update career platform", result.data);
                getInit();
            }, (err) => {
                console.log("debug update career platform error", err);
            });
        }

        if ( data.action == 'add' || data.action == 'edit' ) {
            dataServicePrivate('POST', 'hr/careers/platform/define', data).then((result) => {
                console.log("debug define platform", result.data);
                getPlatforms()
            }, (err) => {
                console.log("debug define platform error", err);
            });

        } 

        if (data.action == 'delete') {
            setConfirmModal(true)
            setIdDelete(data.id)
            setContentURL('hr/careers/platform/delete')
            setConfirmContent('Are you sure to Delete this Plaform?')
        }

    }

    const handleDeleteData = (data) => {
        if (data) {
            dataServicePrivate('POST', contentURL, {id: idDelete}).then((result) => {
                console.log("debug delete", result.data);
                getPlatforms()
                getTags()
                getInit()
                setConfirmModal(false)
            }, (err) => {
                console.log("debug delete error", err);
            });
        }
    }

    function formatPhoneNumber(data) {
        var cleaned = ('' + data).replace(/\\D/g, '');
        var match = cleaned.match(/(\d{4})(\d{3})(\d{4})/);
        return match ? match[1] + '-' + match[2] + '-' + match[3] : 'Invalid Number'
    }

    useEffect(() => {
        var rows = []
        Object.keys(recruit).map((key) => {
            rows.push(
                {
                    full_name: recruit[key]['entity'].full_name,
                    email: recruit[key]['entity'].email,
                    career: recruit[key]['careers'].title,
                    number: recruit[key]['entity'].contact_number,
                    alternative: recruit[key]['entity'].alternative_number,
                    platforms_id: recruit[key]['platforms']?.id,
                    applied: formatDateTime(recruit[key].created_at, 'MMM DD, YYYY HH:mm:ss'),
                    entity_careers_id: recruit[key].id,
                    tags_id: recruit[key]['tags']?.id,
                    actions: (
                        <MDBox>
                            <Grid container spacing={.5}>
                                <Grid item>
                                    <MDButton onClick={() => formHandle(recruit[key]['entity'].id, recruit[key]['careers'].id)} color='secondary'>View</MDButton>
                                </Grid> 
                                {/* <Grid item>
                                    <MDButton color='primary'>Download</MDButton>
                                </Grid>  */}
                                <Grid item>
                                    <MDButton onClick={() => handleDeleteRecruit(recruit[key].id)} color='error'>Delete</MDButton>
                                </Grid> 
                            </Grid>
                        </MDBox>
                    )
                }
            )
        })

        if (rows) setRows(rows)

    },[recruit, tags, platforms])

    const DateRangeFilterFN = (rows, id, filterValues) => {
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

    const DateRangeFilterColumnFN = ({
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

        // var exMoment = moment().startOf('day').toDate()
        // var exFns = startOfDay(new Date())
        // console.log('date comparison', exMoment, exFns );

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

    const PlatformFilterColumnFN = ({ column: { filterValue, setFilter, id } }) => (
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

    const TagsFilterColumnFN = ({ column: { filterValue, setFilter, id } }) => (
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

    const columns = [
        { Header: "name", accessor: (row) => `${row.full_name} ${row.email}`, id: 'name', Cell: ({row}) => (
            <Employee image={team3} name={row.original.full_name} email={row.original.email} />
        ), align: "left", sort: true },
        { Header: "contact number", accessor: "number", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {formatPhoneNumber(value)}
            </MDTypography>
        ), align: "left", sort: true },
        { Header: "alternative number", accessor: "alternative", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {formatPhoneNumber(value)}
            </MDTypography>
        ), align: "left", sort: true },
        { Header: "position applied", accessor: "career", Cell: ({value}) => (<Career title={value} />), align: "left", sort: true},
        { Header: "source", accessor: (row) => (
            platforms[Object.keys(platforms).find(key => platforms[key].id == row.platforms_id)]?.title || 'unassigned' 
        ), id: "platform", align: "center", sort: true, Cell: ({row}) => {
            return (<BadgePopper
                id={row.original.entity_careers_id}
                badgeId={row.original.platforms_id} 
                variant="customGradient" 
                content={platforms}
                data={handlePlatformData}
                editable={true}
                deletable={true}
            />)
        }, Filter: PlatformFilterColumnFN},
        { Header: "applied date", accessor: "applied", align: "center", Cell: ({value}) => (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {value}
            </MDTypography>
        ), Filter: DateRangeFilterColumnFN, filter: DateRangeFilterFN, sort: true},
        { Header: 'status', accessor: (row) => (
            tags[Object.keys(tags).find(key => tags[key].id == row.tags_id)]?.title || 'unassigned' 
        ), id: 'status', align: "center", sort: true, Cell: ({row}) => {
            return (<BadgePopper
                id={row.original.entity_careers_id}
                badgeId={row.original.tags_id} 
                variant="customGradient" 
                content={tags}
                data={handleTagsData}
                editable={true}
                deletable={true}
            />)
        }, Filter: TagsFilterColumnFN},
        { Header: "actions", accessor: "actions", align: "center", disableFilters: true, disableGlobalFilter: true },
    ]

    const Employee = ({ image, name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                {name}
                </MDTypography>
                <MDTypography variant="caption">{email}</MDTypography>
            </MDBox>
        </MDBox>
    );

    const Career = ({ title }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
                {title}
            </MDTypography>
        </MDBox>
    );

    const handleDeleteRecruit = (id) => {
        setIdDelete(id)
        setContentURL('hr/careers/entity/delete')
        setConfirmContent('Are you sure to Delete this Candidate?')
        setConfirmModal(true)
    }

    const handleDataModal = (e) => {
        console.log('debug handle data modal', e, selectedTag)

        if (e) {
            if (selectedTag) {
                getRecruit({
                    'filter': [
                        {
                            target: 'tags',
                            operator: '=',
                            value: selectedTag != 'null' ? selectedTag : null
                        }
                    ]
                })
            } else {
                getInit()
            }
            
        }

        handleCloseModal()
    }

    const handleDebugPicker = (e) => {
        console.log('debug color picker:', e);
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                Recruit
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                            <DataTable
                                table={{ columns, rows }}
                                showTotalEntries
                                entriesPerPage
                                noEndBorder
                                canSearch
                            />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
            { filterModal && <FilterDialog closeModal={handleCloseModal} title='Select Tag' content={(
                <MDBox display='flex' justifyContent='center' alignItems='center'>
                    <FormControl sx={{ mt: 1 }}>
                        <InputLabel>Tags</InputLabel>
                        <Select
                            label='Tags'
                            value={selectedTag != null ? selectedTag : 'Unassigned'}
                            defaultValue='0'
                            autoWidth
                            sx={{ height: "44px", textTransform: 'capitalize'  }}
                            onChange={(e) => setSelectedTag(e.target.value)}
                        >
                            <MenuItem value='0'>No Filter</MenuItem>
                            <MenuItem value='null'>Unassigned</MenuItem>
                            {
                                tags && Object.keys(tags).map((item, key) => (
                                    <MenuItem key={key} value={tags[item]['id']} sx={{ textTransform: 'capitalize' }}>{tags[item]['title']}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </MDBox>
            )} data={handleDataModal} /> }

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle textAlign='center' sx={{ m: 0, p: 2 }}>
                    Application
                </DialogTitle>
                <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'grey.500',
                }}
                >
                    <Icon>close</Icon>
                </IconButton>
                <DialogContent>
                    {content}
                </DialogContent>
            </Dialog>

            { confirmModal && <ConfirmDialog closeModal={() => setConfirmModal(false)} title='Confirm Delete' content={confirmContent} data={handleDeleteData} /> }
        </DashboardLayout>
    );
}

export default Employee;