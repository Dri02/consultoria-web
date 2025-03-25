import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router"; // Para manejar la navegación
import { FiUser, FiLogOut, FiInfo } from "react-icons/fi"; // Iconos de React Icons
import { IoMoon, IoSunny } from "react-icons/io5"; // Iconos de React Icons
import axios from "axios";
import "../styles/CustomDrawerContent.css"; // Estilos CSS

export default function Drawer({ navigation }) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate(); // Para la navegación

  const detailsAccount = async () => {
    navigate("/profile", {
      state: {
        data: {
          name: name,
          lastname: lastname,
          user: user,
          email: email,
          photo: photo,
        },
      },
    });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http:/localhost:3004/me", {
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
          setInfo(error.response.data);
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="headerElements">
          <button
            className={`avatarContainer ${!photo ? "noPhoto" : ""}`}
            onClick={detailsAccount}
          >
            {photo ? (
              <img
                src={`data:image/png;base64,${photo}`}
                alt="Profile"
                className="avatarImage"
              />
            ) : (
              <FiUser className="accountIcon" />
            )}
          </button>
          <button
            className="themeSwitcher"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <IoSunny size={24} /> : <IoMoon size={24} />}
          </button>
        </div>
        <div>
          <p className="username">{user}</p>
          <p className="email">{email}</p>
        </div>
      </div>
      <div className="menu">
        <button className="menuOption" onClick={detailsAccount}>
          <FiUser size={24} />
          <p className="menuText">Cuenta</p>
        </button>
        <button
          className="lastMenuOption"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <FiLogOut size={24} />
          <p className="menuText">Cerrar sesión</p>
        </button>
      </div>
      <div className="menu">
        <button
          className="menuOption"
          onClick={() =>
            setInfo("ConsulTorIa\n\nHerramienta para la gestión de observaciones para equipos de Consultoria TI")
          }
        >
          <FiInfo size={24} />
          <p className="menuText">Acerca de</p>
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