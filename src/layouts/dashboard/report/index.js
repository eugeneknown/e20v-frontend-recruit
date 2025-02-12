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
import Icon from "@mui/material/Icon";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ResponsiveChartContainer, BarPlot, ChartsAxis, ChartsYAxis, ChartsXAxis, BarChart } from "@mui/x-charts";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import PieChart from "examples/Charts/PieChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import PolarChart from "examples/Charts/PolarChart";
import RadarChart from "examples/Charts/RadarChart";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";
import { AppBar, Card, Divider, FormControl, Grid2, InputLabel, MenuItem, Paper, Select, Tab, Tabs } from "@mui/material";
import { dataServicePrivate } from "global/function";
import useAuth from "hooks/useAuth";
import colors from "assets/theme/base/colors";
import reportsBarChartData from "../data/reportsBarChartData";
import { formatDateTime } from "global/function";
import configs from "./configs";
import SwipeableViews from "react-swipeable-views";
import DataTable from "examples/Tables/DataTable";


function Report() {

  const { e20 } = colors

  const { auth } = useAuth()
  const [categorize, setCategorize] = useState('report')
  const [report, setReport] = useState()
  const [reportSeries, setReportSeries] = useState('platforms')
  const [reportDate, setReportDate] = useState({ start: moment().startOf('month'), end: moment().endOf('month') })
  const [reportBy, SetReportBy] = useState('day')
  const [isDateRange, setIsDateRange] = useState(false)
  const [dateBy, setDateBy] = useState('currMonth')
  const [reportType, SetReportType] = useState('month')

  const { options } = configs(reportType)
  const [reportProps, setReportProps] = useState({})
  // const [ monthStart, setMonthStart ] = useState(moment().startOf('year'))
  // const [ monthEnd, setMonthEnd ] = useState(moment().endOf('year'))

  const [step, setStep] = useState(0)

  const swipeRef = useRef()
  const handleSwipeHeight = () => {
    setTimeout(() => {
      if (swipeRef) swipeRef.current.updateHeight()
    }, 500);
  }

  const navigate = useNavigate();
  const location = useLocation();

  const byDate = {
    currMonth: {
      label: 'Current Month',
      start: moment().startOf('month'),
      end: moment().endOf('month'),
      by: 'day',
      type: 'month',
    },
    lastMonth: {
      label: 'Last Month',
      start: moment().subtract(1, 'month').startOf('month'),
      end: moment().subtract(1, 'month').endOf('month'),
      by: 'day',
      type: 'month',
    },
    currWeek: {
      label: 'Current Week',
      start: moment().startOf('week'),
      end: moment().endOf('week'),
      by: 'day',
      type: 'week',
    },
    lastWeek: {
      label: 'Last Week',
      start: moment().subtract(1, 'week').startOf('week'),
      end: moment().subtract(1, 'week').endOf('week'),
      by: 'day',
      type: 'week',
    },
    thirtyDays: {
      label: 'Last 30 days',
      start: moment().subtract(30, 'days').startOf('day'),
      end: moment().endOf('day'),
      by: 'day',
      type: 'month',
    },
    ninetyDays: {
      label: 'Last 90 days',
      start: moment().subtract(3, 'month').startOf('month'),
      end: moment().endOf('day'),
      by: 'month',
      type: 'year',
    },
  }

  // {
  //   label: 'Custom Range',
  //   range: setIsDateRange(true),
  // }

  const handleDateBy = (e) => {
    var value = e.target.value
    console.log('date label', value);
    setDateBy(value)
    if (value=='range') {

    } else {
      setReportDate({ start: byDate[value].start, end: byDate[value].end })
      SetReportBy(byDate[value].by)
      SetReportType(byDate[value].type)
    }
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.post('entity/entities/all', {
          signal: controller.signal
        });
        console.log("debug dashboard", response.data);
        isMounted;
      } catch (err) {
        console.error(err);
        navigate('/authentication/sign-in', { state: { from: location }, replace: true });
      }
    }

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  useEffect(() => {
    console.log('debug report date range:', formatDateTime(reportDate['start']), formatDateTime(reportDate['end']))
    
    dataServicePrivate('POST', 'hr/careers/entity/report',{
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: categorize=='report'?[reportDate['start'], reportDate['end']]:reportDate,
        }
      ],
      [reportSeries]: {
        target: 'created_at',
        operator: reportBy,
        value: 'id',
      },
      category: categorize,
    }).then((result) => {
      console.log('debug report data:', result)
      result = result.data['entity_career']

      if ( categorize == 'report' ) {
        var dataSeries = []
        var dataSets = []
  
        for ( var i in result['series'] ) {
          var data = result['series'][i]
          dataSeries.push({
            'dataKey': data['id'],
            'label': data['title'],
            'color': data['color'],
          })
        }
  
        for ( var i in result['sets'] ) {
          var tempData = {}
  
          var data = result['sets'][i]
          tempData['date'] = formatDateTime(i, 'MMMM DD YYYY')
          tempData['total'] = data['total']
          for ( var j in data['data'] ) {
            tempData[data['data'][j]['id']] = data['data'][j].value
          }
  
          dataSets.push(tempData)
        }
  
        if ( reportType == 'week' ) {
          setReportProps({
            topAxis: {
              disableLine: true,
              disableTicks: true,
              valueFormatter: (value, context) => {
                if (context.location == 'tick') {
                  return `${formatDateTime(value, 'ddd')}`
                }
              }
            }
          })
        } else {
          setReportProps({})
        }
  
        console.log('debug weekly report datasets', dataSeries, dataSets);
        setReport({ dataSeries, dataSets })
      }

      if ( categorize == 'comparison' ) {
        var row = []
        Object.keys(result).map((item, index) => {
          row.push({
            title: '',
            result1: '',
            result2: '',
            percent: '',
          })
        })
      }

      handleSwipeHeight()
      
    }).catch((err) => {
      console.log('monthly recruit error data:', err)
    })
  },[reportSeries, reportBy, reportDate])

  useEffect(() => {
    if (categorize == 'report') {

    } else 
    if ( categorize == 'comparison' ) {
      SetReportType(byDate['currMonth'].type)
      setReportDate({
        date1: { start: byDate['lastMonth'].start, end: byDate['lastMonth'].end },
        date2: { start: byDate['currMonth'].start, end: byDate['currMonth'].end },
      })
      SetReportBy(byDate['currMonth'].by)
    }
  },[categorize])

  var tabs = ['Report', 'Comparison']

  const columns = [
    { Header: "report", accessor: "title", align: "left" },
    { Header: "Total Result 1", accessor: "result1", align: "center" },
    { Header: "Total Result 2", accessor: "result2", align: "center" },
    { Header: "%", accessor: "percent", align: "center" },
  ]

  const CustomLegend = ({ series }) => {
    return (
      <MDBox justifyContent='center' flexWrap='wrap' style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {series.map((item, index) => (
          <MDBox key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <MDBox style={{ width: "12px", height: "12px", backgroundColor: item.color, borderRadius: "3px" }} />
            <MDTypography variant='button'>{item.label}</MDTypography>
          </MDBox>
        ))}
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid2 container>
          <Grid2 size={{ xs: 4 }}>
            <AppBar position="static">
                <Tabs value={step} onChange={(e, val) => {setStep(val); setCategorize(String(tabs[val]).toLowerCase())}}>
                  {tabs.map(item => (
                    <Tab
                      label={item}
                      sx={{
                        color: 'black!important',
                        '&.Mui-selected': {
                          color: 'white!important',
                          fontWeight: 'bold',
                          backgroundColor: e20.main,
                        },
                      }}
                    />
                  ))}
                </Tabs>
            </AppBar>
          </Grid2>
        </Grid2>
        <Card sx={{ mt: 2 }}>
          <Grid2 container>
            <Grid2 size={{ xs: 12 }}>
              <MDBox display='flex' p={3}>
                <MDBox display='flex'>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Report By</InputLabel>
                    <Select
                      value={reportSeries}
                      onChange={(e)=>setReportSeries(e.target.value)}
                      autoWidth
                      label="Report By"
                      sx={{ p: 1 }}
                    >
                      <MenuItem value='platforms'>Platforms</MenuItem>
                      <MenuItem value='tags'>Tags</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox display='flex'>
                  <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <Select
                      value={dateBy}
                      onChange={handleDateBy}
                      autoWidth
                      sx={{ p: 1 }}
                    >
                      {Object.keys(byDate).map((item, index) => {
                        return (<MenuItem value={item}>{byDate[item].label}</MenuItem>)
                      })}
                      <Divider />
                      <MenuItem value='range'>Custom Range</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
              </MDBox>
              <SwipeableViews
                index={step}
                animateHeight
                ref={swipeRef}
              >
                <MDBox p='1rem'>
                  {
                    report &&
                    <BarChart
                      dataset={report['dataSets']}
                      {...reportProps}
                      {...options}
                      series={
                        Object.keys(report['dataSeries']).map((item, key) => {
                          // console.log('debug series data', item, key, report);
                          var series = {
                            ...report['dataSeries'][item],
                            valueFormatter: (value, context) => {
                              // console.log('debug series value monthly formatter:', value, context);
                              if (context.dataIndex >= 0) {
                                var total = report['dataSets'][context.dataIndex].total
                                var percentage = total != 0 ? Math.round((value/total)*100) : 0
                                // return `Total ${value} -> ${percentage}%`
                                return `${percentage}%`
                              }
                            }
                          }
                          return series
                        })
                      }
                    />
                  }
                  {report && <CustomLegend series={report['dataSeries']} />}
                </MDBox>
                <MDBox p='1rem'>
                  {/* <DataTable
                    table={{ columns, report }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  /> */}
                </MDBox>
              </SwipeableViews>
            </Grid2>
          </Grid2>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Report;
