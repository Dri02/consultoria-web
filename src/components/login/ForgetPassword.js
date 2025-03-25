import React, { useState } from "react";
import { useNavigate } from "react-router"; // Para la navegación
import { FiLock } from "react-icons/fi"; // Iconos de Feather
import axios from "axios";
import "../styles/ForgetPassword.css"; // Importa los estilos CSS

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const navigate = useNavigate(); // Para la navegación

  const handleFocus = () => {
    // Puedes manejar la animación de enfoque con CSS (por ejemplo, :focus)
  };

  const handleBlur = () => {
    // Puedes manejar la animación de desenfoque con CSS (por ejemplo, :not(:focus))
  };

  const forgetPassword = async () => {
    const data = JSON.stringify({
      email: email,
    });

    try {
      const response = await axios.post(
        "http://localhost:3004/verifyEmailRecover",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInfo(response.data);
      navigate("/verify-email", { state: { email: email, role: "recover" } });
    } catch (error) {
      setInfo(
        error.response
          ? error.response.data
          : "Error al conectar con el servidor"
      );
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  return (
    <div className="container">
      <div className="header">
        <FiLock size={48} className="recoverIcon" />
        <h1 className="titleHeader">Recupera tu cuenta</h1>
      </div>
      <div className="textInputContainer">
        <input
          type="email"
          placeholder="Introduce tu correo"
          value={email}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="textInput"
        />
      </div>
      <button className="button" onClick={forgetPassword}>
        Enviar
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
        <div className="modalInfoOut" onClick={() => setIsModalVisible(false)}>
          <div className="modalInfo" onClick={(e) => e.stopPropagation()}>
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
