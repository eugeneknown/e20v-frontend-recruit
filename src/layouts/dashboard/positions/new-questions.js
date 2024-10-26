import { Dialog, Icon, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { dataServicePrivate } from "global/function";
import { useEffect, useMemo, useState } from "react";
import { useTable, useGlobalFilter } from "react-table";
import { useMaterialUIController } from "context";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


function DragQuestions ({
    id,
    section,
    onClose,
}) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const [open, setOpen] = useState(false)
    const [questions, setQuestions] = useState({})
    const [row, setRow] = useState([])
    const [tab, setTab] = useState('0')

    const handleClose = () => {
        setOpen(false)
        onClose(true)
    }

    useEffect(() => {
        console.log('debug questions init', id, section);
    },[])

    const init = () => {
        getHasQuestions()
        setOpen(true)
    }

    const getHasQuestions = () => {
        dataServicePrivate('POST', 'hr/careers/has/questions/all', {
            careers_id: id,
            relations: ['questions'],
            // filter: {
            //     target: 'section',
            //     operator: '=',
            //     value: section,
            // }
        }).then((result) => {
            console.log('debug has questions data:', result);
            var questions = result.data['career_questions']
            setQuestions(questions)
        }).catch((err) => {
            console.log('debug has questions error data:', err);
    
        })
    }

    useEffect(() => {
        var row = []

        Object.keys(questions).map((item, index) => {
            if ( section == questions[item].section ) {
                row.push({
                    id: questions[item].id+'',
                    data: questions[item], 
                    order: (
                        <MDBox><Icon fontSize="lg">reorder</Icon></MDBox>
                    ),
                    title: (
                        <MDTypography display="block" variant="button" fontWeight="medium">
                            {questions[item]['questions'].title}
                        </MDTypography>
                    ),
                })
            }
        })

        console.log('debug row init', row);
        setRow(row)
    },[questions])

    const columns = [
        { Header: "", accessor: "order", width: "5%", align: "left" },
        { Header: "title", accessor: "title", width: "45%", align: "left" },
        // { Header: "actions", accessor: "actions", align: "center" },
    ]

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightgreen" : "inherit",
    });

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: "none",
        background: isDragging ? "lightblue" : "inherit",
        ...draggableStyle
    });

    const onDragEnd = (result) => {
        console.log('debug drag data', result);
        console.log('debug drag row data', row);
        console.log('debug drag question data', questions);
        // dropped outside the list
        if (!result.destination) {
            return;
        }
      
        if (result.destination.index === result.source.index) {
            return;
        }

        var from = result.source.index
        var to = result.destination.index
        var from_data = row[from]

        dataServicePrivate('POST', 'hr/careers/has/questions/move', {
            from,
            to,
            row,
        }).then((result) => {
            console.log('debug has questions define FROM data:', result);
        }).catch((err) => {
            console.log('debug has questions define FROM data:', err);
        })

        const tempRow = row

        tempRow.splice(from, 1)
        tempRow.splice(to, 0, from_data)
    
    };

    const DataTableHeadCell = ({width, children, align}) => (
        <MDBox
            component="th"
            width={width}
            py={1.5}
            px={3}
            sx={({ palette: { light }, borders: { borderWidth } }) => ({
                borderBottom: `${borderWidth[1]} solid ${light.main}`,
            })}
        >
            <MDBox
                position="relative"
                textAlign={align}
                color={darkMode ? "white" : "secondary"}
                opacity={0.7}
                sx={({ typography: { size, fontWeightBold } }) => ({
                fontSize: size.xxs,
                fontWeight: fontWeightBold,
                textTransform: "uppercase",
                })}
            >
                {children}
            </MDBox>
        </MDBox>
    )

    const DataTableBodyCell = ({align, children}) => (
        <MDBox
            component="td"
            textAlign={align ? align : 'left'}
            py={1.5}
            px={3}
            sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
                fontSize: size.sm,
                borderBottom: `${borderWidth[1]} solid ${light.main}`,
            })}
            >
            <MDBox
                display="inline-block"
                width="max-content"
                color="text"
                sx={{ verticalAlign: "middle" }}
            >
                {children}
            </MDBox>
        </MDBox>
    )

    return (
        <MDBox>
            <MDBox>
                <MDButton onClick={init} variant="outlined" size="large" fullWidth color='warning'>Move Questions</MDButton>
            </MDBox>
            <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            scroll='body'
            fullWidth
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Table>
                        <MDBox component="thead">
                            <TableRow>
                            {columns.map((column, idx) => (
                                <DataTableHeadCell
                                key={idx}
                                width={column.width ? column.width : "auto"}
                                align={column.align ? column.align : "left"}
                                >
                                {column.Header}
                                </DataTableHeadCell>
                            ))}
                            </TableRow>
                        </MDBox>
                        <Droppable droppableId='drappable' direction="vertical">
                        {(provided, snapshot) => (
                            <TableBody
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            >
                            {row.map((item, index) => (
                                <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                >
                                {(provided, snapshot) => (
                                    <TableRow
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                    >
                                        <DataTableBodyCell align={columns[0].align}>{item.order}</DataTableBodyCell>
                                        <DataTableBodyCell align={columns[1].align}>{item.title}</DataTableBodyCell>
                                    </TableRow>
                                )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            </TableBody>
                        )}
                        </Droppable>
                    </Table>
                </DragDropContext>
            </Dialog>
        </MDBox>

        
    )

}

export default DragQuestions;