import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Se usa react-router-dom para la navegación
import { FiLock } from "react-icons/fi"; // Icono de Feather
import axios from "axios";
import "../styles/VerifyEmail.css"; // Se importan los estilos CSS

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  
  // Extrae parámetros de la ruta (email, role y data)
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role, data } = location.state || {};

  // Verifica que el campo código no esté vacío
  const isAnyFieldEmpty = () => {
    return !code;
  };

  // Función para mostrar el modal con la información recibida (éxito o error)
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Función principal para verificar el código y realizar la acción según el role
  const verifyEmail = async () => {
    const payload = JSON.stringify({
      email: email,
      code: code,
    });

    try {
      const response = await axios.post("http://localhost:3004/verifyCode", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(payload, role)
      setInfo(response.data);

      if (role === "register") {
        await axios.post("http://localhost:3004/signup", data, {
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          const { auth } = response.data;
          if (auth) {
            navigate("/"); // Navega a la página de inicio de sesión
          }
        });
      } else if (role === "recover") {
        navigate("/new-password", { state: { email: email } }); // Navega a la página de nueva contraseña
      } else if (role === "update") {
        console.log(data);
        await axios.post("http://localhost:3004/updateAccountW", data, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
          setInfo(response.data);
          navigate("/"); // Navega a la página de inicio de sesión
        });
      }
    } catch (error) {
      setInfo(error.response ? error.response.data : "Error al conectar con el servidor");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <FiLock size={48} className="recoverIcon" />
        <h1 className="titleHeader">Verifica tu correo</h1>
      </div>
      <div className="textInputContainer">
        <input
          type="text"
          placeholder="Introduce tu código"
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
          className="textInput"
        />
      </div>
      <button
        className="button"
        disabled={isAnyFieldEmpty()}
        onClick={verifyEmail}
      >
        Verificar
      </button>
      <div className="textContainer">
        <div className="signupContainer">
          <p>¿Ya tienes una cuenta?</p>
          <button onClick={() => navigate("/")} className="linkText">
            Autentícate aquí
          </button>
        </div>
      </div>
      {isModalVisible && (
        <div className="modalInfoOut">
          <div className="modalInfo">
            <p className="modalInfoTextHeader">{infoModal}</p>
            <div className="containerModalInfoButton">
              <button
                className="modalInfoButton"
                onClick={() => setIsModalVisible(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
