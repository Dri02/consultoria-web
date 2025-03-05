import React, { useState } from "react";
import axios from "axios";
import "./css/ForgetPassword"
export default function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");

  const forgetPassword = async () => {
    const data = JSON.stringify({
      email: email,
    });

    await axios
      .post("http://localhost:3004/verifyEmailRecover", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setInfo(response.data);
        navigation.navigate("VerifyEmail", { email: email, role: "recover" });
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
        <h1 className="title-header">Recupera tu cuenta</h1>
      </div>
      <div className="text-input-container">
        <input
          type="email"
          placeholder="Introduce tu correo"
          value={email}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => setEmail(e.target.value)}
          className="text-input"
        />
      </div>
      <button className="button" onClick={forgetPassword}>
        Enviar
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