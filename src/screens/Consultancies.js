import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/Consultancies.css";

export default function MyConsultancies() {
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

  // Se obtiene los parámetros de la URL o estado global
  const location = useLocation();
  const navigate = useNavigate();
  const { nameConsultancy, author, collaborators, user, bucket } = location.state || {};
  const iconRefs = useRef([]);

  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/`,
      isConsultancy: true,
      bucket: bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/getFoldersDataW", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    } catch (error) {
      setInfo(error.response.data);
    }
  };

  const parseDateString = (dateString) => {
    const parts = dateString.split(" ");
    const datePart = parts[0].split("/");
    const timePart = parts[1].split(":");
    return new Date(
      parseInt(datePart[2], 10),
      parseInt(datePart[1], 10) - 1,
      parseInt(datePart[0], 10),
      parseInt(timePart[0], 10),
      parseInt(timePart[1], 10),
      parseInt(timePart[2], 10)
    );
  };

  const calculateDuration = (startDate, endDate) => {
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);

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

  const downloadScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      nameZip: folderName,
      bucket: bucket,
    });

    try {
      await axios.post("http://localhost:3002/downloadFolderW", data, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      // Aquí se implementa la lógica para descargar el archivo en el navegador
    } catch (error) {
      setInfo(error.response.data);
    }
  };

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
      setInfo(error.response.data);
    }
  };

  const detailsScreen = async () => {
    setShowOptions(false);
    const folderName = folderData[selectedItemIndex].name;
    // Redirige usando useNavigate, pasando los parámetros necesarios en state
    navigate("/details", {
      state: {
        data: {
          user: user,
          thumbnail: folderThumbnail[folderName],
          nameScreen: folderName,
          nameConsultancy: nameConsultancy,
          startDateScreen: folderContent[folderName]?.startDate,
          endDateScreen: folderContent[folderName]?.endDate,
          duration: calculateDuration(
            folderContent[folderName]?.startDate,
            folderContent[folderName]?.endDate
          ),
          author: author,
          collaborators: collaborators,
        },
        isConsultancy: false,
      },
    });
  };

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
      setInfo(error.response.data);
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    getFoldersData();
  }, []);

  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDate),
    }));
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);
    setFolderData(preparedFolderData);
  }, [folderThumbnail, folders, folderContent]);

  return (
    <div className="app-container">
      {isVideoVisible && videoUrl && (
        <div className="video-container">
          <video
            src={videoUrl}
            className="video"
            controls
            autoPlay
            onEnded={() => setIsVideoVisible(false)}
            onPause={() => setIsElementVideoVisible(true)}
            onPlay={() => setIsElementVideoVisible(false)}
          />
          {isElementVideoVisible && (
            <div className="header-video">
              <span className="title-video">{selectedVideoName}</span>
              <button onClick={() => setIsVideoVisible(false)} className="close-button">
                <FiX size={25} color="white" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="scroll-view">
        <div className="container">
          {folderData.map((folder, index) => (
            <div
              key={folder.name}
              className={`item-list ${index !== folders.length - 1 ? "border-bottom" : ""}`}
              onClick={() => {
                playScreen(folder.name);
                setSelectedVideoName(folder.name);
              }}
            >
              {folderThumbnail[folder.name] && (
                <img
                  src={`data:image/png;base64,${folderThumbnail[folder.name]}`}
                  alt={folder.name}
                  className={`image ${folder.name === selectedVideoName && isVideoVisible ? "selected" : ""}`}
                />
              )}
              <div className="item-details">
                {folderContent[folder.name] && (
                  <div>
                    <div className="title-header">
                      {folderContent[folder.name]?.nameScreen}
                    </div>
                    <div className="details">
                      {folderContent[folder.name]?.nameConsultancy}
                    </div>
                    <div className="date-container">
                      {folderContent[folder.name]?.startDate &&
                        folderContent[folder.name]?.endDate && (
                          <>
                            <span className="date">
                              {folderContent[folder.name]?.endDate.split(" ")[0]}
                            </span>
                            <span className="separator">{" • "}</span>
                            <span className="date">
                              {calculateDuration(
                                folderContent[folder.name]?.startDate,
                                folderContent[folder.name]?.endDate
                              )}
                            </span>
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
                  if (user !== author) {
                    setIsDisableDelete(true);
                  } else {
                    setIsDisableDelete(false);
                  }
                  onIconPress(index);
                }}
                className="more-icon-button"
              >
                <FiMoreVertical size={22} color="black" />
              </button>
            </div>
          ))}

          {isModalVisible && (
            <div className="modal-out" onClick={() => setIsModalVisible(false)}>
              <div className="modal-info" onClick={(e) => e.stopPropagation()}>
                <div className="modal-info-header">{infoModal}</div>
                <div className="modal-info-button-container">
                  <button className="modal-info-button" onClick={() => setIsModalVisible(false)}>
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showOptions && (
          <div className="options-modal" onClick={() => setShowOptions(false)}>
            <div
              className="options-container"
              style={{ top: optionsTop, left: optionsLeft - 130 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={downloadScreen} className="option-button">
                Descargar
              </button>
              {!isDisableDelete && (
                <button onClick={deleteScreen} className="option-button">
                  Eliminar
                </button>
              )}
              <button onClick={detailsScreen} className="option-button">
                Detalles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
