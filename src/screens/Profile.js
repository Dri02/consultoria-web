import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate
import { FaUser } from "react-icons/fa"; // Icono de usuario
import "./styles/Profile.css"; // Estilos CSS

export default function Profile() {
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para redirigir al usuario
  const { data } = location.state || {}; // Extrae los datos

  // Si no hay datos, muestra un mensaje
  if (!data) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="titleHeader">No se encontraron datos del perfil.</h1>
        </div>
        <button
          onClick={() => navigate(-1)} // Redirige a la página anterior
          className="backButton"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className={`avatarContainer ${!data.photo ? "noPhoto" : ""}`}>
          {data.photo ? (
            <img
              src={`data:image/png;base64,${data.photo}`}
              alt="Profile"
              className="image"
            />
          ) : (
            <FaUser className="accountIcon" />
          )}
        </div>
        <h1 className="titleHeader">
          {data.name} {data.lastname}
        </h1>
      </div>
      <div className="containerDetails">
        <div className="detailItem">
          <p className="titleDetailItem">Usuario</p>
          <p className="valueDetailItem">{data.user}</p>
          <div className="separatorItem" />
        </div>
        <div className="detailItem">
          <p className="titleDetailItem">Correo</p>
          <p className="valueDetailItem">{data.email}</p>
        </div>
      </div>
      <button
        onClick={() => navigate(-1)} // Redirige a la página anterior
        className="backButton"
      >
        Volver
      </button>
    </div>
  );
}