import Swal from "sweetalert2";
import axios from "../api/axios";

const useAuthentication = ({ login }) => {
  const AUTH_URL = "/auth";
  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors }
  ) => {
    try {
      const response = await axios.post(
        AUTH_URL,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.status === 200) {
        const privilege = response?.data?.privilege;
        const token = response?.data?.token;
        const userName = response?.data?.userName;

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Cuenta validada con éxito",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          login(privilege, token, email, userName);
        });
      }
    } catch (error) {
      if (error?.response?.data?.statusText === "error email")
        return setErrors({ email: error?.response?.data?.message });

      if (error?.response?.data?.statusText === "error password")
        return setErrors({ password: error?.response?.data?.message });

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "sin conexión con el servidor",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return { onSubmit };
};

export default useAuthentication;