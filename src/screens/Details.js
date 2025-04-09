import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./styles/Details.css"

export default function Details() {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const { data, isConsultancy } = location.state || {};

  const formatDate = (dateTime) => {
    // Se asume que dateTime tiene el formato "DD/MM/YYYY HH:MM:SS AM/PM"
    const [date, time, meridian] = dateTime.split(" ");
    return `${date} - ${time} ${meridian}`;
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);
    if (!startParts || !endParts) return "";

    const start = new Date(
      startParts[2],
      startParts[1] - 1,
      startParts[0],
      startParts[3],
      startParts[4],
      startParts[5]
    );
    const end = new Date(
      endParts[2],
      endParts[1] - 1,
      endParts[0],
      endParts[3],
      endParts[4],
      endParts[5]
    );
    const durationInMillis = end - start;
    const seconds = Math.floor(durationInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = remainingMinutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // Función para renderizar un elemento (puede ser objeto o string)
  const renderElement = (element) => {
    if (typeof element === "object" && element !== null) {
      return element.label || JSON.stringify(element);
    }
    return element;
  };

  const ItemList = ({ elements }) =>
    elements && elements.length > 0 ? (
      <div>
        {elements.map((element, index) => (
          <div key={index} className="containerItemList">
            <p className="itemPoint">•</p>
            <p className="valueDetailItem">{renderElement(element)}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="valueDetailItem">No hay colaboradores para mostrar</p>
    );

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) => renderElement(item)).join(", ");
      }
      return value.label || JSON.stringify(value);
    }
    return value;
  };

  const DetailItem = ({ title, value, lastItem, showItem }) => (
    <div style={{ marginBottom: lastItem ? 0 : "10px" }}>
      {showItem ? (
        <button className="showMore" onClick={() => setShowMore(!showMore)}>
          <p className="showMoreValue">{renderValue(value)}</p>
          {showMore ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
        </button>
      ) : (
        <>
          {title && <p className="titleDetailItem">{title}</p>}
          {title === "Objetivos" || title === "Equipo" ? (
            <ItemList elements={value} />
          ) : (
            <p className="valueDetailItem">{renderValue(value)}</p>
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
                  <DetailItem title="Tipo de observación" value={data.observationType} />
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
