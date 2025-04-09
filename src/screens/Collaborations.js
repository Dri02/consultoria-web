import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { FiMoreVertical, FiEye, FiEyeOff } from "react-icons/fi";
import { Buffer } from "buffer";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
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
  const [isUpdateFolderData, setIsUpdateFolderData] = useState(false);
  const [isDisableDelete, setIsDisableDelete] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  // Se espera recibir isUpdateFolderDataParams a través de location.state
  const { isUpdateFolderDataParams } = location.state || {};
  const iconRefs = useRef([]);

  // Función para obtener los datos de las carpetas
  const getFoldersData = async () => {
    const payload = JSON.stringify({
      prefix: "Consultorías TI/",
      routeName: location.pathname,
      user: user,
      isConsultancy: true,
      bucket: bucket,
    });
    console.log("Payload:", payload);
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

  // Parsear una cadena de fecha en el formato "DD/MM/YYYY HH:MM:SS"
  const parseDateString = (dateString) => {
    const parts = dateString.split(" ");
    const [day, month, year] = parts[0].split("/");
    const [hours, minutes, seconds] = parts[1].split(":");
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  };

  // Calcula la duración entre dos fechas (formateado en HH:MM:SS)
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

  // Muestra el menú contextual tomando la posición del ícono en pantalla
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

  // Función para descargar la consultoría: se usa Blob y un enlace temporal para forzar la descarga
  const downloadConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
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
      // Convertir la data a blob para descargarla
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

  // Función para eliminar la consultoría
  const deleteConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
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

  // Navegar a la pantalla de detalles pasando la información correspondiente
  const detailsConsultancy = () => {
    setShowOptions(false);
    const folderName = folderData[selectedItemIndex].name;
    navigate("/details", {
      state: {
        data: {
          user: user,
          thumbnail: folderThumbnail[folderName],
          nameConsultancy: folderName,
          startDateConsultancy: folderContent[folderName]?.startDateConsultancy,
          endDateConsultancy: folderContent[folderName]?.endDateConsultancy,
          duration: calculateDuration(
            folderContent[folderName]?.startDateConsultancy,
            folderContent[folderName]?.endDateConsultancy
          ),
          author: folderContent[folderName]?.author,
          view: folderContent[folderName]?.view,
          observationType: folderContent[folderName]?.observationType,
          entity: folderContent[folderName]?.entity,
          ueb: folderContent[folderName]?.ueb,
          unit: folderContent[folderName]?.unit,
          area: folderContent[folderName]?.area,
          process: folderContent[folderName]?.process,
          worker: folderContent[folderName]?.worker,
          collaborators: folderContent[folderName]?.collaborators,
          goals: folderContent[folderName]?.goals,
        },
        isConsultancy: true,
      },
    });
  };

  // Muestra la información de error en un modal simple
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Simula el "useFocusEffect": se ejecuta cuando user y bucket están disponibles
  useEffect(() => {
    if (user && bucket) {
      getFoldersData();
    }
  }, [user, bucket, location.pathname, isUpdateFolderData]);

  useEffect(() => {
    // Prepara los datos de las carpetas para ordenar por fecha (usamos endDate como referencia)
    const prepared = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDateConsultancy),
    }));
    prepared.sort((a, b) => b.endDate - a.endDate);
    setFolderData(prepared);
  }, [folders, folderContent, folderThumbnail]);

  useEffect(() => {
    setIsUpdateFolderData(isUpdateFolderDataParams);
  }, [isUpdateFolderDataParams]);

  useEffect(() => {
    // Reemplazamos AsyncStorage por localStorage en web
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

  return (
    <div style={styles.container}>
      {folderData.map((folder, index) => (
        <div
          key={folder.name}
          style={{
            ...styles.containerItemList,
            borderBottom: index !== folders.length - 1 ? "1px solid #E5E5E5" : "none",
          }}
          onClick={() =>
            navigate("/myconsulties", {
              state: {
                nameConsultancy: folder.name,
                author: folderContent[folder.name]?.author,
                collaborators: folderContent[folder.name]?.collaborators,
                user: user,
                bucket: bucket,
              },
            })
          }
        >
          {folderThumbnail[folder.name] && (
            <img
              src={`data:image/png;base64,${folderThumbnail[folder.name]}`}
              alt="thumbnail"
              style={styles.image}
            />
          )}
          <div style={styles.containerElementsItemList}>
            {folderContent[folder.name] && (
              <div>
                <div style={styles.headerElements}>
                  <p style={styles.titleHeaderElements}>
                    {folderContent[folder.name]?.nameConsultancy}
                  </p>
                  <p style={styles.edgeViewIcon}>
                    {folderContent[folder.name]?.view === "Privada" ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </p>
                </div>
                <p style={{ ...styles.detailsElements, ...styles.detailsAuthorElements }}>
                  {folderContent[folder.name]?.author}
                </p>
                <p style={{ ...styles.detailsElements, ...styles.detailsEntityElements }}>
                  {folderContent[folder.name]?.entity}
                </p>
                <div style={styles.containerDate}>
                  {folderContent[folder.name]?.startDateConsultancy &&
                    folderContent[folder.name]?.endDateConsultancy && (
                      <>
                        <p style={styles.detailsDateElements}>
                          {folderContent[folder.name]?.endDateConsultancy.split(" ")[0]}
                        </p>
                        <p style={{ ...styles.detailsDateElements, ...styles.detailsSeparatorElements }}>
                          {" • "}
                        </p>
                        <p style={styles.detailsDateElements}>
                          {folderContent[folder.name]?.startDateConsultancy &&
                          folderContent[folder.name]?.endDateConsultancy
                            ? calculateDuration(
                                folderContent[folder.name]?.startDateConsultancy,
                                folderContent[folder.name]?.endDateConsultancy
                              )
                            : "N/A"}
                        </p>
                      </>
                    )}
                </div>
              </div>
            )}
          </div>
          <button
            ref={(ref) => {
              // Se registra el ref para la posición del icono
              iconRefs.current[index] = ref;
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (user !== folderContent[folder.name]?.author) {
                setIsDisableDelete(true);
              } else {
                setIsDisableDelete(false);
              }
              onIconPress(index);
            }}
            style={styles.moreIconButton}
          >
            <span style={{ display: "flex", alignItems: "center" }}>⋮</span>
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
          <button style={styles.optionButton} onClick={downloadConsultancy}>
            Descargar
          </button>
          {!isDisableDelete && (
            <button style={styles.optionButton} onClick={deleteConsultancy}>
              Eliminar
            </button>
          )}
          <button style={styles.optionButton} onClick={detailsConsultancy}>
            Detalles
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "white",
    flex: 1,
    overflowY: "auto",
  },
  containerItemList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "10px 0",
    cursor: "pointer",
  },
  image: {
    width: "100px",
    height: "60px",
    borderRadius: "10px",
    marginRight: "10px",
    objectFit: "cover",
  },
  containerElementsItemList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  headerElements: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  titleHeaderElements: {
    fontSize: "16px",
    fontWeight: "bold",
    maxWidth: "90%",
    margin: 0,
  },
  edgeViewIcon: {
    marginLeft: "5px",
  },
  detailsElements: {
    color: "#888888",
    margin: 0,
  },
  detailsAuthorElements: {
    fontSize: "14px",
  },
  detailsEntityElements: {
    fontSize: "13px",
  },
  containerDate: {
    display: "flex",
    flexDirection: "row",
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
    fontSize: "20px",
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
    flexDirection: "row",
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
    background: "white",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
};
