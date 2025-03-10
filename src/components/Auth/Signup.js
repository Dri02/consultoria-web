import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Register"; // Archivo CSS para estilos

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [enterprise, setEnterprise] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enterprises, setEnterprises] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isAnyFieldEmpty = () => {
    return !name || !lastname || !user || !email || !password;
  };

  const correctInput = (input) => {
    return input
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const removeSpace = (input) => {
    return input.replace(/\s+/g, "");
  };

  const correctEmail = (input) => {
    return input.toLowerCase().replace(/\s+/g, "");
  };

  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  const register = async () => {
    const data = {
      name: name,
      lastname: lastname,
      enterprise: enterprise,
      username: user,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3004/verifyEmailRegister",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInfo(response.data);
      window.location.href = `/verify-email?email=${encodeURIComponent(
        email
      )}&role=register`; // Redirigir a la página de verificación
    } catch (error) {
      setInfo(error.response ? error.response.data : "Error al conectar con el servidor");
    }
  };

  const getEnterprises = async () => {
    try {
      const response = await axios.get("http://localhost:3004/getEnterprises");
      if (response) {
        const dataArray = response.data.map((item) => ({
          value: item.trim(),
          label: item.trim(),
        }));
        setEnterprises(dataArray);
      } else {
        setInfo("No data found in response");
      }
    } catch (error) {
      if (error.response) {
        setInfo(`Server error: ${error.response.data || error.response.status}`);
      } else if (error.request) {
        setInfo("No response from server. Please check if the server is running.");
      } else {
        setInfo(`Error: ${error.message}`);
      }
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    getEnterprises();
  }, []);

  const filteredEnterprises = enterprises.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <span className="account-icon">👤</span>
        <h1 className="title-header">Registra una cuenta</h1>
      </div>
      <div className="text-input-container">
        <input
          type="text"
          placeholder="Introduce tu nombre"
          value={name}
          maxLength={50}
          onChange={(e) => setName(correctInput(e.target.value))}
          onBlur={() => setName(name.trim())}
          className="text-input"
        />
        <input
          type="text"
          placeholder="Introduce tus apellidos"
          value={lastname}
          maxLength={50}
          onChange={(e) => setLastname(correctInput(e.target.value))}
          onBlur={() => setLastname(lastname.trim())}
          className="text-input"
        />
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="Buscar empresa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={enterprise}
            onChange={(e) => setEnterprise(e.target.value)}
            className="dropdown"
          >
            <option value="">Selecciona tu empresa</option>
            {filteredEnterprises.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Introduce un nombre de usuario"
          value={user}
          maxLength={20}
          onChange={(e) => setUser(removeSpace(e.target.value))}
          onBlur={() => setUser(user.trim())}
          className="text-input"
        />
        <input
          type="email"
          placeholder="Introduce un correo"
          value={email}
          maxLength={50}
          onChange={(e) => setEmail(correctEmail(e.target.value))}
          onBlur={() => setEmail(email.trim())}
          className="text-input"
        />
        <div className="password-input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce una contraseña"
            value={password}
            maxLength={20}
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
        onClick={register}
      >
        Registrar
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