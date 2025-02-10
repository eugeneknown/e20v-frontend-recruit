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
import { AppBar, Card, Grid2, Paper, Tab, Tabs } from "@mui/material";
import { dataServicePrivate } from "global/function";
import useAuth from "hooks/useAuth";
import colors from "assets/theme/base/colors";
import reportsBarChartData from "../data/reportsBarChartData";
import { formatDateTime } from "global/function";


function Report() {

  const { e20 } = colors

  const { auth } = useAuth()
  const [report, setReport] = useState({ start: moment().subtract(30, 'days').startOf('day'), end: moment().endOf('day') })
  const [reportBy, SetReportBy] = useState('day')
  // const [ monthStart, setMonthStart ] = useState(moment().startOf('year'))
  // const [ monthEnd, setMonthEnd ] = useState(moment().endOf('year'))

  const [step, setStep] = useState(0)

  const navigate = useNavigate();
  const location = useLocation();

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

    initReport()

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [])

  const initReport = () => {
    console.log('debug report date range:', formatDateTime(report['start']), formatDateTime(report['end']))
    
    dataServicePrivate('POST', 'hr/careers/entity/report',{
      filter: [
        {
          target: 'updated_at',
          operator: 'range',
          value: [report['start'], report['end']],
        }
      ],
      platforms: {
        target: 'updated_at',
        operator: reportBy,
        value: 'id',
      },
    }).then((result) => {
      console.log('debug report data:', result)
      result = result.data['entity_career']

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

      console.log('debug weekly report datasets', dataSeries, dataSets);
      
    }).catch((err) => {
      console.log('monthly recruit error data:', err)
    })
  }

  var tabs = ['Report', 'Comparison']

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid2 container>
          <Grid2 size={{ xs: 4 }}>
            <AppBar position="static">
                <Tabs value={step} onChange={(e, val) => {setStep(val)}}>
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
        <Card>
          <Grid2 container>
            <Grid2 size={{ xs: 12 }}>
              <Card>
                <MDBox display='flex'>
                  <MDBox display='flex'>
                    platforms
                    tags
                  </MDBox>
                  <MDBox display='flex'>
                    date filter
                    filter by day, week, month, quarter, or year
                  </MDBox>
                </MDBox>
              </Card>
              bar graph
            </Grid2>
          </Grid2>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Report;
