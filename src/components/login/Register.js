import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

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

  // Verifica que ningún campo esté vacío
  const isAnyFieldEmpty = () => {
    return !name || !lastname || !user || !email || !password;
  };

  // Función para formatear la entrada (por ejemplo, nombre y apellidos)
  const correctInput = (input) => {
    return input
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Elimina espacios en blanco
  const removeSpace = (input) => {
    return input.replace(/\s+/g, "");
  };

  // Corrige la entrada del correo: minúsculas y sin espacios
  const correctEmail = (input) => {
    return input.toLowerCase().replace(/\s+/g, "");
  };

  // Cambia la visibilidad del password
  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Muestra el modal con la información recibida (éxito/error)
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Función para el registro, haciendo el request a la API
  const register = async () => {
    const data = {
      name,
      lastname,
      enterprise,
      username: user,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3004/verifyEmailRegister",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      setInfo(response.data);
      navigate("/verify-email", { state: { email, role: "register", data } });
    } catch (error) {
      setInfo(
        error.response ? error.response.data : "Error al conectar con el servidor"
      );
    }
  };

  // Obtiene las empresas disponibles para el dropdown
  const getEnterprises = async () => {
    try {
      const response = await axios.get("http://localhost:3004/getEnterprises");
      if (response && response.data) {
        const dataArray = response.data.map((item) => ({
          value: item.trim(),
          label: item.trim(),
        }));
        setEnterprises(dataArray);
      } else {
        setInfo("No se encontraron datos en la respuesta");
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

  useEffect(() => {
    getEnterprises();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="accountIcon" aria-label="account">👤</div>
        <h1 className="titleHeader">Registra una cuenta</h1>
      </div>
      <div className="textInputContainer">
        <input
          type="text"
          placeholder="Introduce tu nombre"
          value={name}
          maxLength={50}
          onChange={(e) => setName(correctInput(e.target.value))}
          className="textInput"
        />
        <input
          type="text"
          placeholder="Introduce tus apellidos"
          value={lastname}
          maxLength={50}
          onChange={(e) => setLastname(correctInput(e.target.value))}
          className="textInput"
        />
        <Select
          placeholder="Selecciona tu empresa"
          options={enterprises}
          value={enterprises.find((opt) => opt.value === enterprise) || null}
          onChange={(selectedOption) => setEnterprise(selectedOption.value)}
          className="selectInput"
        />
        <input
          type="text"
          placeholder="Introduce un nombre de usuario"
          value={user}
          maxLength={20}
          onChange={(e) => setUser(removeSpace(e.target.value))}
          className="textInput"
        />
        <input
          type="email"
          placeholder="Introduce un correo"
          value={email}
          maxLength={50}
          onChange={(e) => setEmail(correctEmail(e.target.value))}
          className="textInput"
        />
        <div className="passwordInputContainer">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce una contraseña"
            value={password}
            maxLength={20}
            onChange={(e) => setPassword(removeSpace(e.target.value))}
            className="textInput"
          />
          <button
            type="button"
            onClick={handleIconPress}
            className="passwordVisibilityToggle"
          >
            {passwordVisible ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
      </div>
      <button className="button" disabled={isAnyFieldEmpty()} onClick={register}>
        Registrar
      </button>
      <div className="textContainer">
        <div className="signupContainer">
          <p>¿Ya tienes una cuenta?</p>
          <button type="button" onClick={() => navigate("/")} className="linkText">
            Autentícate aquí
          </button>
        </div>
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
