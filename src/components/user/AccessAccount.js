import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router"; // Para manejar la navegación y los parámetros
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Iconos de React Icons
import axios from "axios";
import "../styles/AccessAccount.css"; // Estilos CSS

export default function AccessAccount() {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { dataParams } = location.state || {}; // Extrae los parámetros

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
        navigate("/update-account", { state: { data: dataParams } });
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
    const token = localStorage.getItem("token");
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
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <FiLock size={48} className="lockIcon" />
        <h1 className="titleHeader">Accede a tu cuenta</h1>
      </div>
      <div className="textInputContainer">
        <div className="inputWrapper">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(removeSpace(e.target.value))}
            className="textInput"
          />
          <button onClick={handleIconPress} className="passwordVisibilityToggle">
            {passwordVisible ? <FiEye size={22} /> : <FiEyeOff size={22} />}
          </button>
        </div>
      </div>
      <button
        className="button"
        disabled={isAnyFieldEmpty()}
        onClick={accessAccount}
      >
        Acceder
      </button>
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