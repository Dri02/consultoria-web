import React, { useState, useEffect } from "react";
import { data, useLocation, useNavigate } from "react-router-dom"; // Para manejar navegación y parámetros
import { FiFolder, FiChevronDown, FiEdit } from "react-icons/fi"; // Iconos
import Select from "react-select"; // Para dropdown y multiselect
import axios from "axios";
import "./styles/FormScreenDos.css"; // Estilos CSS

export default function CreateConsultancy() {
  const [nameConsultancy, setNameConsultancy] = useState("");
  const [goals, setGoals] = useState([]);
  const [observationType, setObservationType] = useState("");
  const [author, setAuthor] = useState("");
  const [bucket, setBucket] = useState("");
  const [view, setView] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [observationTypeData] = useState([
    { value: "Grabación de video", label: "Grabación de video" },
    { value: "Entrevista", label: "Entrevista" },
    { value: "Chat", label: "Chat" },
  ]);
  const [viewData] = useState([
    { value: "Pública", label: "Pública" },
    { value: "Privada", label: "Privada" },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { dataParams } = location.state || {};

  // Obtiene la lista de consultores (excluyendo al autor)
  const getConsultants = async () => {
    try {
      const response = await axios.get("http://localhost:3004/getUsers");
      const arrayResponse = response.data.filter(
        (consultant) => consultant !== author
      );
      const dataArray = arrayResponse.map((item) => ({
        value: item.trim(),
        label: item.trim(),
      }));
      setConsultants(dataArray);
    } catch (error) {
      setInfo(error.response?.data || "Error al obtener consultores");
    }
  };

  // Envía datos y navega a la pantalla de grabación si la consultoría no existe
  const sendData = async () => {
    // Validación de campos obligatorios
    if (!nameConsultancy.trim()) {
      setInfo("El nombre de la consultoría es obligatorio");
      return;
    }
    if (!bucket.trim()) {
      setInfo("El bucket no se ha definido correctamente");
      return;
    }
  
    const payload = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}`,
      bucket: bucket,
    });
    try {
      const response = await axios.post("http://localhost:3002/nameFoldersW", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const folderNames = response.data;
      if (folderNames.includes(nameConsultancy)) {
        setInfo("La consultoría ya existe");
      } else {
        navigate("/record-screen", {
          state: {
            dataParams: {
              nameConsultancy,
              author,
              observationType,
              view,
              collaborators,
              goals,
              entity: dataParams?.entity,
              ueb: dataParams?.ueb,
              unit: dataParams?.unit,
              area: dataParams?.area,
              process: dataParams?.process,
              worker: dataParams?.worker,
              bucket,
            },
          },
        });
      }
    } catch (error) {
      setInfo(error.response?.data || "Error al enviar los datos");
    }
  };

  // Muestra el modal con un mensaje
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  // Obtiene información del usuario y del bucket
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
          setAuthor(response.data.username);
          const data = JSON.stringify({ enterprise: response.data.enterprise });
          axios
            .post("http://localhost:3004/getBucket", data, {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              // Si el bucket viene vacío, se asigna un valor por defecto (ejemplo: "default_bucket")
              setBucket(response.data && response.data.trim() ? response.data : "oriente");
              console.log("Bucket obtenido:", response.data);
            })
            .catch((error) => {
              setInfo(error.response?.data || "Error al obtener bucket");
            });
        })
        .catch((error) => {
          console.log(error.response?.data);
        });
    }
  }, []);
  

  useEffect(() => {
    getConsultants();
  }, [author, bucket]);

  return (
    <div className="container">
      <div className="header">
        <FiFolder size={48} className="eyeIcon" />
        <h1 className="titleHeader">Crea observaciones</h1>
      </div>
      <div className="dataInputContainer">
        {/* Input para el nombre de la consultoría */}
        <div className="textInput">
          <input
            type="text"
            placeholder="Introduce un nombre de consultoría"
            value={nameConsultancy}
            onChange={(e) => setNameConsultancy(e.target.value)}
            className="textInputConsultancy"
          />
        </div>

        {/* Dropdown para el tipo de observación */}
        <div className="dropDown">
          <Select
            placeholder="Selecciona un tipo de observación"
            options={observationTypeData}
            value={
              observationTypeData.find(
                (option) => option.value === observationType
              ) || null
            }
            onChange={(selectedOption) =>
              setObservationType(selectedOption.value)
            }
            className="dropDownObservationType"
          />
        </div>

        {/* Dropdown para el tipo de visualización */}
        <div className="dropDown">
          <Select
            placeholder="Selecciona un tipo de visualización"
            options={viewData}
            value={viewData.find((option) => option.value === view) || null}
            onChange={(selectedOption) => setView(selectedOption.value)}
            className="dropDownView"
          />
        </div>

        {/* MultiSelect para colaboradores */}
        <div className="dropDown">
          <Select
            isMulti
            placeholder="Selecciona uno o varios colaboradores"
            options={consultants}
            value={collaborators}
            onChange={(selectedOptions) => setCollaborators(selectedOptions)}
            className="dropDownCollaborators"
          />
        </div>

        {/* Textarea para objetivos */}
        <div className="textInputO">
          <textarea
            placeholder="Introduce los objetivos"
            value={goals.join("\n")}
            onChange={(e) => {
              const text = e.target.value;
              // Separamos por líneas y filtramos líneas vacías
              const lines = text.split("\n").filter((goal) => goal.trim() !== "");
              setGoals(lines);
            }}
            className="textInputGoals"
          />
        </div>
      </div>
      <button className="buttonF" onClick={sendData}>
        Siguiente
      </button>
      {isModalVisible && (
        <div className="modalInfoOut">
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
    </div>
  );
}
