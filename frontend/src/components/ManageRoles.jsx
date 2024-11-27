import React, {useEffect} from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ManageRoles() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [dataSource, setDataSource] = React.useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
    }
  }, [token, navigate]);

  const fetchData = React.useCallback(async () => {
    try{
      if (!token) {
        navigate("/unauthorized");
      }
      const response = await fetch("http://192.168.3.213:8080/api/get_users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDataSource(data.users);
      if (!data.success) {
        navigate("/unauthorized");
      }
    }catch(err){
      console.error(err);
    }
  }, [token, navigate]);
  
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const roles = ["admin", "manager", "user"];
  const label = { inputProps: { "aria-label": "Switch demo" } };

  const handleSwitch = async (rbac, index, e, role) => {
    try{
      const response = await fetch("http://192.168.3.213:8080/api/update_role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: role,
          userId: rbac.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
          fetchData();
      } else{
        console.error(data.message);
      }
    }catch(err){
      console.error(err); 
    }
  };

  return (
    <div className="p-3">
      <div className="font-semibold">Manage Roles</div>
      <span className="text-gray-500 text-sm mt-3">
        Note: Only admins can manage roles
      </span>
      <TableContainer
        component={Paper}
        sx={{
          margin: "4vh",
          maxWidth: "90vw",
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        <Table sx={{ minWidth: 450 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#9FC1F1", border: "none" }}>
              <TableCell sx={{ width: "20vw" }}></TableCell>
              {roles.map((role, index) => {
                return (
                  <TableCell key={index} sx={{ textAlign: "center" }}>
                    {role}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found...
                </TableCell>
              </TableRow>
            ) : (
              dataSource?.map((rbac, index) => {
                return (
                  <TableRow sx={{ textAlign: "center" }} key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ paddingLeft: rbac.padding }}
                    >
                      <span>{rbac.name}</span>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Switch
                        {...label}
                        value={rbac.admin}
                        checked={rbac.role === "admin" ? true : false}
                        onChange={(e) => handleSwitch(rbac, index, e, "admin")}
                      />
                    </TableCell>
  
                    <TableCell sx={{ textAlign: "center" }}>
                      <Switch
                        {...label}
                        value={rbac.manager}
                        checked={rbac.role === "manager" ? true : false}
                        onChange={(e) => handleSwitch(rbac, index, e, "manager")}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Switch
                        {...label}
                        value={rbac.user}
                        checked={rbac.role === "user" ? true : false}
                        onChange={(e) => handleSwitch(rbac, index, e, "user")}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageRoles;
