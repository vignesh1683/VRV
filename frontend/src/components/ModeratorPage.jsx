import React, { useEffect } from 'react'

function ModeratorPage() {
  const token = localStorage.getItem("token");
  const getRole = React.useCallback(async () => {
    try {
      const response = await fetch("http://192.168.3.213:8080/api/get_role", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        if (data.role === "user") {
          window.location.replace("/unauthorized");
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  }, [token]);
  
  useEffect(() => {
    if (!token) {
      window.location.replace("/");
    }
    getRole();
  }, [token, getRole]);

  return (
    <div className='m-3'>
    <div className="font-semibold">Manager Page</div>
  </div>
  )
}

export default ModeratorPage