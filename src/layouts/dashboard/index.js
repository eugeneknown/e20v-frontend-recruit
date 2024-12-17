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
  console.log('autgh', auth);
  const [ weeklyReport, setWeeklyReport ] = useState()
  const [ monthlyReport, setMonthlyReport ] = useState({})
  const [ tagsMonthlyReport, setTagsMonthlyReport ] = useState({})
  const [ rows, setRows ] = useState()

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

    getUsers();
    weeklyReportSequence()
    monthlyReportSequence()
    tagsReportSequence()

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  const getRecruitData = async (data) => {
    return await axiosPrivate.post('hr/careers/entity/report', data)
  }

  const getTagsData = async (data) => {
    return await axiosPrivate.post('hr/careers/tags/all', data)
  }

  var weekStart = moment().startOf('week')
  var weekEnd = moment().endOf('week')
  // var weekStart = moment('2024-10-14T16:00:00.000Z')
  // var weekEnd = moment('2024-10-18T15:59:59.999Z')

  const weeklyReportSequence = () => {
    // console.log('debug report data:', data)

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
      console.log('weekly report data:', result.data)
      result = result.data['entity_career']

      var dataSeries = []
      // platform
      dataServicePrivate('POST', 'hr/careers/platform/all', {}).then((result) => {
        console.log('debug plaform result', result);
        result = result.data['career_platforms']
        for (i in result) {
          dataSeries.push({
            'dataKey': result[i]['id'],
            'label': result[i]['title'],
            'color': result[i]['color'],
          })
        }

      }).catch((err) => {
        console.log('debug plaform error result', err);

      })

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

      console.log('debug report data array:', dataSets, dataSeries)
      setWeeklyReport({ dataSets, dataSeries })
    }).catch((err) => {
      console.log('weekly report error data:', err)
    })

    // console.log('debug report:', formatDateTime(weekStart, 'dddd, MM DD YYYY, HH:mm:ss'), formatDateTime(weekEnd, 'dddd, MM DD YYYY, HH:mm:ss'))
    // console.log('debug report:', weekEnd.diff(weekStart, 'days'))
  }

  const monthlyReportSequence = () => {
    var monthStart = moment().startOf('year')
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
      date: {
        target: 'created_at',
        operator: 'month',
        value: 'id',
      },
    }).then((result) => {
      console.log('monthly recruit data:', result.data)
      result = result.data['entity_career']

      var monthCounts = {}
      for (var i=0; i<result.length; i++) {
        var getMonth = moment(result[i].date).month()
        // console.log('debug get month:', getMonth)
        if ( monthCounts[getMonth] == undefined ) {
          monthCounts[getMonth] = result[i].count
        } else {
          monthCounts[getMonth] += result[i].count
        }
      }
      // console.log('debug per month counts:', monthCounts)

      var labels = []
      var dataArray = []
      for (var i=0; i<=count; i++) {
        labels.push(formatDateTime(moment().set('month', i), 'MMM'))

        if ( monthCounts[i] == undefined ) {
          dataArray.push(0)
        } else {
          dataArray.push(monthCounts[i])
        }
      }
      // console.log('debug data array:', dataArray)

      setMonthlyReport({
        labels,
        datasets: {
          label: 'Total count',
          data: dataArray,
        }
      })
    }).catch((err) => {
      console.log('monthly recruit error data:', err)
    })
  }

  const tagsReportSequence = () => {
    var monthStart = moment().startOf('year')
    var currentMonth = moment().set('month', moment().month())
    var count = currentMonth.diff(monthStart, 'month')

    console.log('debug monthly report:', formatDateTime(monthStart), formatDateTime(currentMonth),  count)

    getRecruitData({
      filter: [
        {
          target: 'created_at',
          operator: 'range',
          value: [monthStart, currentMonth],
        }
      ],
      tags: {},
    }).then((result) => {
      console.log('monthly tags recruit data:', result.data)
      result = result.data['entity_career']

      var total = 0
      for (var i=0; i<result.length; i++) {
        total += result[i].count
      }

      getTagsData({}).then((_result) => {
        console.log('debug tags data', _result.data)
        _result = _result.data['career_tags']
        _result.unshift({
          id: 0,
          title: 'Unassigned',
          color: 'light_grey',
        })

        var labels = []
        var dataArray = []
        var bgColor = []

        var row = []
        for (var i=0; i<_result.length; i++) {

          for (var j=0; j<result.length; j++) {
            if ( result[j].tag_id == _result[i].id ) {
              labels.push(_result[i].title)
              dataArray.push(result[j].count)
              bgColor.push(_result[i].color)
              row.push({
                tags: (
                  <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {_result[i].title}
                  </MDTypography>
                ),
                total: (
                  <MDTypography variant="caption" color="text" fontWeight="medium">
                    {result[j].count}
                  </MDTypography>
                ),
                percentage: <Progress color={_result[i].color} value={Math.round((result[j].count/total)*100).toFixed(2)} />,
              })
              break
            }

            if (j+1==result.length) {
              labels.push(_result[i].title)
              dataArray.push(0)
              bgColor.push(_result[i].color)
              row.push({
                tags: (
                  <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
                    {_result[i].title}
                  </MDTypography>
                ),
                total: (
                  <MDTypography variant="caption" color="text" fontWeight="medium">
                    {0}
                  </MDTypography>
                ),
                percentage: <Progress color={_result[i].color} value={0/total*100} />,
              })
            }
          }
        }
        console.log('debug data array:', row)

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
        console.log('debug tags err data', err)
      })

      
    }).catch((err) => {
      console.log('monthly tags recruit error data:', err)
    })
  }

  const columns = [
    { Header: "tags", accessor: "tags", width: "45%", align: "left" },
    // { Header: "members", accessor: "members", width: "10%", align: "left" },
    { Header: "total", accessor: "total", align: "center" },
    { Header: "percentage", accessor: "percentage", align: "center" },
  ]

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const randomDate = (start, end, startHour=0, endHour=23) => {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
  }

  const addRandomShit = async () => {
    console.log('debug:', columns, rows)

    // for ( var i=0; i<50; i++ ) {
    //   var created_at = formatDateTime(randomDate(new Date(2023, 12, 1), new Date()))
    //   var careers_id = randomNumber(1, 13)
    //   var entity_id = randomNumber(1, 18)
    //   var tags_id = randomNumber(1, 6)
    //   // console.log('random shit:', randomNumber(1, 16),  formatDateTime(created_at))

    //   await axiosPrivate.post('hr/careers/entity/define', {
    //     careers_id,
    //     entity_id,
    //     tags_id,
    //     created_at
    //   }).then((result) => {
    //     console.log("debug update career tag", result.data);
    //   }, (err) => {
    //     console.log("debug update career tag error", err);
    //   });
    // }

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

  // const fileUpload = async (data) => {
  //   return await axiosPrivate.post('files/files/upload', data, { 
  //     headers: { 
  //       "Content-Type": "multipart/form-data",
  //     } 
  //   })
  // }

  // const upload = (file) => {
  //   let formData = new FormData();

  //   formData.append("file", file);
  //   formData.append("group", 'hr');
  //   formData.append("type", file['type']);

  //   console.log('debug upload file', file, formData)

  //   fileUpload(formData)
  // }

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
        {/* <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<Icon >cloudupload</Icon>}
        >
          Upload file
          <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} />
        </Button> */}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <MDButton onClick={addRandomShit}>Add Random Shit</MDButton> // comment this out
              <ComplexStatisticsCard
                icon="person_add"
                title="Today's Applicants"
                count="2,300"
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
                title="Shortlisted"
                count={281}
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
                title="Job Offer"
                count="34k"
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
                color="error"
                icon="person_minus"
                title="Rejected"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid> */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <MDBox mb={3}>
              <Card sx={{ height: "100%" }}>
                <MDBox padding="1rem">
                  {
                    weeklyReport &&
                    // console.log(weeklyReport)
                    <BarChart
                      dataset={weeklyReport['dataSets']}
                      xAxis={[{
                        scaleType: 'band',
                        dataKey: 'date',
                        tickPlacement: 'middle',
                        valueFormatter: (value, context) => {
                          // console.log('debug value formatter:', value, context);
                          if ( context.location == 'tick' ) {
                            // return `${formatDateTime(value, 'MMM DD')} \n${formatDateTime(value, 'ddd')}`
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
                          // console.log('debug top axis value formatter', value, context);
                          // if ( context.location == 'tick' ) {
                          //   var total = weeklyReport['dataSets'].find((item) => item.date == value).total
                          //   // console.log('debug top axis value formatter get total', total);
                          //   return `Total: ${total}`
                          // }

                          if (context.location == 'tick') {
                            return `${formatDateTime(value, 'ddd')}`
                          }
                        }
                      }}
                      yAxis={[{
                        valueFormatter: (value, context) => {
                          // console.log('debug bar yaxis', value, index)
                        }
                      }]}
                      // barLabel={(item, context) => {
                      //   // console.log('debug bar label', item, context);
                      //   var total = weeklyReport['dataSets'][item.dataIndex].total
                      //   var percentage = Math.round((item.value/total)*100)
                      //   return context.bar.height < 60 || context.bar.width < 30 ? null : `${percentage}%`
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
                        Object.keys(weeklyReport['dataSeries']).map((item, key) => {
                          // console.log('debug series data', item, key, weeklyReport);
                          var series = {
                            ...weeklyReport['dataSeries'][item],
                            valueFormatter: (value, context) => {
                              // console.log('debug series value formatter:', value, context);
                              var total = weeklyReport['dataSets'][context.dataIndex].total
                              var percentage = total != 0 ? Math.round((value/total)*100) : 0
                              // return `Total ${value} -> ${percentage}%`
                              return `${percentage}%`
                            }
                          }
                          console.log('series data', series);
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
            {/* <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Monthly Tracker"
                  description="Applicant count per month in year"
                  date="updated 4 min ago"
                  chart={monthlyReport}
                />
              </MDBox>
            </Grid> */}
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
