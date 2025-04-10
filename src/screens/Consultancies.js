import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMoreVertical, FiX } from "react-icons/fi";

export default function Consultancies() {
  const [folders, setFolders] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [folderContent, setFolderContent] = useState({});
  const [folderThumbnail, setFolderThumbnail] = useState({});
  const [user, setUser] = useState("");
  const [bucket, setBucket] = useState("");
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

  const location = useLocation();
  const navigate = useNavigate();
  // Se obtienen los parámetros enviados a través de location.state
  const { state } = location;
  const { nameConsultancy, author, collaborators } = state || {};
  
  const iconRefs = useRef([]);

  // Obtiene los datos de las carpetas para la consultoría actual
  const getFoldersData = async () => {
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/`,
      isConsultancy: false,
      bucket: bucket,
    });
    try {
      const response = await axios.post("http://localhost:3002/getFoldersDataW", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener datos");
    }
  };

  // Función que parsea una fecha en formato "DD/MM/YYYY HH:MM:SS"
  const parseDateString = (dateString) => {
    if (!dateString) return new Date();
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  };

  // Calcula la duración entre dos fechas y la retorna en formato HH:MM:SS
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
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Obtiene la posición del ícono con getBoundingClientRect y muestra el menú contextual
  const onIconPress = (index) => {
    const iconRef = iconRefs.current[index];
    if (iconRef) {
      const rect = iconRef.getBoundingClientRect();
      setOptionsTop(rect.top + rect.height);
      setOptionsLeft(rect.left + rect.width);
      setSelectedItemIndex(index);
      setShowOptions(true);
    }
  };

  // Descarga la carpeta, convirtiendo la respuesta en Blob para forzar la descarga en web
  const downloadScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      nameZip: folderName,
      bucket: bucket,
    });
    try {
      const response = await axios.post("http://localhost:3002/downloadFolderW", payload, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      const base64Data = Buffer.from(response.data, "binary").toString("base64");
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      console.log("Zip file downloaded");
    } catch (error) {
      setInfo(error.response?.data || "Error al descargar");
    }
  };

  // Elimina la carpeta
  const deleteScreen = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
      bucket: bucket,
    });
    try {
      await axios.post("http://localhost:3002/deleteFile", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      getFoldersData();
    } catch (error) {
      setInfo(error.response?.data || "Error al eliminar");
    }
  };

  // Navega a la pantalla de detalles pasando la información necesaria
  const detailsScreen = () => {
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

  // Reproduce el video obteniendo la URL desde el endpoint
  const playScreen = async (nameScreen) => {
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${nameScreen}/screen.mp4`,
      bucket: bucket,
    });
    try {
      const response = await axios.post("http://localhost:3002/fileUrlW", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdateFolderData(true);
      setVideoUrl(response.data);
      setIsVideoVisible(true);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener video");
    }
  };

  // Muestra el modal de error/información
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Al montar el componente, obtenemos el token y luego el bucket y posteriormente los datos de carpeta
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
          setUser(response.data.username);
          const payload = JSON.stringify({
            enterprise: response.data.enterprise,
          });
          axios
            .post("http://localhost:3004/getBucket", payload, {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              setBucket(response.data);
            })
            .catch((error) => {
              setInfo(error.response?.data || "Error al obtener bucket");
            });
        })
        .catch((error) => {
          setInfo(error.response?.data || "Error al obtener usuario");
        });
    }
  }, []);

  // Cada vez que se actualicen las carpetas, preparamos la data ordenándola por fecha
  useEffect(() => {
    if (folders.length > 0) {
      const preparedFolderData = folders.map((folderName) => ({
        name: folderName,
        endDate: parseDateString(folderContent[folderName]?.endDate),
      }));
      preparedFolderData.sort((a, b) => b.endDate - a.endDate);
      setFolderData(preparedFolderData);
    }
  }, [folderThumbnail, folders, folderContent]);

  // Cuando el bucket y el usuario estén listos, obtenemos los datos
  useEffect(() => {
    if (user && bucket) {
      getFoldersData();
    }
  }, [user, bucket]);


  return (
    <div style={{ flexGrow: 1 }}>
      {/* Video overlay */}
      {isVideoVisible && videoUrl && (
        <div style={styles.containerVideo}>
         <video
         style={styles.video}
         controls
         autoPlay
         playsInline
         onEnded={() => setIsVideoVisible(true)}
         onPause={() => setIsElementVideoVisible(true)}
         onPlay={() => setIsElementVideoVisible(true)}
         >
          <source
          src={videoUrl.startsWith("data:") ? videoUrl : `data:video/mp4;base64,${videoUrl}`}
          type="video/mp4"
          />
          </video>
          {isElementVideoVisible && (
            <div style={styles.headerVideo}>
              <p style={styles.titleVideo} title={selectedVideoName}>{selectedVideoName}</p>
              <button
                onClick={() => setIsVideoVisible(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <FiX size={25} color="white" />
              </button>
            </div>
          )}
        </div>
      )}
      {/* Lista de carpetas */}
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {folderData.map((folder, index) => (
          <div
            key={folder.name}
            style={{
              ...styles.containerItemList,
              borderBottom: index !== folders.length - 1 ? "1px solid #E5E5E5" : "none"
            }}
            onClick={() => {
              playScreen(folder.name);
              setSelectedVideoName(folder.name);
            }}
          >
            {folderThumbnail[folder.name] && (
              <img
                src={`data:image/png;base64,${folderThumbnail[folder.name]}`}
                alt="thumbnail"
                style={{
                  ...styles.image,
                  border:
                    folder.name === selectedVideoName && isVideoVisible
                      ? "2px solid #3366FF"
                      : "none"
                }}
              />
            )}
            <div style={styles.containerElementsItemList}>
              {folderContent[folder.name] && (
                <div>
                  <p style={styles.titleHeaderElements}>
                    {folderContent[folder.name]?.nameScreen}
                  </p>
                  <p style={{ ...styles.detailsElements, ...styles.detailsConsultancyElements }}>
                    {folderContent[folder.name]?.nameConsultancy}
                  </p>
                  <div style={styles.containerDate}>
                    {folderContent[folder.name]?.startDate &&
                      folderContent[folder.name]?.endDate && (
                        <>
                          <p style={styles.detailsDateElements}>
                            {folderContent[folder.name]?.endDate.split(" ")[0]}
                          </p>
                          {/* <p style={{ ...styles.detailsDateElements, ...styles.detailsSeparatorElements }}>
                            {" • "}
                          </p>
                          <p style={styles.detailsDateElements}>
                            {folderContent[folder.name]?.startDate &&
                            folderContent[folder.name]?.endDate
                              ? calculateDuration(
                                  folderContent[folder.name]?.startDate,
                                  folderContent[folder.name]?.endDate
                                )
                              : "N/A"}
                          </p> */}
                        </>
                      )}
                  </div>
                </div>
              )}
            </div>
            <button
              ref={(ref) => {
                // Registra el ref para luego obtener su posición
                const oldIconRef = iconRefs.current[0];
                iconRefs.current[index] = ref;
                if (isUpdateFolderData) {
                  const nullIndex = iconRefs.current.findIndex(r => r === null);
                  if (nullIndex !== -1) {
                    iconRefs.current.splice(nullIndex, 1);
                  } else if (iconRefs.current[0] !== null) {
                    iconRefs.current.unshift(null);
                    iconRefs.current[index] = ref;
                    iconRefs.current[1] = oldIconRef;
                  }
                }
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
              style={styles.moreIconButton}
            >
              <FiMoreVertical size={22} color="black" />
            </button>
          </div>
        ))}
        {isModalVisible && (
          <div style={styles.modalOverlay} onClick={() => setIsModalVisible(false)}>
            <div style={styles.modalInfo} onClick={(e) => e.stopPropagation()}>
              <p style={styles.modalInfoTextHeader}>{infoModal}</p>
              <div style={styles.containerModalInfoButton}>
                <button style={styles.modalInfoButton} onClick={() => setIsModalVisible(false)}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Menú contextual */}
      {showOptions && (
        <div
          style={{
            position: "fixed",
            top: optionsTop,
            left: optionsLeft - 130,
            backgroundColor: "white",
            borderRadius: 20,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            width: 130,
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button style={styles.optionButton} onClick={downloadScreen}>
            Descargar
          </button>
          {!isDisableDelete && (
            <button style={styles.optionButton} onClick={deleteScreen}>
              Eliminar
            </button>
          )}
          <button style={styles.optionButton} onClick={detailsScreen}>
            Detalles
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  containerVideo: {
    padding: "5px",
    backgroundColor: "white",
    marginBottom: "20px",
  },
  video: {
    width: "100%",
    height: "215px",
    objectFit: "contain",
  },
  headerVideo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: "5px",
    left: "5px",
    right: "5px",
    padding: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  titleVideo: {
    color: "white",
    fontSize: "14px",
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  containerElementsItemList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  containerItemList: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: "10px 0",
    cursor: "pointer",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "5px",
    marginRight: "10px",
    objectFit: "cover",
  },
  titleHeaderElements: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
  detailsElements: {
    color: "#888888",
    margin: 0,
  },
  detailsConsultancyElements: {
    fontSize: "13px",
  },
  containerDate: {
    display: "flex",
    alignItems: "center",
  },
  detailsDateElements: {
    fontSize: "12px",
    margin: 0,
  },
  detailsSeparatorElements: {
    margin: "0 5px",
  },
  moreIconButton: {
    marginLeft: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalInfo: {
    backgroundColor: "white",
    margin: "20px",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
  },
  modalInfoTextHeader: {
    textAlign: "center",
    fontWeight: "bold",
  },
  containerModalInfoButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: "25px",
  },
  modalInfoButton: {
    background: "#007bff",
    border: "none",
    padding: "10px 20px",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
  optionButton: {
    padding: "10px 20px",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
};
