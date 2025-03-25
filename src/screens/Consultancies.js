import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router"; // Para manejar la navegación y los parámetros
import { FiMoreVertical, FiX } from "react-icons/fi"; // Iconos de React Icons
import axios from "axios";
//import "./styles/Consultancies.css"; // Estilos CSS

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
  const { nameConsultancy, author, collaborators, user, bucket } = location.state || {}; // Extrae los parámetros
  const iconRefs = useRef([]);

  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/`,
      isConsultancy: false,
      bucket: bucket,
    });

    await axios
      .post("http://localhost:3002/getFoldersData", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setFolders(response.data.folderNames);
        setFolderContent(response.data.folderContent);
        setFolderThumbnail(response.data.folderThumbnail);
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
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

    await axios
      .post("http://localhost:3002/downloadFolder", data, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      })
      .then(async (response) => {
        setIsUpdateFolderData(true);
        setShowOptions(false);

        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${folderName}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
  };

  const deleteScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      bucket: bucket,
    });

    await axios
      .post("http://localhost:3002/deleteFile", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        setIsUpdateFolderData(true);
        setShowOptions(false);
        getFoldersData();
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
  };

  const detailsScreen = async () => {
    setShowOptions(false);

    const folderName = folderData[selectedItemIndex].name;
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

    await axios
      .post("http://localhost:3002/fileUrl", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        setIsUpdateFolderData(true);
        setVideoUrl(response.data);
        setIsVideoVisible(true);
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
    getFoldersData();
  }, []);

  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDate),
    }));
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);

    setFolderData(preparedFolderData);
  }, [folderThumbnail]);

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
              >
                <FiX size={25} color="white" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="scrollContainer">
        <div className="container">
          {folderData.map((folderName, index) => (
            <div
              key={folderName.name}
              className="containerItemList"
              style={{
                borderBottom:
                  index !== folders.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
              onClick={() => {
                playScreen(folderData[index].name);
                setSelectedVideoName(folderData[index].name);
              }}
            >
              {folderThumbnail[folderName.name] && (
                <img
                  src={`data:image/png;base64,${folderThumbnail[folderName.name]}`}
                  alt="Thumbnail"
                  className="image"
                  style={{
                    border:
                      folderData[index].name === selectedVideoName && isVideoVisible
                        ? "2px solid #3366FF"
                        : "none",
                  }}
                />
              )}
              <div className="containerElementsItemList">
                {folderContent[folderName.name] && (
                  <div>
                    <p className="titleHeaderElements">
                      {folderContent[folderName.name]?.nameScreen}
                    </p>
                    <p className="detailsElements detailsConsultancyElements">
                      {folderContent[folderName.name]?.nameConsultancy}
                    </p>
                    <div className="containerDate">
                      {folderContent[folderName.name]?.startDate &&
                        folderContent[folderName.name]?.endDate && (
                          <>
                            <p className="detailsElements detailsDateElements">
                              {folderContent[folderName.name]?.endDate.split(" ")[0]}
                            </p>
                            <p className="detailsElements detailsDateElements detailsSeparatorElements">
                              {" • "}
                            </p>
                            <p className="detailsElements detailsDateElements">
                              {calculateDuration(
                                folderContent[folderName.name]?.startDate,
                                folderContent[folderName.name]?.endDate
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
                  if (user !== author) {
                    setIsDisableDelete(true);
                  } else {
                    setIsDisableDelete(false);
                  }
                  onIconPress(index);
                }}
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
        <div className="modalOptionsOut">
          <div
            className="modalOptions"
            style={{
              top: optionsTop,
              left: optionsLeft - 130,
            }}
          >
            <button
              onClick={() => {
                downloadScreen();
              }}
              className="optionButton"
            >
              Descargar
            </button>
            {!isDisableDelete && (
              <button
                onClick={() => {
                  deleteScreen();
                }}
                className="optionButton"
              >
                Eliminar
              </button>
            )}
            <button
              onClick={() => {
                detailsScreen();
              }}
              className="optionButton"
            >
              Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}