import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para manejar la navegación y los parámetros
import { FiEye, FiEyeOff, FiMoreVertical } from "react-icons/fi"; // Iconos de Feather
import axios from "axios";
import "./styles/Home.css"; // Estilos CSS

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
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { isUpdateFolderDataParams } = location.state || {};
  const iconRefs = useRef([]);

  const getFoldersData = async () => {
    const data = JSON.stringify({
      prefix: 'Consultorías TI/',
      routeName: location.pathname,
      user: user,
      isConsultancy: true,
      bucket: bucket
    });

    await axios.post('http://localhost:3002/getFoldersData', data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      setFolders(response.data.folderNames);
      setFolderContent(response.data.folderContent);
      setFolderThumbnail(response.data.folderThumbnail);
    }).catch(error => {
      setInfo(error.response?.data || "Error al obtener los datos");
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

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const onIconPress = (index) => {
    const iconRef = iconRefs.current[index];
    const rect = iconRef.getBoundingClientRect();
    setOptionsTop(rect.bottom);
    setOptionsLeft(rect.left);
    setSelectedItemIndex(index);
    setShowOptions(true);
  };

  const downloadConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      nameZip: folderName,
      bucket: bucket,
    });

    await axios.post("http://localhost:3002/downloadFolder", data, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
    }).then(async response => {
      setIsUpdateFolderData(true);
      setShowOptions(false);

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${folderName}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(error => {
      setInfo(error.response?.data || "Error al descargar la consultoría");
    });
  };

  const deleteConsultancy = async () => {
    const folderName = folderData[selectedItemIndex].name;
    const data = JSON.stringify({
      prefix: `Consultorías TI/${folderName}/`,
      bucket: bucket,
    });

    await axios.post("http://localhost:3002/deleteFile", data, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async response => {
      setIsUpdateFolderData(true);
      setShowOptions(false);
      getFoldersData();
    }).catch(error => {
      setInfo(error.response?.data || "Error al eliminar la consultoría");
    });
  };

  const detailsConsultancy = async () => {
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
          goals: folderContent[folderName]?.goals
        },
        isConsultancy: true
      }
    });
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    if (user && bucket) {
      getFoldersData();
    }
  }, [user, bucket]);

  useEffect(() => {
    const preparedFolderData = folders.map((folderName) => ({
      name: folderName,
      endDate: parseDateString(folderContent[folderName]?.endDateConsultancy),
    }));
    preparedFolderData.sort((a, b) => b.endDate - a.endDate);

    setFolderData(preparedFolderData);
  }, [folderThumbnail]);

  useEffect(() => {
    setIsUpdateFolderData(isUpdateFolderDataParams);
  }, [isUpdateFolderDataParams]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get("http://localhost:3004/me", {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
      }).then(async response => {
        setUser(response.data.username);

        const data = JSON.stringify({
          enterprise: response.data.enterprise
        });

        await axios.post("http://localhost:3004/getBucket", data, {
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(async response => {
          setBucket(response.data);
        }).catch(error => {
          setInfo(error.response?.data || "Error al obtener el bucket");
        });
      }).catch(error => {
        setInfo(error.response?.data || "Error al obtener los datos del usuario");
      });
    }
  }, []);

  return (
    <div className="container">
      {folderData.map((folderName, index) => (
        <div
          key={folderName.name}
          className="containerItemList"
          style={{ borderBottom: index !== folders.length - 1 ? "1px solid #E5E5E5" : "none" }}
          onClick={() => {
            navigate("/consultancies", {
              state: {
                nameConsultancy: folderData[index].name,
                author: folderContent[folderName.name].author,
                collaborators: folderContent[folderName.name].collaborators,
                user: user,
                bucket: bucket
              }
            });
          }}
        >
          {folderThumbnail[folderName.name] && (
            <img
              src={`data:image/png;base64,${folderThumbnail[folderName.name]}`}
              alt="Thumbnail"
              className="image"
            />
          )}
          <div className="containerElementsItemList">
            {folderContent[folderName.name] && (
              <div>
                <div className="headerElements">
                  <p className="titleHeaderElements">
                    {folderContent[folderName.name]?.nameConsultancy}
                  </p>
                  {folderContent[folderName.name]?.view === "Privada" ? (
                    <FiEyeOff className="edgeViewIcon" />
                  ) : (
                    <FiEye className="edgeViewIcon" />
                  )}
                </div>
                <p className="detailsElements detailsAuthorElements">
                  {folderContent[folderName.name]?.author}
                </p>
                <p className="detailsElements detailsEntityElements">
                  {folderContent[folderName.name]?.entity}
                </p>
                <div className="containerDate">
                  {folderContent[folderName.name]?.startDateConsultancy &&
                    folderContent[folderName.name]?.endDateConsultancy && (
                      <>
                        <p className="detailsElements detailsDateElements">
                          {folderContent[folderName.name]?.endDateConsultancy.split(" ")[0]}
                        </p>
                        <p className="detailsElements detailsDateElements detailsSeparatorElements">
                          {" • "}
                        </p>
                        <p className="detailsElements detailsDateElements">
                          {calculateDuration(
                            folderContent[folderName.name]?.startDateConsultancy,
                            folderContent[folderName.name]?.endDateConsultancy
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
              if (user !== folderContent[folderName.name]?.author) {
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
      ))}
      {isModalVisible && (
        <div className="modalInfoOut" onClick={() => setIsModalVisible(false)}>
          <div className="modalInfo">
            <p className="modalInfoTextHeader">{infoModal}</p>
            <div className="containerModalInfoButton">
              <button
                className="modalInfoButton"
                onClick={() => setIsModalVisible(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      {showOptions && (
        <div
          className="optionsModal"
          style={{ top: optionsTop, left: optionsLeft }}
        >
          <button onClick={downloadConsultancy}>Descargar</button>
          {!isDisableDelete && <button onClick={deleteConsultancy}>Eliminar</button>}
          <button onClick={detailsConsultancy}>Detalles</button>
        </div>
      )}
    </div>
  );
}