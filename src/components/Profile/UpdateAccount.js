import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usamos useLocation y useNavigate para manejar la navegación
import axios from "axios";
import "./css/UpdateAccount"; // Archivo CSS para estilos

export default function UpdateAccount() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [olduser, setOlduser] = useState("");
  const [oldemail, setOldemail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {}; // Obtenemos los parámetros desde la ubicación

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

  const openImagePicker = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result.split(",")[1]); // Guardar la imagen en base64
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateAccount = async () => {
    const data = JSON.stringify({
      username: user,
      email: email,
      olduser: olduser,
      oldemail: oldemail,
    });
    const formData = new FormData();

    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("username", user);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photo", photo);
    formData.append("olduser", olduser);

    await axios
      .post("http://localhost:3004/verifyEmailUpdate", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setInfo(response.data);
        navigate("/verify-email", {
          state: {
            email: email,
            role: "update",
            data: formData,
          },
        });
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
    if (data) {
      setName(data.name);
      setLastname(data.lastname);
      setUser(data.user);
      setEmail(data.email);
      setPhoto(data.photo);
      setOlduser(data.user);
      setOldemail(data.email);
    }
  }, [data]);

  return (
    <div className="container">
      <div className="header">
        <div className="avatar-container">
          {photo ? (
            <img
              src={`data:image/png;base64,${photo}`}
              alt="Profile"
              className="image"
            />
          ) : (
            <span className="account-icon">👤</span>
          )}
          <button className="camera-icon" onClick={openImagePicker}>
            📷
          </button>
        </div>
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
        onClick={updateAccount}
      >
        Actualizar
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