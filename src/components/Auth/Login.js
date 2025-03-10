import React, { useState } from "react";
import axios from "axios";
import "./css/Login";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");

  const isAnyFieldEmpty = () => {
    return !user || !password;
  };

  const removeSpace = (input) => {
    return input.replace(/\s+/g, "");
  };

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const login = async () => {
    const data = JSON.stringify({
      username: user,
      password: password,
    });

    await axios
      .post("http://localhost:3004/signin", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        const { auth, token } = response.data;

        if (auth) {
          localStorage.setItem("token", token); // Usamos localStorage en lugar de AsyncStorage
          console.log("Token guardado exitosamente");
          setInfo(`Bienvenido ${user} a ConsulTorIa`);
          navigation.navigate("OK"); // Ajusta la navegación según tu enrutador
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
        <span className="lock-icon">🔒</span>
        <h1 className="title-header">Inicia sesión</h1>
      </div>
      <div className="text-input-container">
        <input
          type="text"
          placeholder="Introduce tu usuario"
          value={user}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => setUser(removeSpace(e.target.value))}
          onBlur={() => setUser(user.trim())}
          className="text-input"
        />
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
        onClick={login}
      >
        Continuar
      </button>
      <div className="text-container">
        <div className="signup-container">
          <p>¿No tienes cuenta?</p>
          <a href="/register" className="link-text">
            Regístrate aquí
          </a>
        </div>
        <div className="forgot-password-container">
          <a href="/forgot-password" className="link-text">
            ¿Has olvidado tu contraseña?
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