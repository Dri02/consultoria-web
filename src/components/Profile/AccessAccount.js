import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usamos useLocation y useNavigate para manejar la navegación
import axios from "axios";
import "./css/AccessAccount"; // Archivo CSS para estilos

export default function AccessAccount() {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { dataParams } = location.state || {}; // Obtenemos los parámetros desde la ubicación

  const isAnyFieldEmpty = () => {
    return !password;
  };

  const removeSpace = (input) => {
    return input.replace(/\s+/g, "");
  };

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const accessAccount = async () => {
    const data = JSON.stringify({
      username: user,
      password: password,
    });

    await axios
      .post("http://localhost:3004/accessAccount", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/update-account", { state: { data: dataParams } }); // Redirigir a la página de actualización de cuenta
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Usamos localStorage en lugar de AsyncStorage
    if (token) {
      axios
        .get("http://localhost:3004/me", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        })
        .then((response) => {
          setUser(response.data.username);
        })
        .catch((error) => {
          setInfo(error.response.data);
        });
    } else {
      console.log("No se encontró el token en localStorage");
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <span className="lock-icon">🔒</span>
        <h1 className="title-header">Accede a tu cuenta</h1>
      </div>
      <div className="text-input-container">
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce tu contraseña"
            value={password}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setPassword(removeSpace(e.target.value))}
            onBlur={() => setPassword(password.trim())}
            className="text-input"
          />
          <button className="password-toggle" onClick={handleIconPress}>
            {passwordVisible ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>
      <button
        className={`button ${isAnyFieldEmpty() ? "disabled" : ""}`}
        disabled={isAnyFieldEmpty()}
        onClick={accessAccount}
      >
        Acceder
      </button>

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