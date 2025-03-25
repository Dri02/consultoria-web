import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { FiEye, FiEyeOff, FiChevronDown, FiCheck } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate(); // Usa useNavigate para la navegación

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
      const response = await axios.post("http://localhost:3004/verifyEmailRegister", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setInfo(response.data);
      navigate("/verify-email", { state: { email: email, role: "register", data: data } }); // Usa navigate
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

  return (
    <div className="container">
      <div className="header">
        <div className="accountIcon">👤</div>
        <h1 className="titleHeader">Registra una cuenta</h1>
      </div>
      <div className="textInputContainer">
        <input
          type="text"
          placeholder="Introduce tu nombre"
          value={name}
          maxLength={20}
          onChange={(e) => setName(correctInput(e.target.value))}
          className="textInput"
        />
        <input
          type="text"
          placeholder="Introduce tus apellidos"
          value={lastname}
          maxLength={20}
          onChange={(e) => setLastname(correctInput(e.target.value))}
          className="textInput"
        />
        <Select
          placeholder="Selecciona tu empresa"
          options={enterprises}
          value={enterprises.find((opt) => opt.value === enterprise)}
          maxLength={20}
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
          <button onClick={handleIconPress} className="passwordVisibilityToggle">
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
          <button onClick={() => navigate("/")} className="linkText">
            Autentícate aquí
          </button>
        </div>
      </div>
      {isModalVisible && (
        <div className="modalInfoOut">
          <div className="modalInfo">
            <p className="modalInfoTextHeader">{infoModal}</p>
            <div className="containerModalInfoButton">
              <button className="modalInfoButton" onClick={() => setIsModalVisible(false)}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}