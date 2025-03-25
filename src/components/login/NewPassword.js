import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para manejar la navegación y los parámetros
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Iconos de Feather
import axios from "axios";
import "../styles/NewPassword.css"; // Estilos CSS

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { email } = location.state || {}; // Extrae los parámetros

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const newPassword = async () => {
    const data = JSON.stringify({
      email: email,
      password: password,
    });

    try {
      const response = await axios.post(
        "http://localhost:3004/recoverAccount",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInfo(response.data);
      navigate("/"); // Navega a la página de inicio de sesión
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
        <FiLock size={48} className="passwordIcon" /> {/* Usa un ícono o un componente de ícono */}
        <h1 className="titleHeader">Cambia tu contraseña</h1>
      </div>
      <div className="textInputContainer">
        <div className="inputWrapper">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce una contraseña"
            value={password}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setPassword(e.target.value)}
            className="textInput"
          />
          <button onClick={handleIconPress} className="passwordVisibilityToggle">
            {passwordVisible ? <FiEye size={25} /> : <FiEyeOff size={25} />}
          </button>
        </div>
      </div>
      <button
        className="button"
        onClick={newPassword}
      >
        Aceptar
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