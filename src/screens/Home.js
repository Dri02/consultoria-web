import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMoreVertical, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { Buffer } from "buffer";
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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recibes isUpdateFolderDataParams, por si lo necesitas
  const { isUpdateFolderDataParams } = location.state || {};

  useEffect(() => {
    // Cuando tengamos user y bucket, cargamos la data
    if (user && bucket) {
      getFoldersData();
    }
  }, [user, bucket]);

  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: "Consultorías TI/",
      routeName: location.pathname,
      user: user,
      isConsultancy: true,
      bucket: bucket,
    });
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3002/getFoldersDataW", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener datos");
    }
  };

  const parseDateString = (dateString) => {
    if (!dateString) return new Date(1970, 0, 1);
    const parts = dateString.split(" ");
    const datePart = parts[0].split("/");
    const timePart = parts[1]?.split(":") || [0, 0, 0];
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
    if (!startDate || !endDate) return "";
    const startParts = startDate.match(/(\d+)/g);
    const endParts = endDate.match(/(\d+)/g);
    if (!startParts || !endParts) return "";

    const start = new Date(
      startParts[2], startParts[1] - 1, startParts[0],
      startParts[3], startParts[4], startParts[5]
    );
    const end = new Date(
      endParts[2], endParts[1] - 1, endParts[0],
      endParts[3], endParts[4], endParts[5]
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

  // Preparamos folderData cada vez que cambien 'folders' o 'folderContent'
  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDateConsultancy),
    }));
    // Ordenar de más reciente a más antiguo
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);
    setFolderData(preparedFolderData);
  }, [folders, folderContent]);

  useEffect(() => {
    if (isUpdateFolderDataParams !== undefined) {
      setIsUpdateFolderData(isUpdateFolderDataParams);
    }
  }, [isUpdateFolderDataParams]);

  useEffect(() => {
    // Ejemplo de cómo obtienes el usuario/bucket
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3004/me", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        })
        .then(async (response) => {
          setUser(response.data.username);
          const data = JSON.stringify({
            enterprise: response.data.enterprise,
          });
          try {
            const bucketResponse = await axios.post(
              "http://localhost:3004/getBucket",
              data,
              { headers: { "Content-Type": "application/json" } }
            );
            setBucket(bucketResponse.data);
          } catch (error) {
            setInfo(error.response?.data || "Error al obtener bucket");
          }
        })
        .catch((error) => {
          setInfo(error.response?.data || "Error al obtener usuario");
        });
    }
  }, []);

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  const onIconPress = (index) => {
    const iconRef = iconRefs.current[index];
    if (iconRef) {
      const rect = iconRef.getBoundingClientRect();
      setOptionsTop(rect.top + rect.height + window.scrollY);
      setOptionsLeft(rect.left + rect.width + window.scrollX);
      setSelectedItemIndex(index);
      setShowOptions(true);
    }
  };

  const downloadConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      nameZip: folderName,
      bucket: bucket,
    });
    try {
      const response = await axios.post("http://localhost:3002/downloadFolderW", data, {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer",
      });
      setIsUpdateFolderData(true);
      setShowOptions(false);
      const base64Data = Buffer.from(response.data, "binary").toString("base64");
      // Convertir a Blob y forzar descarga
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

  const deleteConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
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

  return (
    <div className="scrollView">
      <div className="container">
        {folderData.map((folderItem, index) => {
          const content = folderContent[folderItem.name] || {};
          return (
            <div
              key={folderItem.name}
              className="containerItemList"
              onClick={() => {
                navigate("/consultancies", {
                  state: {
                    nameConsultancy: folderItem.name,
                    author: content.author,
                    collaborators: content.collaborators,
                    user: user,
                    bucket: bucket,
                  },
                });
              }}
            >
              {folderThumbnail[folderItem.name] && (
                <img
                  src={`data:image/png;base64,${folderThumbnail[folderItem.name]}`}
                  alt="thumbnail"
                  className="image"
                />
              )}
              <div className="containerElementsItemList">
                <div className="headerElements">
                  <span className="titleHeaderElements">
                    {content.nameConsultancy || folderItem.name}
                  </span>
                  {content.view === "Privada" ? (
                    <FiEyeOff size={16} className="edgeViewIcon" />
                  ) : (
                    <FiEye size={16} className="edgeViewIcon" />
                  )}
                </div>
                <span className="detailsElements detailsAuthorElements">
                  {content.author}
                </span>
                <span className="detailsElements detailsEntityElements">
                  {content.entity}
                </span>

                {/* Fecha y duración */}
                <div className="containerDate">
                  {content.startDateConsultancy && content.endDateConsultancy && (
                    <>
                      <span className="detailsElements detailsDateElements">
                        {content.endDateConsultancy.split(" ")[0]}
                      </span>
                      <span className="detailsElements detailsDateElements detailsSeparatorElements">
                        {" • "}
                      </span>
                      <span className="detailsElements detailsDateElements">
                        {calculateDuration(
                          content.startDateConsultancy,
                          content.endDateConsultancy
                        )}
                      </span>
                    </>
                  )}
                </div>

                {/* Aquí indicamos si existe un video */}
                {content.hasVideo && (
                  <span style={{ color: "#444", fontSize: "14px", marginTop: "5px", display: "inline-block", width:"100vw"}}>
                    Video: {content.videoName || "Archivo de video"}
                  </span>
                )}
              </div>
              <div
                ref={(el) => (iconRefs.current[index] = el)}
                className="moreIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (user !== content.author) {
                    setIsDisableDelete(true);
                  } else {
                    setIsDisableDelete(false);
                  }
                  onIconPress(index);
                }}
              >
                <FiMoreVertical size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de mensajes */}
      {isModalVisible && (
        <div className="modalOverlay" onClick={() => setIsModalVisible(false)}>
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

      {/* Menú de opciones */}
      {showOptions && (
        <div className="optionsOverlay" onClick={() => setShowOptions(false)}>
          <div
            className="optionsContainer"
            style={{ top: optionsTop, left: optionsLeft - 130 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="optionButton" onClick={downloadConsultancy}>
              Descargar
            </button>
            {!isDisableDelete && (
              <button className="optionButton" onClick={deleteConsultancy}>
                Eliminar
              </button>
            )}
            <button className="optionButton" onClick={detailsConsultancy}>
              Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
