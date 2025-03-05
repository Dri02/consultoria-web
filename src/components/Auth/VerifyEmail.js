import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usamos useLocation y useNavigate para manejar la navegación
import axios from "axios";
import "./css/verifyEmail"; // Archivo CSS para estilos

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role, data } = location.state || {}; // Obtenemos los parámetros desde la ubicación

  const isAnyFieldEmpty = () => {
    return !code;
  };

  const verifyEmail = async () => {
    const temp = JSON.stringify({
      email: email,
      code: code,
    });

    await axios
      .post("http://localhost:3004/verifyCode", temp, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        setInfo(response.data);

        if (role === "register") {
          await axios
            .post("http://localhost:3004/signup", data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              const { auth } = response.data;
              if (auth) {
                navigate("/login"); // Redirigir a la página de login
              }
            });
        } else if (role === "recover") {
          navigate("/new-password", { state: { email: email } }); // Redirigir a la página de nueva contraseña
        } else if (role === "update") {
          await axios
            .post("http://localhost:3004/updateAccount", data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              setInfo(response.data);
              navigate("/login"); // Redirigir a la página de login
            });
        }
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
        <span className="recover-icon">🔑</span>
        <h1 className="title-header">Verifica tu correo</h1>
      </div>
      <div className="text-input-container">
        <input
          type="text"
          placeholder="Introduce tu código"
          value={code}
          maxLength={6}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => setCode(e.target.value)}
          className="text-input"
        />
      </div>
      <button
        className={`button ${isAnyFieldEmpty() ? "disabled" : ""}`}
        disabled={isAnyFieldEmpty()}
        onClick={verifyEmail}
      >
        Verificar
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