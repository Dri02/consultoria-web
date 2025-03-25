import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para manejar la navegación y los parámetros
import { FiFolder, FiChevronDown, FiEdit } from "react-icons/fi"; // Iconos de React Icons
import Select from "react-select"; // Para el dropdown y multiselect
import axios from "axios";
//import "./styles/FormScreenDos.css"; // Estilos CSS

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
  const [observationTypeData, setObservationTypeData] = useState([
    { value: "Grabación de video", label: "Grabación de video" },
    { value: "Entrevista", label: "Entrevista" },
    { value: "Chat", label: "Chat" },
  ]);
  const [viewData, setViewData] = useState([
    { value: "Pública", label: "Pública" },
    { value: "Privada", label: "Privada" },
  ]);
  const location = useLocation(); // Obtiene los parámetros de la ruta
  const navigate = useNavigate(); // Para la navegación
  const { dataParams } = location.state || {}; // Extrae los parámetros

  const getConsultants = async () => {
    await axios
      .get("http://localhost:3004/getUsers")
      .then((response) => {
        const arrayResponse = response.data.filter((consultant) => consultant !== author);
        const dataArray = arrayResponse.map((item) => ({
          value: item.trim(),
          label: item.trim(),
        }));
        setConsultants(dataArray);
      })
      .catch((error) => {
        setInfo(error.response.data);
      });
  };

  const sendData = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${nameConsultancy}`,
      bucket: bucket,
    });

    await axios
      .post("http://localhost:3002/nameFolders", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const folderNames = response.data;

        if (folderNames.includes(nameConsultancy)) {
          setInfo("La consultoría ya existe");
        } else {
          navigate("/record-screen", {
            state: {
              dataParams: {
                nameConsultancy: nameConsultancy,
                author: author,
                observationType: observationType,
                view: view,
                collaborators: collaborators,
                goals: goals,
                entity: dataParams.entity,
                ueb: dataParams.ueb,
                unit: dataParams.unit,
                area: dataParams.area,
                process: dataParams.process,
                worker: dataParams.worker,
                bucket: bucket,
              },
            },
          });
        }
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

          const data = JSON.stringify({
            enterprise: response.data.enterprise,
          });

          axios
            .post("http://localhost:3004/getBucket", data, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              setBucket(response.data);
            })
            .catch((error) => {
              setInfo(error.response);
            });
        })
        .catch((error) => {
          console.log(error.response.data);
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
        {/* Consultancy Name Input */}
        <div className="textInput">
          <input
            type="text"
            placeholder="Introduce un nombre de consultoría"
            value={nameConsultancy}
            onChange={(e) => setNameConsultancy(e.target.value)}
            className="textInputConsultancy"
          />
        </div>

        {/* Observation Type Dropdown */}
        <div className="dropDown">
          <Select
            placeholder="Selecciona un tipo de observación"
            options={observationTypeData}
            value={observationTypeData.find((option) => option.value === observationType)}
            onChange={(selectedOption) => setObservationType(selectedOption.value)}
            className="dropDownObservationType"
          />
        </div>

        {/* View Dropdown */}
        <div className="dropDown">
          <Select
            placeholder="Selecciona un tipo de visualización"
            options={viewData}
            value={viewData.find((option) => option.value === view)}
            onChange={(selectedOption) => setView(selectedOption.value)}
            className="dropDownView"
          />
        </div>

        {/* Collaborators MultiSelect */}
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

        {/* Goals Textarea */}
        <div className="textInput">
          <textarea
            placeholder="Introduce los objetivos"
            value={goals.join("\n")}
            onChange={(e) => {
              if (e.target.value.endsWith("\n")) {
                setGoals(e.target.value.split("\n"));
              } else {
                setGoals(e.target.value.split("\n").filter((goal) => goal.trim() !== ""));
              }
            }}
            className="textInputGoals"
          />
        </div>
      </div>
      <button
        className="button"
        onClick={() => {
          sendData();
        }}
      >
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