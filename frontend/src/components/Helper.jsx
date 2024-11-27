const verifyToken = async (token) => {
  const response = await fetch("http://192.168.3.213:8080/api/protected", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!data.success) {
    window.location.href = "/";
  }
  return data;
};

export default verifyToken;
