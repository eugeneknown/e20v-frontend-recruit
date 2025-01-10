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

import { useEffect, useState } from "react";
import { axiosPrivate } from "api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import PolarChart from "examples/Charts/PolarChart";
import RadarChart from "examples/Charts/RadarChart";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";
import MDTypography from "components/MDTypography";
import { Card, colors, Paper } from "@mui/material";
import { dataServicePrivate } from "global/function";
import useAuth from "hooks/useAuth";


function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const { auth } = useAuth()
  const [ weeklyReport, setWeeklyReport ] = useState()
  const [ monthlyReport, setMonthlyReport ] = useState()
  const [ tagsMonthlyReport, setTagsMonthlyReport ] = useState({})
  const [ rows, setRows ] = useState()
  const [ tags, setTags ] = useState()
  const [ tagsCount, setTagsCount ] = useState()
  const [ total, setTotal ] = useState()
  const [ platforms, setPlatforms ] = useState()
  const [ platformDataSeries, SetPlatformDataSeries ] = useState()

  const navigate = useNavigate();
  const location = useLocation();

  const formatDateTime = ( date='', output = 'YYYY-MM-DD HH:mm:ss') => {
    return moment( date ).format( output );
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
  
  const weeklyReportSequence = () => {
    // var weekStart = moment('2024-10-14T16:00:00.000Z')
    // var weekEnd = moment('2024-10-18T15:59:59.999Z')
    var weekStart = moment().startOf('week')
    var weekEnd = moment().endOf('week')

    var count = weekEnd.diff(weekStart, 'days')
    // console.log('debug moment week:', weekStart, weekEnd, count);

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
    var monthStart = moment().startOf('year').subtract(1, 'year')
    var currentMonth = moment().set('month', moment().month())
    var count = currentMonth.diff(monthStart, 'month')
    
    // console.log('debug monthly report:', formatDateTime(monthStart), formatDateTime(currentMonth),  count)
    
    getRecruitData({
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: [monthStart, currentMonth],
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
  
  const tagsReportSequence = () => {
    var monthStart = moment().startOf('year').subtract(1, 'year')
    var currentMonth = moment().set('month', moment().month())
    var count = currentMonth.diff(monthStart, 'month')
    
    console.log('debug monthly report:', formatDateTime(monthStart), formatDateTime(currentMonth),  count)
    
    getRecruitData({
      filter: [
        {
          target: 'updated_at',
          operator: 'range',
          value: [monthStart, currentMonth],
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

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const chartSetting = {
    height: '100%',
  };

  const valueFormatter = (value, index) => {
    console.log('debug chart top value', value, index);
  };

  const weeklyLabels = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"]

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
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person_add"
                title="Shortlisted"
                count={tagsCount && dailyTagsFinder('Shortlisted').count}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="Initial Interview"
                count={tagsCount && dailyTagsFinder('Initial Interview').count}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="No Show Initial Interview"
                count={tagsCount && dailyTagsFinder('No Show Initial Interview').count}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="work"
                title="Final Interview"
                count={tagsCount && dailyTagsFinder('Final Interview').count}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="work"
                title="No Show Final Interview"
                count={tagsCount && dailyTagsFinder('No Show Final Interview').count}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="person_add"
              title="Job Offer"
              count={tagsCount && dailyTagsFinder('Job Offer').count}
              percentage={{
                color: "success",
                amount: "+3%",
                label: "than yesterday",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="person_minus"
                title="Hired"
                count={tagsCount && dailyTagsFinder('Hired').count}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <MDBox mb={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem">
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
                            position: { vertical: 'bottom' },
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
                            // console.log('debug series data', item, key, weeklyReport);
                            var series = {
                              ...platformDataSeries[item],
                              valueFormatter: (value, context) => {
                                // console.log('debug series value formatter:', value, context);
                                var total = weeklyReport[context.dataIndex].total
                                var percentage = total != 0 ? Math.round((value/total)*100) : 0
                                // return `Total ${value} -> ${percentage}%`
                                return `${percentage}%`
                              }
                            }
                            // console.log('series data', series);
                            return series
                          })
                        }
                        height={300}
                        margin={{ bottom: 70 }}
                      />
                    }
                    <MDBox pt={3} pb={1} px={1}>
                      <MDTypography variant="h6" textTransform="capitalize">
                        Weekly Tracker
                      </MDTypography>
                      <MDTypography component="div" variant="button" color="text" fontWeight="light">
                        Application count per week categorized by platforms.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <PieChart
                  color="dark"
                  title="Monthly Tags Tracker"
                  description="Applicant count per month in year"
                  date="just updated"
                  chart={tagsMonthlyReport}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <Card sx={{ height: "100%" }}>
                  <MDBox padding="1rem">
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
                            position: { vertical: 'bottom' },
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
                                // console.log('debug series value formatter:', value, context);
                                var total = monthlyReport[context.dataIndex].total
                                var percentage = total != 0 ? Math.round((value/total)*100) : 0
                                // return `Total ${value} -> ${percentage}%`
                                return `${percentage}%`
                              }
                            }
                            // console.log('series data', series);
                            return series
                          })
                        }
                        height={300}
                        margin={{ bottom: 70 }}
                      />
                    }
                    <MDBox pt={3} pb={1} px={1}>
                      <MDTypography variant="h6" textTransform="capitalize">
                        Monthly Tracker
                      </MDTypography>
                      <MDTypography component="div" variant="button" color="text" fontWeight="light">
                        Application count per month categorized by platforms.
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
