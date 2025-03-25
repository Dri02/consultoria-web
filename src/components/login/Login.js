import React, { useState } from "react";
import { useNavigate } from "react-router"
import { FiLock } from "react-icons/fi"; // Iconos de Feather
import axios from "axios";
import "../styles/Login.css"; // Importa el archivo CSS

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const login = async () => {
    const data = JSON.stringify({
      username: user,
      password: password
    });
  
    try {
      const response = await axios.post("http://localhost:3004/signin", data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      const { auth, token } = response.data;
  
      if (auth) {
        // Usar localStorage para guardar el token en la web
        localStorage.setItem('token', token);
        console.log('Token guardado exitosamente');
  
        setInfo(`Bienvenido ${user} a ConsulTorIa`);
        navigate("/");
      }
    } catch (error) {
      setInfo(error.response?.data || 'Error en la solicitud');
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  const isAnyFieldEmpty = () => {
    return !user || !password;
  };

  return (
    <div className="container">
      <div className="header">
          <FiLock size={30} className="lockIcon" /> {/* Usa un ícono o un componente de ícono */}
          <h1 className="titleHeader">Inicia sesión</h1>
      </div>
      <div className="textInputContainer">
        <input
          type="text"
          placeholder="Introduce tu usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="textInput"
        />
        <div style={{ position: "relative" }}>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="textInput"
          />
          <button
            onClick={handleIconPress}
            className="passwordVisibilityToggle"
          >
            {passwordVisible ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>
      <button className="button" disabled={isAnyFieldEmpty()} onClick={login}>
        Continuar
      </button>
      <div className="signupContainer">
        <p>¿No tienes cuenta?</p>
        <button
          onClick={() => navigate("/register")}
          className="linkText"
        >
          Regístrate aquí
        </button>
      </div>
      <div className="forgotPasswordContainer">
        <button
          onClick={() => navigate("/forget-password")}
          className="linkText"
        >
          ¿Has olvidado tu contraseña?
        </button>
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