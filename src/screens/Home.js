import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMoreVertical } from "react-icons/fi";
import axios from "axios";
import "./styles/Home.css";

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
  const iconRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isUpdateFolderDataParams } = location.state || {};

  // Recupera los datos de las carpetas
  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: "Consultorías TI/",
      routeName: location.pathname,
      user,
      isConsultancy: true,
      bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/getFoldersData", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener los datos");
      setIsModalVisible(true);
    }
  };

  // Parsea una fecha en formato "dd/mm/yyyy hh:mm:ss"
  const parseDateString = (dateString) => {
    if (!dateString) return new Date();
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10));
  };

  // Calcula la duración entre dos fechas en formato "dd/mm/yyyy hh:mm:ss"
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);
    if (!startParts || !endParts) return "N/A";

    const start = new Date(startParts[2], startParts[1] - 1, startParts[0], startParts[3], startParts[4], startParts[5]);
    const end = new Date(endParts[2], endParts[1] - 1, endParts[0], endParts[3], endParts[4], endParts[5]);

    const durationInMillis = end - start;
    const seconds = Math.floor(durationInMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Maneja el clic en el icono para mostrar opciones (descargar, eliminar, detalles)
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

  // Descarga la consultoría en formato ZIP
  const downloadConsultancy = async () => {
    const folderName = folderData[selectedItemIndex]?.name;
    if (!folderName) return;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      nameZip: folderName,
      bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/downloadFolder", data, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);

      // Crea un blob y desencadena la descarga
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${folderName}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setInfo(error.response?.data || "Error al descargar la consultoría");
      setIsModalVisible(true);
    }
  };

  // Elimina la consultoría
  const deleteConsultancy = async () => {
    const folderName = folderData[selectedItemIndex]?.name;
    if (!folderName) return;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      bucket,
    });

    try {
      await axios.post("http://localhost:3002/deleteFile", data, {
        headers: { "Content-Type": "application/json" },
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      getFoldersData();
    } catch (error) {
      setInfo(error.response?.data || "Error al eliminar la consultoría");
      setIsModalVisible(true);
    }
  };

  // Navega a la vista de detalles de la consultoría
  const detailsConsultancy = () => {
    const folderName = folderData[selectedItemIndex]?.name;
    if (!folderName) return;
    setShowOptions(false);
    navigate("/details", {
      state: {
        data: {
          user,
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

  // Muestra un mensaje de error o información en un modal
  const setInfo = (info) => {
    setInfoModal(info);
    setIsModalVisible(true);
  };

  // Obtiene los datos de usuario y bucket usando el token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3004/me", {
          headers: { "Content-Type": "application/json", "x-access-token": token },
        })
        .then(async (response) => {
          setUser(response.data.username);
          const data = JSON.stringify({ enterprise: response.data.enterprise });
          try {
            const bucketResponse = await axios.post("http://localhost:3004/getBucket", data, {
              headers: { "Content-Type": "application/json" },
            });
            setBucket(bucketResponse.data);
          } catch (error) {
            setInfo(error.response?.data || "Error al obtener el bucket");
          }
        })
        .catch((error) => {
          setInfo(error.response?.data || "Error al obtener los datos del usuario");
        });
    }
  }, []);

  // Actualiza las carpetas cuando user y bucket estén definidos
  useEffect(() => {
    if (user && bucket) {
      getFoldersData();
    }
  }, [user, bucket]);

  // Prepara y ordena los datos de carpeta basándose en la fecha de fin
  useEffect(() => {
    const preparedData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDateConsultancy),
    }));
    preparedData.sort((a, b) => b.endDate - a.endDate);
    setFolderData(preparedData);
  }, [folders, folderContent]);

  // Permite actualizar el estado al recibir parámetros de actualización desde la navegación
  useEffect(() => {
    setIsUpdateFolderData(isUpdateFolderDataParams);
  }, [isUpdateFolderDataParams]);

  return (
    <div className="container">
      {folderData.map((folderItem, index) => {
        const folderName = folderItem.name;
        return (
          <div
            key={folderName}
            className="containerItemList"
            style={{
              borderBottom: index !== folders.length - 1 ? "1px solid #E5E5E5" : "none",
            }}
            onClick={() =>
              navigate("/consultancies", {
                state: {
                  nameConsultancy: folderName,
                  author: folderContent[folderName]?.author,
                  collaborators: folderContent[folderName]?.collaborators,
                  user,
                  bucket,
                },
              })
            }
          >
            {folderThumbnail[folderName] && (
              <img
                src={`data:image/png;base64,${folderThumbnail[folderName]}`}
                alt="Thumbnail"
                className="image"
              />
            )}
            <div className="containerElementsItemList">
              {folderContent[folderName] && (
                <div>
                  <div className="headerElements">
                    <p className="titleHeaderElements">{folderContent[folderName]?.nameConsultancy}</p>
                    {folderContent[folderName]?.view === "Privada" ? (
                      <FiEyeOff className="edgeViewIcon" />
                    ) : (
                      <FiEye className="edgeViewIcon" />
                    )}
                  </div>
                  <p className="detailsElements detailsAuthorElements">{folderContent[folderName]?.author}</p>
                  <p className="detailsElements detailsEntityElements">{folderContent[folderName]?.entity}</p>
                  <div className="containerDate">
                    {folderContent[folderName]?.startDateConsultancy &&
                      folderContent[folderName]?.endDateConsultancy && (
                        <>
                          <p className="detailsElements detailsDateElements">
                            {folderContent[folderName]?.endDateConsultancy.split(" ")[0]}
                          </p>
                          <p className="detailsElements detailsDateElements detailsSeparatorElements"> • </p>
                          <p className="detailsElements detailsDateElements">
                            {calculateDuration(
                              folderContent[folderName]?.startDateConsultancy,
                              folderContent[folderName]?.endDateConsultancy
                            )}
                          </p>
                        </>
                      )}
                  </div>
                </div>
              )}
            </div>
            <div
              ref={(ref) => {
                iconRefs.current[index] = ref;
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (user !== folderContent[folderName]?.author) {
                  setIsDisableDelete(true);
                } else {
                  setIsDisableDelete(false);
                }
                onIconPress(index);
              }}
            >
              <FiMoreVertical className="moreIcon" />
            </div>
          </div>
        );
      })}

      {isModalVisible && (
        <div className="modalInfoOut" onClick={() => setIsModalVisible(false)}>
          <div className="modalInfo" onClick={(e) => e.stopPropagation()}>
            <p className="modalInfoTextHeader">{infoModal}</p>
            <div className="containerModalInfoButton">
              <button className="modalInfoButton" onClick={() => setIsModalVisible(false)}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="optionsModal" style={{ top: optionsTop, left: optionsLeft }}>
          <button onClick={downloadConsultancy}>Descargar</button>
          {!isDisableDelete && <button onClick={deleteConsultancy}>Eliminar</button>}
          <button onClick={detailsConsultancy}>Detalles</button>
        </div>
      )}
    </div>
  );
}
