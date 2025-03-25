import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usar react-router-dom para web
import { FiMoreVertical, FiX } from "react-icons/fi"; // Iconos de React Icons
import axios from "axios";
import "./styles/Consultancies.css"; // Se importan los estilos CSS

export default function Consultancy() {
  const [folders, setFolders] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [folderContent, setFolderContent] = useState({});
  const [folderThumbnail, setFolderThumbnail] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [optionsTop, setOptionsTop] = useState(0);
  const [optionsLeft, setOptionsLeft] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);
  const [isDisableDelete, setIsDisableDelete] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isElementVideoVisible, setIsElementVideoVisible] = useState(false);

  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { nameConsultancy, author, collaborators, user, bucket } = location.state || {};
  const iconRefs = useRef([]);

  // Función para obtener los datos de las carpetas
  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/`,
      isConsultancy: false,
      bucket: bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/getFoldersData", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener datos");
    }
  };

  // Convierte una cadena de fecha en objeto Date
  const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(num => parseInt(num, 10));
    const [hour, minute, second] = timePart.split(":").map(num => parseInt(num, 10));
    return new Date(year, month - 1, day, hour, minute, second);
  };

  // Calcula la duración entre dos fechas en formato HH:MM:SS
  const calculateDuration = (startDate, endDate) => {
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);

    const start = new Date(
      parseInt(startParts[2], 10),
      parseInt(startParts[1], 10) - 1,
      parseInt(startParts[0], 10),
      parseInt(startParts[3], 10),
      parseInt(startParts[4], 10),
      parseInt(startParts[5], 10)
    );

    const end = new Date(
      parseInt(endParts[2], 10),
      parseInt(endParts[1], 10) - 1,
      parseInt(endParts[0], 10),
      parseInt(endParts[3], 10),
      parseInt(endParts[4], 10),
      parseInt(endParts[5], 10)
    );

    const durationInMillis = end - start;
    const seconds = Math.floor(durationInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Muestra las opciones de descarga, eliminar y detalles
  const onIconPress = (index) => {
    const iconRef = iconRefs.current[index];
    if (iconRef) {
      const rect = iconRef.getBoundingClientRect();
      setOptionsTop(rect.bottom);
      setOptionsLeft(rect.left);
      setSelectedItemIndex(index);
      setShowOptions(true);
    }
  };

  // Función para descargar la carpeta (descarga del zip)
  const downloadScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      nameZip: folderName,
      bucket: bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/downloadFolder", data, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setInfo(error.response?.data || "Error al descargar");
    }
  };

  // Función para eliminar la carpeta
  const deleteScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      bucket: bucket,
    });

    try {
      await axios.post("http://localhost:3002/deleteFile", data, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      getFoldersData();
    } catch (error) {
      setInfo(error.response?.data || "Error al eliminar");
    }
  };

  // Navega a la pantalla de detalles con los datos necesarios
  const detailsScreen = () => {
    setShowOptions(false);
    const folderName = folderData[selectedItemIndex].name;
    navigate("/details", {
      state: {
        data: {
          user,
          thumbnail: folderThumbnail[folderName],
          nameScreen: folderName,
          nameConsultancy,
          startDateScreen: folderContent[folderName]?.startDate,
          endDateScreen: folderContent[folderName]?.endDate,
          duration: calculateDuration(
            folderContent[folderName]?.startDate,
            folderContent[folderName]?.endDate
          ),
          author,
          collaborators,
        },
        isConsultancy: false,
      },
    });
  };

  // Reproduce el video asociado a la carpeta
  const playScreen = async (nameScreen) => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${nameScreen}/screen.mp4`,
      bucket: bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/fileUrl", data, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdateFolderData(true);
      setVideoUrl(response.data);
      setIsVideoVisible(true);
    } catch (error) {
      setInfo(error.response?.data || "Error al reproducir el video");
    }
  };

  // Muestra el modal de error o información
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Se obtiene la información de las carpetas al montar el componente
  useEffect(() => {
    getFoldersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prepara y ordena la información de las carpetas en base a la fecha de finalización
  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDate),
    }));
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);
    setFolderData(preparedFolderData);
  }, [folders, folderContent]);

  return (
    <div className="container">
      {isVideoVisible && videoUrl && (
        <div className="containerVideo">
          <video
            src={videoUrl}
            className="video"
            controls
            onEnded={() => setIsVideoVisible(false)}
          />
          {isElementVideoVisible && (
            <div className="headerVideo">
              <p className="titleVideo">{selectedVideoName}</p>
              <button
                onClick={() => {
                  setIsVideoVisible(false);
                }}
                className="closeButton"
              >
                <FiX size={25} color="white" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="scrollContainer">
        <div className="container">
          {folderData.map((folderItem, index) => (
            <div
              key={folderItem.name}
              className="containerItemList"
              style={{
                borderBottom:
                  index !== folders.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
              onClick={() => {
                playScreen(folderItem.name);
                setSelectedVideoName(folderItem.name);
              }}
            >
              {folderThumbnail[folderItem.name] && (
                <img
                  src={`data:image/png;base64,${folderThumbnail[folderItem.name]}`}
                  alt="Thumbnail"
                  className="image"
                  style={{
                    border:
                      folderItem.name === selectedVideoName && isVideoVisible
                        ? "2px solid #3366FF"
                        : "none",
                  }}
                />
              )}
              <div className="containerElementsItemList">
                {folderContent[folderItem.name] && (
                  <div>
                    <p className="titleHeaderElements">
                      {folderContent[folderItem.name]?.nameScreen}
                    </p>
                    <p className="detailsElements detailsConsultancyElements">
                      {folderContent[folderItem.name]?.nameConsultancy}
                    </p>
                    <div className="containerDate">
                      {folderContent[folderItem.name]?.startDate &&
                        folderContent[folderItem.name]?.endDate && (
                          <>
                            <p className="detailsElements detailsDateElements">
                              {folderContent[folderItem.name]?.endDate.split(" ")[0]}
                            </p>
                            <p className="detailsElements detailsDateElements detailsSeparatorElements">
                              {" • "}
                            </p>
                            <p className="detailsElements detailsDateElements">
                              {calculateDuration(
                                folderContent[folderItem.name]?.startDate,
                                folderContent[folderItem.name]?.endDate
                              )}
                            </p>
                          </>
                        )}
                    </div>
                  </div>
                )}
              </div>
              <button
                ref={(ref) => {
                  iconRefs.current[index] = ref;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Se deshabilita eliminar si el usuario actual no es el autor
                  setIsDisableDelete(user !== author);
                  onIconPress(index);
                }}
                className="iconButton"
              >
                <FiMoreVertical size={22} className="moreIcon" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {isModalVisible && (
        <div className="modalInfoOut">
          <div className="modalInfo">
            <p className="modalInfoTextHeader">{infoModal}</p>
            <div className="containerModalInfoButton">
              <button
                className="modalInfoButton"
                onClick={() => {
                  setIsModalVisible(false);
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      {showOptions && (
        <div className="modalOptionsOut" onClick={() => setShowOptions(false)}>
          <div
            className="modalOptions"
            style={{
              top: optionsTop,
              left: optionsLeft - 130,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={downloadScreen} className="optionButton">
              Descargar
            </button>
            {!isDisableDelete && (
              <button onClick={deleteScreen} className="optionButton">
                Eliminar
              </button>
            )}
            <button onClick={detailsScreen} className="optionButton">
              Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
