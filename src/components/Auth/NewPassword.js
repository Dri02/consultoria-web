import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Usamos useParams para obtener el email
import axios from "axios";
import "./css/NewPassword"; // Archivo CSS para estilos

export default function NewPassword({ navigation }) {
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const { email } = useParams(); // Obtenemos el email desde la URL

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const newPassword = async () => {
    const data = JSON.stringify({
      email: email,
      password: password,
    });

    await axios
      .post("http://localhost:3004/recoverAccount", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setInfo(response.data);
        window.location.href = "/login"; // Redirigir a la página de login
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  return (
    <div className="container">
      <div className="header">
        <span className="password-icon">🔑</span>
        <h1 className="title-header">Cambia tu contraseña</h1>
      </div>
      <div className="text-input-container">
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce una contraseña"
            value={password}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setPassword(e.target.value)}
            className="text-input"
          />
          <button className="password-toggle" onClick={handleIconPress}>
            {passwordVisible ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>
      <button className="button" onClick={newPassword}>
        Aceptar
      </button>
      <div className="text-container">
        <div className="signup-container">
          <p>¿Ya tienes una cuenta?</p>
          <a href="/login" className="link-text">
            Autentícate aquí
          </a>
        </div>
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-info">
            <p className="modal-info-text-header">{infoModal}</p>
            <div className="container-modal-info-button">
              <button
                className="modal-info-button"
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