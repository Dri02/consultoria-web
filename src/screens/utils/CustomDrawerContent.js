import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navegación en web
import { FiUser, FiLogOut, FiInfo, FiEdit, FiDownload } from "react-icons/fi"; // Iconos de react-icons
import axios from "axios";
import "../styles/CustomDrawerContent.css"; // Asegúrate de ajustar la ruta

export default function Drawer() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");

  const navigate = useNavigate();

  const detailsAccount = () => {
    navigate("/profile", {
      state: {
        data: { 
          name: name, 
          lastname: lastname, 
          user: user, 
          email: email, 
          photo: photo },
      },
    });
  };

  // const editDetails = () => {
  //   navigate("/update-details", {
  //     state: {
  //       data: { name, lastname, user, email, photo },
  //     },
  //   });
  // };

  const download = () => {

  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

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
          setName(response.data.name);
          setLastname(response.data.lastname);
          setUser(response.data.username);
          setEmail(response.data.email);
          setPhoto(response.data.photo);
        })
        .catch((error) => {
          setInfo(error.response?.data || "Error al obtener información");
        });
    }
  }, []);

  return (
    <div className="drawer-dropdown">
      <div className="drawer-header">
        <div className="drawer-header-elements">
          <button
            className={`drawer-avatar ${!photo ? "noPhoto" : ""}`}
            onClick={detailsAccount}
          >
            {photo ? (
              <img
                src={`data:image/png;base64,${photo}`}
                alt="Profile"
                className="drawer-avatar-image"
              />
            ) : (
              <FiUser className="drawer-account-icon" />
            )}
          </button>
          {/* <button
            className="drawer-theme-switcher"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <IoSunny size={24} /> : <IoMoon size={24} />}
          </button> */}
        </div>
        <div className="drawer-user-info">
          <p className="drawer-username">{user}</p>
          <p className="drawer-email">{email}</p>
        </div>
      </div>
      <div className="drawer-menu">
        <button className="drawer-menu-option" onClick={detailsAccount}>
          <FiUser size={24} />
          <span className="drawer-menu-text">Cuenta</span>
        </button>
        {/* <button className="drawer-menu-option" onClick={editDetails}>
          <FiEdit size={24} />
          <span className="drawer-menu-text">Editar Detalles</span>
        </button> */}
        <button className="drawer-menu-option" onClick={download}>
          <FiDownload size={24} />
          <span className="drawer-menu-text">Descargar apk</span>
        </button>
        <button
          className="drawer-menu-option"
          onClick={() => {
            localStorage.removeItem("token");
            setUser(false);
            navigate("/");
          }}
        >
          <FiLogOut size={24} />
          <span className="drawer-menu-text">Cerrar sesión</span>
        </button>
        <button
          className="drawer-menu-option"
          onClick={() =>
            setInfo(
              "ConsulTorIa\n\nHerramienta para la gestión de observaciones para equipos de Consultoria TI"
            )
          }
        >
          <FiInfo size={24} />
          <span className="drawer-menu-text">Acerca de</span>
        </button>
      </div>
      {isModalVisible && (
        <div className="drawer-modal">
          <div className="drawer-modal-content">
            <p className="drawer-modal-header">{infoModal}</p>
            <div className="drawer-modal-button-container">
              <button
                className="drawer-modal-button"
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
