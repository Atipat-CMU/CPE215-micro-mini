export const callUserTestToken = async () => {
  const token = localStorage.getItem("token");
  try {
    const resp = await axios.get("/api/user/testToken", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.data.ok) {
      return true;
    }
  } catch (err) {
    // alert(err.response.data.message);
    return false;
  }
};
