import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Se usa react-router-dom para la navegación
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
//import "../styles/AccessAccount.css";

export default function AccessAccount() {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data } = state || {};

  // Verifica que el campo contraseña no esté vacío
  const isAnyFieldEmpty = () => {
    return !password;
  };

  // Función para eliminar espacios en blanco
  const removeSpace = (input) => {
    return input.replace(/\s+/g, "");
  };

  // Alterna la visibilidad de la contraseña
  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Realiza la petición para acceder a la cuenta
  const accessAccount = async () => {
    const dataParams = JSON.stringify({
      username: user,
      password: password,
    });

    console.log("Data: ", data);
    console.log("DataParams: ", dataParams);

    try {
      await axios.post("http://localhost:3004/accessAccount", dataParams, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/update-account", { state: { data: data } });
    } catch (error) {
      setInfo(error.response?.data || "Error al conectar con el servidor");
    }
  };

  // Muestra el modal con el mensaje recibido
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Al montar el componente, se intenta recuperar el token y obtener la información del usuario
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
          setInfo(error.response?.data || "Error al recuperar información");
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
          <button type="button" onClick={handleIconPress} className="passwordVisibilityToggle">
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
