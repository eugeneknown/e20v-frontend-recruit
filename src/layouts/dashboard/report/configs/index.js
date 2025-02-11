/**
=========================================================
* Material Dashboard 2  React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { formatDateTime } from "global/function";

function configs(reportType) {
  return {
    options: {
      xAxis: [{
        scaleType: 'band',
        dataKey: 'date',
        tickPlacement: 'middle',
        valueFormatter: (value, context) => {
          if ( context.location == 'tick' ) {
            return `${formatDateTime(value, reportType=='month'||reportType=='week'?'MMM DD':reportType='year'?'MMM':'MMM DD')}`
          } else {
            return value
          }
        },
      }],
      slotProps: {
        legend: {
          hidden: true,
        },
      },
      sx: {
        '& .MuiBarLabel-root': {
          fill: 'white',
        },
        '& .MuiChartsLegend-series text': {
          fontSize: '1rem!important'
        }
      },
      height: 300
    },
  };
}

export default configs;
