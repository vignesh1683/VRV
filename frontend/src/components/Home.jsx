import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ManageRoles from "./ManageRoles";
import UserPage from "./UserPage";
import ModeratorPage from "./ModeratorPage";
import PageNotFound from "./PageNotFound";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

function Home() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState(null);
  const [routeArray, setRouteArray] = useState([
    { routeId: 0, route: "user_page", tabTitle: "Dashboard", active: true },
    { routeId: 1, route: "moderator_page", tabTitle: "Moderator", active: false },
    { routeId: 2, route: "manage_roles", tabTitle: "Manage Roles", active: false },
  ]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
    }
  }, [token]);
  // Fetch user role from API
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://192.168.3.213:8080/api/get_role", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          const userRole = data.role;
          setCurrentUser(userRole);

          // Update routeArray based on the role
          setRouteArray((prevRoutes) =>
            prevRoutes.map((route) => ({
              ...route,
              active:
                (userRole === "user" && route.routeId === 1) ||
                (userRole === "moderator" && route.routeId === 2) ||
                (userRole === "admin" && route.routeId === 0),
            }))
          );
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    getUserRole();
  }, []);

  useEffect(() => {
    const getCurrentTab = () => {
      const path = location.pathname.split("/").pop();
      const routeIndex = routeArray.findIndex((r) => r.route === path);
      return routeIndex !== -1 ? routeIndex : 0;
    };

    setActiveTab(getCurrentTab());
  }, [location, routeArray]);

  const highlightActiveTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <div className="flex flex-row pl-0 bg-[#F5F5F5] m-3 justify-between">
        <ul className="flex flex-row list-none mb-0 pl-0 gap-2">
          {routeArray.map((route) => (
            <p
              onClick={() => highlightActiveTab(route.routeId)}
              key={route.routeId}
              className={`px-16 font-raleway text-sm no-underline text-black border-x-0 border-t-0 border-b-2 p-3 cursor-pointer hover:border-gray-300 ${
                route.routeId === activeTab ? "border-solid border-sky-500" : ""
              }`}
            >
              {route.tabTitle}
            </p>
          ))}
        </ul>
        <div className="flex items-center">
          <button
            className="font-semibold py-2 px-4 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
          <p className="flex flex-col items-center p-2">
          <Avatar sx={{ bgcolor: deepOrange[500], ml: 2, mr: 2 ,width:24,height:24}} sizes="xs">
            {currentUser ? currentUser.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <span className="font-semibold text-xs">
            {currentUser?.charAt(0).toUpperCase() + currentUser?.slice(1)}
          </span>
          </p>
        </div>
      </div>
      {activeTab === 0 && <UserPage />}
      {activeTab === 1 && <ModeratorPage />}
      {activeTab === 2 && <ManageRoles />}
      {activeTab !== 0 && activeTab !== 1 && activeTab !== 2 && <PageNotFound />}
    </>
  );
}

export default Home;
