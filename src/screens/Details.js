import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Se utiliza react-router-dom para web
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // Iconos de React Icons
import "./styles/Details.css"; // Se importan los estilos CSS

export default function Details() {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const { data, isConsultancy } = location.state || {}; // Extrae los parámetros

  const formatDate = (dateTime) => {
    const [date, time, meridian] = dateTime.split(" ");
    return `${date} - ${time} ${meridian}`;
  };

  const ItemList = ({ elements }) =>
    elements.length > 0 ? (
      <div>
        {elements.map((element, index) => (
          <div key={index} className="containerItemList">
            <p className="itemPoint">•</p>
            <p>{element}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="valueDetailItem">No hay colaboradores para mostrar</p>
    );

  const DetailItem = ({ title, value, lastItem, showItem }) => (
    <div style={{ marginBottom: lastItem ? 0 : "10px" }}>
      {showItem ? (
        <button className="showMore" onClick={() => setShowMore(!showMore)}>
          <p className="showMoreValue">{value}</p>
          {showMore ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
        </button>
      ) : (
        <>
          <p className="titleDetailItem">{title}</p>
          {title === "Objetivos" || title === "Equipo" ? (
            <ItemList elements={value} />
          ) : (
            <p className="valueDetailItem">{value}</p>
          )}
        </>
      )}
      {!lastItem && <div className="separatorItem" />}
    </div>
  );

  return (
    <div className="scrollContainer">
      <div className="container">
        <div className="header">
          <img
            src={`data:image/png;base64,${data.thumbnail}`}
            alt="Thumbnail"
            className="image"
          />
          <p className="titleHeader">
            {isConsultancy ? data.nameConsultancy : data.nameScreen}
          </p>
          <p className="fatherHeader">
            {isConsultancy ? data.author : data.nameConsultancy}
          </p>
        </div>

        <div className="containerDetails">
          <DetailItem
            title="Fecha de inicio"
            value={formatDate(
              isConsultancy ? data.startDateConsultancy : data.startDateScreen
            )}
          />
          <DetailItem
            title="Fecha de fin"
            value={formatDate(
              isConsultancy ? data.endDateConsultancy : data.endDateScreen
            )}
          />
          {isConsultancy ? (
            <>
              <DetailItem title="Duración" value={data.duration} />
              <DetailItem title="Visualización" value={data.view} />
              <DetailItem title="Entidad" value={data.entity} />
              {!showMore && (
                <DetailItem value="Ver más" showItem lastItem />
              )}
              {showMore && (
                <>
                  <DetailItem
                    title="Tipo de observación"
                    value={data.observationType}
                  />
                  <DetailItem title="Ueb" value={data.ueb} />
                  <DetailItem title="Unidad" value={data.unit} />
                  <DetailItem title="Área" value={data.area} />
                  <DetailItem title="Proceso" value={data.process} />
                  <DetailItem title="Trabajador" value={data.worker} />
                  <DetailItem title="Equipo" value={data.collaborators} />
                  <DetailItem title="Objetivos" value={data.goals} />
                  {showMore && <DetailItem value="Ver menos" showItem lastItem />}
                </>
              )}
            </>
          ) : (
            <DetailItem title="Duración" value={data.duration} lastItem />
          )}
        </div>
      </div>
    </div>
  );
}
