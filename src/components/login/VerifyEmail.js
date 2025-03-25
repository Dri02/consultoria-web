import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router"; // Para manejar la navegación y los parámetros
import { FiLock } from "react-icons/fi"; // Iconos de Feather
import axios from "axios";
import "../styles/VerifyEmail.css"; // Estilos CSS

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { email, role, data } = location.state || {}; // Extrae los parámetros

  const isAnyFieldEmpty = () => {
    return !code;
  };

  const verifyEmail = async () => {
    const temp = JSON.stringify({
      email: email,
      code: code,
    });

    try {
      const response = await axios.post("http://localhost:3004/verifyCode", temp, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setInfo(response.data);

      if (role === "register") {
        await axios
          .post("http://localhost:3004/signup", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            const { auth, token } = response.data;
            if (auth) {
              navigate("/"); // Navega a la página de inicio de sesión
            }
          });
      } else if (role === "recover") {
        navigate("/new-password", { state: { email: email } }); // Navega a la página de nueva contraseña
      } else if (role === "update") {
        await axios
          .post("http://localhost:3004/updateAccount", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            setInfo(response.data);
            navigate("/"); // Navega a la página de inicio de sesión
          });
      }
    } catch (error) {
      setInfo(error.response ? error.response.data : "Error al conectar con el servidor");
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  return (
    <div className="container">
      <div className="header">
        <FiLock size={48} className="recoverIcon" /> {/* Usa un ícono o un componente de ícono */}
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