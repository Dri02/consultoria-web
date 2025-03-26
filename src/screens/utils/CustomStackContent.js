import React from "react";
import { useNavigate } from "react-router-dom";
import { Feather } from "react-feather";
import "../styles/CustomStackContent.css"; // Ubicado en una carpeta de estilos

const RenderHeaderLeft = ({ route }) => {
  const navigate = useNavigate();

  return (
    route.name === "MainTopTab" ? (
      <div className="icon-button">
        <button onClick={() => navigate("/drawer")}>
          <Feather name="menu" size={25} color="black" />
        </button>
      </div>
    ) : (
      <div className="icon-button">
        <button onClick={() => navigate(-1)}>
          <Feather name="arrow-left" size={25} color="black" />
        </button>
      </div>
    )
  );
};

const RenderHeaderRight = ({ route }) => {
  const navigate = useNavigate();

  return (
    route.name === "MainTopTab" ? (
      <div className="header-right-container">
        <div className="icon-button">
          <button onClick={() => {
            // Aquí colocar la lógica para la acción de búsqueda
          }}>
            <Feather name="search" size={25} color="black" />
          </button>
        </div>
        <div>
          <button onClick={() => navigate(-1)}>
            <Feather name="log-out" size={25} color="black" />
          </button>
        </div>
      </div>
    ) : (
      route.name === "Details" &&
      (route.params.data.user === route.params.data.author ||
        route.params.data.collaborators.includes(route.params.data.user)) && (
        <div>
          <button onClick={() => {
            route.name === "Details" ?
              navigate("/update-details", { state: { data: route.params.data, isConsultancy: route.params.isConsultancy } }) :
              navigate("/access-account", { state: { dataParams: route.params.data } });
          }}>
            <Feather name="edit" size={25} color="black" />
          </button>
        </div>
      )
    )
  );
};

export { RenderHeaderLeft, RenderHeaderRight };
