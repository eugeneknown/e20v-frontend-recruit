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

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { AuthProvider } from "context/AuthProvider";

// Main Page
import MainPage from 'layouts/content_page/main';

//mui date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { SnackbarProvider } from "notistack";


const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </LocalizationProvider>
      </AuthProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
