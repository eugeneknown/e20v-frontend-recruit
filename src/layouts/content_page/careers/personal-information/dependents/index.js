import {
  Card,
  CardContent,
  Divider,
  Icon,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import NavBar from "layouts/content_page/nav_bar";
import Footer from "examples/Footer";
import useAuth from "hooks/useAuth";
import { useEffect, useState, useCallback, useMemo } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import { useMaterialUIController, setDialog } from "context";
import { useLocation, useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";

function Dependents() {
  const [controller, dispatch] = useMaterialUIController();
  const { dialog } = controller;
  const { loading } = controller;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/careers/personalinfo";
  const prevPage = () => navigate(from, { replace: true });
  const toPage = (url, params = {}) =>
    navigate(url, { state: { from: location, ...params }, replace: true });

  const { auth } = useAuth();
  const [dependents, setDependents] = useState([]);
  const [loadingDependents, setLoadingDependents] = useState(true);

  // UseMemo to prevent unnecessary rerenders
  const memoizedDependents = useMemo(() => dependents, [dependents]);

  // Fetch dependents only when necessary
  const fetchDependents = useCallback(() => {
    setLoadingDependents(true);
    const entity_id = auth.id;
    dataServicePrivate("POST", "entity/dependents/all", {
      filter: [{ operator: "=", target: "entity_id", value: entity_id }],
    })
      .then((result) => {
        setDependents(result.data.entity_dependents || []);
      })
      .catch((error) => {
        console.error("Error fetching dependents:", error);
      })
      .finally(() => {
        setLoadingDependents(false);
      });
  }, [auth.id]);

  useEffect(() => {
    fetchDependents();
  }, [fetchDependents]);

  const handleDelete = (id) => {
    dataServicePrivate("POST", "entity/dependents/delete", { id })
      .then(() => {
        setDependents((prev) => prev.filter((dependent) => dependent.id !== id)); // Optimized update without refetch
      })
      .catch((error) => console.error("Error deleting dependent:", error));
  };

  const deleteHandle = (id, name) => {
    setDialog(dispatch, {
      open: true,
      id: id,
      title: (
        <MDBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2E5B6F",
            padding: "12px 20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: "600",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon sx={{ color: "#FF9800", fontSize: 30 }}>info</Icon>
            Confirm Delete
          </Typography>
        </MDBox>
      ),
      content: (
        <MDBox p={2}>
          <Typography variant="body1" color="textSecondary">
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        </MDBox>
      ),
      action: (
        <MDBox p={2} display="flex" justifyContent="flex-end" gap={2}>
          <MDButton
            onClick={() => setDialog(dispatch, { ...dialog, open: false })}
            color="secondary"
            variant="outlined"
            sx={{
              padding: "8px 16px",
              borderColor: "#F44336",
              color: "#F44336",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#FFC5C5",
                borderColor: "#F44336",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon sx={{ fontSize: 20 }}>cancel</Icon>
            Cancel
          </MDButton>
          <MDButton
            color="primary"
            variant="contained"
            sx={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "#388E3C",
              },
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            autoFocus
            onClick={() => {
              handleDelete(id);
              setDialog(dispatch, { ...dialog, open: false });
            }}
          >
            <Icon sx={{ fontSize: 20 }}>delete</Icon>
            Confirm
          </MDButton>
        </MDBox>
      ),
    });
  };

  // Handle form submission (if needed, you can add any functionality)
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add any additional logic needed here when the form is submitted
    prevPage(); // Navigate back to the previous page
  };

  return (
    <PageLayout>
      <NavBar position="absolute" />
      <Box mt={5} maxWidth="sm" mx="auto" pt={6} pb={3}>
        <Card variant="outlined">
          <CardContent>
            <IconButton onClick={prevPage}>
              <Icon>keyboard_backspace</Icon>
            </IconButton>
            <Typography variant="h3" sx={{ mt: 3 }}>
              Dependents
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {loadingDependents ? (
              <MDTypography
                color="textSecondary"
                variant="h5"
                sx={{ my: 2, textAlign: "center" }}
              >
                Loading...
              </MDTypography>
            ) : memoizedDependents.length === 0 ? (
              <MDTypography
                color="error"
                variant="h5"
                sx={{ my: 2, textAlign: "center" }}
              >
                No Dependents found.
              </MDTypography>
            ) : (
              memoizedDependents.map((dependent, index) => (
                <Card
                  key={index}
                  sx={{ position: "relative", my: 2, p: 2 }}
                  variant="outlined"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h5">{dependent.name}</Typography>
                      <Typography variant="body2">
                        {formatDateTime(dependent.birthday, "MMMM DD, YYYY")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {dependent.relationship}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() =>
                          toPage("/careers/personalinfo/dependentsform", {
                            id: dependent.id,
                          })
                        }
                      >
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                      <IconButton
                        onClick={() => deleteHandle(dependent.id, dependent.name)}
                      >
                        <Icon color="error">delete</Icon>
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))
            )}

            <MDButton
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<Icon>add</Icon>}
              onClick={() =>
                toPage("/careers/personalinfo/dependentsform", { mode: "add" })
              }
            >
              Add Dependents
            </MDButton>
            

            <form onSubmit={handleSubmit}>
              <MDButton
                sx={{ my: 2 }}
                color="info"
                fullWidth
                type="submit"
                startIcon={<Icon>save</Icon>}
              >
                Save
              </MDButton>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </PageLayout>
  );
}

export default Dependents;
