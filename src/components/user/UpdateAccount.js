import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para la navegación y los parámetros
import { FiCamera, FiEye, FiEyeOff } from "react-icons/fi"; // Iconos de Feather
import { motion } from "framer-motion"; // Para animaciones
import axios from "axios";
import "../styles/UpdateAccount.css"; // Estilos CSS

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

  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { data } = location.state || {}; // Extrae los parámetros

  // Verifica que ninguno de los campos requeridos esté vacío
  const isAnyFieldEmpty = () => {
    return !name || !lastname || !user || !email || !password;
  };

  // Formatea la entrada (ej. nombres y apellidos)
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

  // Corrige la entrada de correo a minúsculas sin espacios
  const correctEmail = (input) => {
    return input.toLowerCase().replace(/\s+/g, "");
  };

  // Alterna la visibilidad de la contraseña
  const handleIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Abre el selector de imagen utilizando un input file creado dinámicamente
  const openImagePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Se extrae la parte base64 eliminando el prefijo "data:image/png;base64,"
          setPhoto(reader.result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Envía la solicitud para actualizar la cuenta. Primero se verifica el correo y luego se navega a la verificación.
  const updateAccount = async () => {
    // Datos para la verificación del correo
    const dataPayload = JSON.stringify({
      username: user,
      email: email,
      olduser: olduser,
      oldemail: oldemail,
    });

    // Se prepara un formData para enviar todos los campos, incluida la foto
    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("username", user);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photo", photo);
    formData.append("olduser", olduser);

    try {
      const response = await axios.post("http://localhost:3004/verifyEmailUpdate", dataPayload, {
        headers: { "Content-Type": "application/json" },
      });
      setInfo(response.data);
      navigate("/verify-email", {
        state: { email: email, role: "update", data: formData },
      });
    } catch (error) {
      setInfo(
        error.response ? error.response.data : "Error al conectar con el servidor"
      );
    }
  };

  // Muestra el modal con un mensaje
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Al montar el componente, se inicializan los valores a partir de los datos recibidos
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
        <div className="avatarContainer">
          {photo ? (
            <img
              src={`data:image/png;base64,${photo}`}
              alt="Profile"
              className="image"
            />
          ) : (
            <div className="accountIcon">👤</div>
          )}
          <button className="cameraIcon" onClick={openImagePicker}>
            <FiCamera size={20} color="white" />
          </button>
        </div>
      </div>
      <div className="textInputContainer">
        <motion.div
          className="textInput"
          whileFocus={{ borderBottomColor: "blue", borderBottomWidth: 2 }}
        >
          <input
            type="text"
            placeholder="Introduce tu nombre"
            value={name}
            maxLength={50}
            onChange={(e) => setName(correctInput(e.target.value))}
          />
        </motion.div>
        <motion.div
          className="textInput"
          whileFocus={{ borderBottomColor: "blue", borderBottomWidth: 2 }}
        >
          <input
            type="text"
            placeholder="Introduce tus apellidos"
            value={lastname}
            maxLength={50}
            onChange={(e) => setLastname(correctInput(e.target.value))}
          />
        </motion.div>
        <motion.div
          className="textInput"
          whileFocus={{ borderBottomColor: "blue", borderBottomWidth: 2 }}
        >
          <input
            type="text"
            placeholder="Introduce un nombre de usuario"
            value={user}
            maxLength={20}
            onChange={(e) => setUser(removeSpace(e.target.value))}
          />
        </motion.div>
        <motion.div
          className="textInput"
          whileFocus={{ borderBottomColor: "blue", borderBottomWidth: 2 }}
        >
          <input
            type="email"
            placeholder="Introduce un correo"
            value={email}
            maxLength={50}
            onChange={(e) => setEmail(correctEmail(e.target.value))}
          />
        </motion.div>
        <motion.div
          className="textInput"
          whileFocus={{ borderBottomColor: "blue", borderBottomWidth: 2 }}
        >
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Introduce una contraseña"
            value={password}
            maxLength={20}
            onChange={(e) => setPassword(removeSpace(e.target.value))}
          />
          <button
            type="button"
            className="passwordVisibilityToggle"
            onClick={handleIconPress}
          >
            {passwordVisible ? <FiEye size={22} /> : <FiEyeOff size={22} />}
          </button>
        </motion.div>
      </div>
      <button
        className="button"
        disabled={isAnyFieldEmpty()}
        onClick={updateAccount}
      >
        Actualizar
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
