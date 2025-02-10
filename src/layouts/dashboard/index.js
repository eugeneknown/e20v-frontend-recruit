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

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useCallback, useEffect, useMemo, useState } from "react";
import { axiosPrivate } from "api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import PolarChart from "examples/Charts/PolarChart";
import RadarChart from "examples/Charts/RadarChart";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";
import { Card, colors, FormControl, IconButton, MenuItem, Paper, Select, Tooltip } from "@mui/material";
import { dataServicePrivate } from "global/function";
import useAuth from "hooks/useAuth";
import { formatDateTime } from "global/function";


function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const { auth } = useAuth()
  const [ weeklyReport, setWeeklyReport ] = useState()
  const [ monthlyReport, setMonthlyReport ] = useState()
  const [ tagsMonthlyReport, setTagsMonthlyReport ] = useState({})
  const [ rows, setRows ] = useState()
  const [ tags, setTags ] = useState()
  const [ tagsCount, setTagsCount ] = useState()
  const [ total, setTotal ] = useState(0)
  const [ platforms, setPlatforms ] = useState()
  const [ platformDataSeries, SetPlatformDataSeries ] = useState()

  const [ weekStart, setWeekStart ] = useState(moment().startOf('week'))
  const [ weekEnd, setWeekEnd ] = useState(moment().endOf('week'))
  const [ disabledWeek, setDisabledWeek ] = useState(false)


  const [ monthStart, setMonthStart ] = useState(moment().startOf('year'))
  const [ monthEnd, setMonthEnd ] = useState(moment().endOf('year'))
  const [ disabledMonth, setDisabledMonth ] = useState(false)

  const [ tagStart, setTagStart ] = useState(moment().startOf('year'))
  const [ tagEnd, setTagEnd ] = useState(moment().endOf('year'))
  const [ disabledTag, setDisabledTag ] = useState(false)

  const years = useMemo(() => {
    var years = []
    var now = Number(formatDateTime(moment(), 'YYYY'))
    for ( var i=now; i>=now-50; i-- ) {
      years.push(i)
    }
    return years
  },[])

  const navigate = useNavigate();
  const location = useLocation();

  // const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
  //   return moment( date ).format( output );
  // }

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

    getPlatformsData()
    totalApplicants()
    getTagsData()
    dailyTagsReport()
    getUsers();
    tagsReportSequence()

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  const getRecruitData = async (data) => {
    return await axiosPrivate.post('hr/careers/entity/report', data)
  }

  const getTagsData = () => {
    dataServicePrivate('POST', 'hr/careers/tags/all', {}).then((result) => {
      console.log('debug tags result', result);
      result = result.data['career_tags']
      setTags(result)
    }).catch((err) => {
      console.log('debug tags error result', err);
      
    })
  }
  
  const totalApplicants = () => {
    dataServicePrivate('POST', 'hr/careers/entity/all', {
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: [moment().startOf('day'), moment().endOf('day')],
        }
      ],
    }).then((result) => {
      console.log('debug total applicants result', result);
      result = result.data['entity_career']
      setTotal(Object.keys(result).length)
    }).catch((err) => {
      console.log('debug total applicants error result', err);

    })
  }

  const getPlatformsData = () => {
    dataServicePrivate('POST', 'hr/careers/platform/all', {}).then((result) => {
      console.log('debug plaform result', result);
      result = result.data['career_platforms']
      setPlatforms(result)

      var dataSeries = []
      for (let i in result) {
        dataSeries.push({
          'dataKey': result[i]['id'],
          'label': result[i]['title'],
          'color': result[i]['color'],
        })
      }
      SetPlatformDataSeries(dataSeries)

    }).catch((err) => {
      console.log('debug plaform error result', err);

    })
  }

  useEffect(() => {
    if (platformDataSeries) {
      weeklyReportSequence()
      monthlyReportSequence()
    }
  },[platformDataSeries])

  useEffect(() => {
    if (platformDataSeries) weeklyReportSequence()
    setDisabledWeek(moment().startOf('week').add(1, 'week') <= moment(weekStart).startOf('week').add(1, 'week'))
  },[weekStart, weekEnd])

  useEffect(() => {
    if (platformDataSeries) monthlyReportSequence()
    setDisabledMonth(moment().startOf('year').add(1, 'year') <= moment(monthStart).startOf('year').add(1, 'year'))
  },[monthStart, monthEnd])

  const handleNextWeek = () => {
    console.log('next week', formatDateTime(weekStart), formatDateTime(weekEnd));
    setWeekStart(moment(weekStart).startOf('week').add(1, 'week'))
    setWeekEnd(moment(weekEnd).endOf('week').add(1, 'week'))
  }
  const handlePrevWeek = () => {
    console.log('prev week', weekStart, weekEnd);
    setWeekStart(moment(weekStart).startOf('week').subtract(1, 'week'))
    setWeekEnd(moment(weekEnd).endOf('week').subtract(1, 'week'))
  }
  const handleThisWeek = () => {
    setWeekStart(moment().startOf('week'))
    setWeekEnd(moment().endOf('week'))
  }
  const handleWeekYear = (e) => {
    console.log('week year', e);
    setWeekStart(moment(weekStart).year(e.target.value).startOf('week'))
    setWeekEnd(moment(weekStart).year(e.target.value).endOf('week'))
  }

  const handleNextMonth = () => {
    console.log('next month', formatDateTime(monthStart), formatDateTime(monthEnd));
    setMonthStart(moment(monthStart).startOf('year').add(1, 'year'))
    setMonthEnd(moment(monthStart).endOf('year').add(1, 'year'))
  }
  const handlePrevMonth = () => {
    console.log('prev month', monthStart, monthEnd);
    setMonthStart(moment(monthStart).startOf('year').subtract(1, 'year'))
    setMonthEnd(moment(monthStart).endOf('year').subtract(1, 'year'))
  }
  const handleThisMonth = () => {
    setMonthStart(moment().startOf('year'))
    setMonthEnd(moment().endOf('year'))
  }
  const handleMonthYear = (e) => {
    console.log('month year', e);
    setMonthStart(moment(monthStart).year(e.target.value).startOf('year'))
    setMonthEnd(moment(monthStart).year(e.target.value).endOf('year'))
  }
  
  const weeklyReportSequence = () => {
    var count = weekEnd.diff(weekStart, 'days')
    console.log('debug moment week:', weekStart, weekEnd, count);

    getRecruitData({
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: [weekStart, weekEnd],
        }
      ],
      platforms: {
        target: 'created_at',
        operator: 'day',
        value: 'id',
      },
    }).then((result) => {
      console.log('weekly report data:', result)
      result = result.data['entity_career']

      var dataSets = []
      var tempDataSet = {}
      var totalCount = 0

      for ( var i=0; i<=count; i++ ) {
        weekStart.add(i, 'd')
        // console.log('debug report:', formatDateTime(weekStart))

        tempDataSet['date'] = formatDateTime(weekStart, 'MMMM DD YYYY')
        Object.keys(result).map((item, key) => {
          // console.log('debug report format:', formatDateTime(moment(result[item]['date'])))
          if (weekStart.isSame(result[item]['date'], 'day')) {
            // console.log('debug report success:', data[item])
            tempDataSet[result[item]['platform_id']] = result[item]['count']
            totalCount += result[item]['count']

            delete result[item]
          }
        })

        tempDataSet['total'] = totalCount
        totalCount = 0

        weekStart.subtract(i, 'd')
        dataSets.push(tempDataSet)
        tempDataSet = {}
      }

      console.log('debug report data array:', dataSets)
      setWeeklyReport(dataSets)
    }).catch((err) => {
      console.log('weekly report error data:', err)
    })

    // console.log('debug report:', formatDateTime(weekStart, 'dddd, MM DD YYYY, HH:mm:ss'), formatDateTime(weekEnd, 'dddd, MM DD YYYY, HH:mm:ss'))
    // console.log('debug report:', weekEnd.diff(weekStart, 'days'))
  }
  
  const monthlyReportSequence = () => {
    var count = monthEnd.diff(monthStart, 'month')
    
    console.log('debug monthly report:', formatDateTime(monthStart), formatDateTime(monthEnd),  count)
    
    getRecruitData({
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: [monthStart, monthEnd],
        }
      ],
      platforms: {
        target: 'created_at',
        operator: 'month',
        value: 'id',
      },
    }).then((result) => {
      console.log('monthly recruit data:', result)
      result = result.data['entity_career']

      var dataSets = []
      var tempDataSet = {}
      var totalCount = 0
      for ( var i=0; i<=count; i++ ) {
        monthStart.add(i, 'month')
        // console.log('debug report:', formatDateTime(monthStart))

        tempDataSet['date'] = formatDateTime(monthStart, 'MMMM YYYY')
        Object.keys(result).map((item, key) => {
          // console.log('debug report format:', formatDateTime(moment(result[item]['date'])))
          if (monthStart.isSame(result[item]['date'], 'month')) {
            // console.log('debug report success:', data[item])
            tempDataSet[result[item]['platform_id']] = result[item]['count']
            totalCount += result[item]['count']

            // delete result[item]
          }
        })

        tempDataSet['total'] = totalCount
        totalCount = 0

        monthStart.subtract(i, 'month')
        dataSets.push(tempDataSet)
        tempDataSet = {}
      }

      console.log('debug monthly report data array:', dataSets)
      setMonthlyReport(dataSets)
      
    }).catch((err) => {
      console.log('monthly recruit error data:', err)
    })
  }
  
  const dailyTagsReport = () => {
    // var start = moment().startOf('year').subtract(1, 'year')
    // var end = moment().set('month', moment().month())
    var start = moment().startOf('day')
    var end = moment().endOf('day')

    getRecruitData({
      filter: [
        {
          target: 'updated_at',
          operator: 'range',
          value: [start, end],
        }
      ],
      tags: {},
    }).then((result) => {
      console.log('debug daily tags report', result);
      result = result.data['entity_career']

      setTagsCount(result)
    }).catch((err) => {
      console.log('debug daily tags error report', err);
    })
  }

  const dailyTagsFinder = (title) => {
    return tagsCount[Object.keys(tagsCount).find(key => tagsCount[key].title == title)] ?? 0
  }

  useEffect(() => {
    tagsReportSequence()
    setDisabledTag(moment().startOf('year').add(1, 'year') <= moment(tagStart).startOf('year').add(1, 'year'))
  }, [tagStart, tagEnd])

  const handleNextTag = () => {
    console.log('next tag', formatDateTime(tagStart), formatDateTime(tagEnd));
    setTagStart(moment(tagStart).startOf('year').add(1, 'year'))
    setTagEnd(moment(tagStart).endOf('year').add(1, 'year'))
  }
  const handlePrevTag = () => {
    console.log('prev tag', tagStart, tagEnd);
    setTagStart(moment(tagStart).startOf('year').subtract(1, 'year'))
    setTagEnd(moment(tagStart).endOf('year').subtract(1, 'year'))
  }
  const handleThisTag = () => {
    setTagStart(moment().startOf('year'))
    setTagEnd(moment().endOf('year'))
  }
  const handleTagYear = (e) => {
    console.log('tag year', e);
    setTagStart(moment(tagStart).year(e.target.value).startOf('year'))
    setTagEnd(moment(tagStart).year(e.target.value).endOf('year'))
  }
  
  const tagsReportSequence = () => {
    var count = tagEnd.diff(tagStart, 'month')
    console.log('debug monthly tag report:', formatDateTime(tagStart), formatDateTime(tagEnd),  count)
    
    getRecruitData({
      filter: [
        {
          target: 'updated_at',
          operator: 'range',
          value: [tagStart, tagEnd],
        }
      ],
      tags: {},
    }).then((result) => {
      console.log('monthly tags recruit data:', result.data)
      result = result.data['entity_career']

      var total = 0
      if ( result ) {
        for (var i=0; i<result.length; i++) {
          total += result[i].count
        }
      } else {
        total = 1
      }

      result.unshift({
        id: 0,
        title: 'Unassigned',
        color: 'light_grey',
        count: 0,
      })

      var row = []
      var labels = []
      var dataArray = []
      var bgColor = []

      Object.keys(result).map((item, index) => {
        labels.push(result[item].title)
        dataArray.push(result[item].count)
        bgColor.push(result[item].color)
        row.push({
          tags: (
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
              {result[item].title}
            </MDTypography>
          ),
          total: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {result[item].count}
            </MDTypography>
          ),
          percentage: <Progress color={result[item].color} value={Math.round((result[item].count/total)*100).toFixed(2)} />,
        })
      })

      setTagsMonthlyReport({
        labels,
        datasets: {
          label: 'Total count',
          data: dataArray,
          backgroundColors: bgColor,
        }
      })
      setRows(row)

    }).catch((err) => {
      console.log('monthly tags recruit error data:', err)
    })
  }

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="8rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person_add"
                title="Total Applicants"
                count={total}
                // percentage={{
                //   color: "success",
                //   amount: "+3%",
                //   label: "than yesterday",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person_add"
                title="Shortlisted"
                count={tagsCount && dailyTagsFinder('Shortlisted').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "+3%",
                //   label: "than yesterday",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="Initial Interview"
                count={tagsCount && dailyTagsFinder('Initial Interview').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "+55%",
                //   label: "than lask week",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="No Show Initial Interview"
                count={tagsCount && dailyTagsFinder('No Show Initial Interview').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "+55%",
                //   label: "than lask week",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="work"
                title="Final Interview"
                count={tagsCount && dailyTagsFinder('Final Interview').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "+1%",
                //   label: "than yesterday",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="work"
                title="No Show Final Interview"
                count={tagsCount && dailyTagsFinder('No Show Final Interview').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "+1%",
                //   label: "than yesterday",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="person_add"
              title="Job Offer"
              count={tagsCount && dailyTagsFinder('Job Offer').count || 0}
              // percentage={{
              //   color: "success",
              //   amount: "+3%",
              //   label: "than yesterday",
              // }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="person_minus"
                title="Hired"
                count={tagsCount && dailyTagsFinder('Hired').count || 0}
                // percentage={{
                //   color: "success",
                //   amount: "",
                //   label: "Just updated",
                // }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <MDBox mb={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox display='flex' justifyContent='end' alignItems='center' p={1}>
                    <MDBox display='flex' alignItems='center'>
                      <MDTypography variant='button'>Year:</MDTypography>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }} size="small">
                        <Select
                          value={Number(formatDateTime(weekStart, 'YYYY'))}
                          onChange={handleWeekYear}
                        >
                          {Object.keys(years).map((item, index) => (<MenuItem value={years[index]}>{String(years[index])}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </MDBox>
                    <Tooltip title='Previous Week'><IconButton onClick={handlePrevWeek} color="grey.100"><Icon>navigate_before</Icon></IconButton></Tooltip>
                    <Tooltip title='Next Week'><IconButton onClick={handleNextWeek} color="grey.100" disabled={disabledWeek}><Icon>navigate_next</Icon></IconButton></Tooltip>
                    <MDButton onClick={handleThisWeek}>Today</MDButton>
                  </MDBox>
                  <MDBox p="1rem">
                    {
                      weeklyReport && platformDataSeries &&
                      <BarChart
                        dataset={weeklyReport}
                        xAxis={[{
                          scaleType: 'band',
                          dataKey: 'date',
                          tickPlacement: 'middle',
                          valueFormatter: (value, context) => {
                            if ( context.location == 'tick' ) {
                              return `${formatDateTime(value, 'MMM DD')}`
                            } else {
                              return value
                            }
                          },
                        }]}
                        topAxis={{
                          disableLine: true,
                          disableTicks: true,
                          valueFormatter: (value, context) => {
                            if (context.location == 'tick') {
                              return `${formatDateTime(value, 'ddd')}`
                            }
                          }
                        }}
                        slotProps={{
                          legend: {
                            // position: { vertical: 'bottom' },
                            hidden: true,
                          },
                        }}
                        sx={{
                          '& .MuiBarLabel-root': {
                            fill: 'white',
                          },
                        }}
                        series={
                          Object.keys(platformDataSeries).map((item, key) => {
                            // console.log('debug series data', item, key, weeklyReport);
                            var series = {
                              ...platformDataSeries[item],
                              valueFormatter: (value, context) => {
                                // console.log('debug series value weekly formatter:', value, context);
                                if (context.dataIndex >= 0) {
                                  var total = weeklyReport[context.dataIndex].total
                                  var percentage = total != 0 ? Math.round((value/total)*100) : 0
                                  // return `Total ${value} -> ${percentage}%`
                                  return `${percentage}%`
                                }
                              }
                            }
                            // console.log('series data', series);
                            return series
                          })
                        }
                        height={300}
                        // margin={{ bottom: 70 }}
                      />
                    }
                    {platformDataSeries && <CustomLegend series={platformDataSeries} />}
                    <MDBox pt={3} pb={1} px={1}>
                      <MDTypography variant="h6" textTransform="capitalize">Weekly Platform Tracker</MDTypography>
                      <MDTypography component="div" variant="button" color="text" fontWeight="light">
                        Weekly count categorized by platform.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <Card>
                  <MDBox p='1rem'>
                    <MDBox pt={1} px={1}>
                      <MDTypography variant="h6">Monthly Tags Tracker</MDTypography>
                      <MDBox mb={2}>
                        <MDTypography component="div" variant="button" color="text">
                          Applicant count per month in year
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    {console.log('data', tagsMonthlyReport)}
                    <PieChart
                      chart={tagsMonthlyReport}
                    />
                  </MDBox>
                  <MDBox display='flex' justifyContent='end' alignItems='center' p={1}>
                    <MDBox display='flex' alignItems='center'>
                      <MDTypography variant='button'>Year:</MDTypography>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }} size="small">
                        <Select
                          value={Number(formatDateTime(tagStart, 'YYYY'))}
                          onChange={handleTagYear}
                        >
                          {Object.keys(years).map((item, index) => (<MenuItem value={years[index]}>{String(years[index])}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </MDBox>
                    <Tooltip title='Previous Year'><IconButton onClick={handlePrevTag} color="grey.100"><Icon>navigate_before</Icon></IconButton></Tooltip>
                    <Tooltip title='Next Year'><IconButton onClick={handleNextTag} color="grey.100" disabled={disabledTag}><Icon>navigate_next</Icon></IconButton></Tooltip>
                    <MDButton onClick={handleThisTag}>Today</MDButton>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox display='flex' justifyContent='end' alignItems='center' p={1}>
                    <MDBox display='flex' alignItems='center'>
                      <MDTypography variant='button'>Year:</MDTypography>
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }} size="small">
                        <Select
                          value={Number(formatDateTime(monthStart, 'YYYY'))}
                          onChange={handleMonthYear}
                        >
                          {Object.keys(years).map((item, index) => (<MenuItem value={years[index]}>{String(years[index])}</MenuItem>))}
                        </Select>
                      </FormControl>
                    </MDBox>
                    <Tooltip title='Previous Year'><IconButton onClick={handlePrevMonth} color="grey.100"><Icon>navigate_before</Icon></IconButton></Tooltip>
                    <Tooltip title='Next Year'><IconButton onClick={handleNextMonth} color="grey.100" disabled={disabledMonth}><Icon>navigate_next</Icon></IconButton></Tooltip>
                    <MDButton onClick={handleThisMonth}>Today</MDButton>
                  </MDBox>
                  <MDBox p="1rem">
                    {
                      monthlyReport && platformDataSeries &&
                      <BarChart
                        dataset={monthlyReport}
                        xAxis={[{
                          scaleType: 'band',
                          dataKey: 'date',
                          tickPlacement: 'middle',
                          valueFormatter: (value, context) => {
                            if ( context.location == 'tick' ) {
                              return `${formatDateTime(value, 'MMM')}`
                            } else {
                              return value
                            }
                          },
                        }]}
                        // topAxis={{
                        //   disableLine: true,
                        //   disableTicks: true,
                        //   valueFormatter: (value, context) => {
                        //     if (context.location == 'tick') {
                        //       return `${formatDateTime(value, 'ddd')}`
                        //     }
                        //   }
                        // }}
                        slotProps={{
                          legend: {
                            // position: { vertical: 'bottom' },
                            hidden: true,
                          },
                        }}
                        sx={{
                          '& .MuiBarLabel-root': {
                            fill: 'white',
                          },
                          '& .MuiChartsLegend-series text': {
                            fontSize: '1rem!important'
                          }
                        }}
                        series={
                          Object.keys(platformDataSeries).map((item, key) => {
                            // console.log('debug series data', item, key, monthlyReport);
                            var series = {
                              ...platformDataSeries[item],
                              valueFormatter: (value, context) => {
                                // console.log('debug series value monthly formatter:', value, context);
                                if (context.dataIndex >= 0) {
                                  var total = monthlyReport[context.dataIndex].total
                                  var percentage = total != 0 ? Math.round((value/total)*100) : 0
                                  // return `Total ${value} -> ${percentage}%`
                                  return `${percentage}%`
                                }
                              }
                            }
                            // console.log('series data', series);
                            return series
                          })
                        }
                        height={300}
                        // margin={{ bottom: 70 }}
                      />
                    }
                    {platformDataSeries && <CustomLegend series={platformDataSeries} />}
                    <MDBox pt={3} pb={1} px={1}>
                      <MDTypography variant="h6" textTransform="capitalize">Yearly Platform Report</MDTypography>
                      <MDTypography component="div" variant="button" color="text" fontWeight="light">
                        Monthly count categorized by platform for the entire year.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
                {/* <ReportsLineChart
                  color="dark"
                  title="Monthly Tracker"
                  description="Applicant count per month in year"
                  date="updated 4 min ago"
                  chart={monthlyReport}
                /> */}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              { rows && <Projects columns={columns} rows={rows} /> }
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
