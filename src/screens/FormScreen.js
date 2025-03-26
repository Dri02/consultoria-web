import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Usamos react-router-dom para web
import { FiFolder, FiChevronDown, FiEdit } from "react-icons/fi"; // Iconos de React Icons
import Select from "react-select"; // Componente para el dropdown
import axios from "axios";
//import "./styles/FormScreen.css"; // Estilos CSS

export default function CreateObservation() {
  // Estados para los datos de cada dropdown
  const [entityData, setEntityData] = useState([]);
  const [uebData, setUebData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [workerData, setWorkerData] = useState([]);

  // Estados para los valores seleccionados o escritos
  const [entity, setEntity] = useState("");
  const [ueb, setUeb] = useState("");
  const [unit, setUnit] = useState("");
  const [area, setArea] = useState("");
  const [process, setProcess] = useState("");
  const [worker, setWorker] = useState("");

  // Estados para mostrar modal y mensajes
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");

  // Estados para controlar si se deben mostrar inputs manuales o dropdowns
  const [isEmptyData, setIsEmptyData] = useState({
    isEmptyEntityData: false,
    isEmptyUebData: false,
    isEmptyUnitData: false,
    isEmptyAreaData: false,
    isEmptyProcessData: false,
    isEmptyWorkerData: false,
  });
  const [isDisabledEditIcon, setIsDisabledEditIcon] = useState({
    isDisabledEditEntityIcon: false,
    isDisabledEditUebIcon: true,
    isDisabledEditUnitIcon: true,
    isDisabledEditAreaIcon: true,
    isDisabledEditProcessIcon: true,
    isDisabledEditWorkerIcon: true,
  });

  // URLs de los endpoints
  const urls = [
    "http://192.168.167.158:4000/api/entity",
    "http://localhost:4000/api/ueb",
    "http://localhost:4000/api/unit",
    "http://localhost:4000/api/area",
    "http://localhost:4000/api/process",
    "http://localhost:4000/api/worker",
  ];

  // Configuración para cada endpoint
  const infoUrls = {
    entity: {
      setData: setEntityData,
      isEmptyData: "isEmptyEntityData",
      isDisabledEditIcon: "isDisabledEditEntityIcon",
      value: "nombre",
      label: "nombre",
      father: "nombre",
    },
    ueb: {
      setData: setUebData,
      isEmptyData: "isEmptyUebData",
      isDisabledEditIcon: "isDisabledEditUebIcon",
      value: "nombre",
      label: "nombre",
      father: "entidad",
    },
    unit: {
      setData: setUnitData,
      isEmptyData: "isEmptyUnitData",
      isDisabledEditIcon: "isDisabledEditUnitIcon",
      value: "Unidad",
      label: "Unidad",
      father: "ueb",
    },
    area: {
      setData: setAreaData,
      isEmptyData: "isEmptyAreaData",
      isDisabledEditIcon: "isDisabledEditAreaIcon",
      value: "Area",
      label: "Area",
      father: "Unidad",
    },
    process: {
      setData: setProcessData,
      isEmptyData: "isEmptyProcessData",
      isDisabledEditIcon: "isDisabledEditProcessIcon",
      value: "label",
      label: "label",
      father: "Area",
    },
    worker: {
      setData: setWorkerData,
      isEmptyData: "isEmptyWorkerData",
      isDisabledEditIcon: "isDisabledEditWorkerIcon",
      value: "Nombre",
      label: "Nombre",
      father: "Area",
    },
  };

  const location = useLocation(); // Se obtiene el estado de la ruta si fuera necesario
  const navigate = useNavigate();

  // Alterna la bandera de edición de un input/dropdown (para mostrar o ocultar el botón de edición)
  const handleIconPress = (isEmptyDataKey) => {
    setIsEmptyData((prevState) => ({
      ...prevState,
      [isEmptyDataKey]: !prevState[isEmptyDataKey],
    }));
  };

  // Maneja la respuesta del servidor para formatear y guardar los datos
  const handleResponse = (
    response,
    setData,
    isEmptyDataKey,
    isDisabledEditIconKey,
    valueKey,
    labelKey,
    fatherKey
  ) => {
    if (response && response.data) {
      if (response.data.length > 0) {
        const dataArray = response.data.map((item) => ({
          value: item[valueKey].trim(),
          label: item[labelKey].trim(),
          father: item[fatherKey].trim(),
        }));
        setData(dataArray);
      } else {
        setIsEmptyData((prevState) => ({
          ...prevState,
          [isEmptyDataKey]: true,
        }));
        setIsDisabledEditIcon((prevState) => ({
          ...prevState,
          [isDisabledEditIconKey]: true,
        }));
      }
    } else {
      setIsEmptyData((prevState) => ({
        ...prevState,
        [isEmptyDataKey]: true,
      }));
      setIsDisabledEditIcon((prevState) => ({
        ...prevState,
        [isDisabledEditIconKey]: true,
      }));
    }
  };

  // Función para obtener los datos de los endpoints
  const fetchData = async (urlsToFetch, infoUrlsToFetch, exception) => {
    urlsToFetch.forEach((url) => {
      if (url !== exception) {
        const name = url.split("/").pop();
        axios
          .get(url)
          .then((response) => {
            handleResponse(
              response,
              infoUrlsToFetch[name].setData,
              infoUrlsToFetch[name].isEmptyData,
              infoUrlsToFetch[name].isDisabledEditIcon,
              infoUrlsToFetch[name].value,
              infoUrlsToFetch[name].label,
              infoUrlsToFetch[name].father
            );
          })
          .catch((error) => {
            if (error.response) {
              const { config, response } = error;
              const dataKey =
                config.url.split("/").pop().charAt(0).toUpperCase() +
                config.url.split("/").pop().slice(1);
              const isEmptyDataKey = `isEmpty${dataKey}Data`;
              const isDisabledEditIconKey = `isDisabledEdit${dataKey}Icon`;

              if (response.status === 404) {
                console.log(`${dataKey} not found (404)`);
                setIsEmptyData((prevState) => ({
                  ...prevState,
                  [isEmptyDataKey]: true,
                }));
                setIsDisabledEditIcon((prevState) => ({
                  ...prevState,
                  [isDisabledEditIconKey]: true,
                }));
                // Vuelve a intentar obtener datos, exceptuando la URL que falló
                fetchData(urlsToFetch, infoUrlsToFetch, config.url);
              } else {
                setInfo("Error al obtener los datos");
              }
            } else {
              setInfo("Error al obtener los datos");
            }
          });
      }
    });
  };

  // Verifica si existen datos en el array filtrado por el valor del "father" y ajusta banderas de edición
  const verifyDataLength = (data, element, isEmptyDataKey, isDisabledEditIconKey) => {
    const filterData = data.filter((item) => item.father === element);

    if (filterData.length > 0) {
      setIsEmptyData((prevState) => ({
        ...prevState,
        [isEmptyDataKey]: false,
      }));
      setIsDisabledEditIcon((prevState) => ({
        ...prevState,
        [isDisabledEditIconKey]: false,
      }));
    } else {
      setIsEmptyData((prevState) => ({
        ...prevState,
        [isEmptyDataKey]: true,
      }));
      setIsDisabledEditIcon((prevState) => ({
        ...prevState,
        [isDisabledEditIconKey]: true,
      }));
    }
  };

  // Muestra el modal con un mensaje de error o información
  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    fetchData(urls, infoUrls, "noUrl");
  }, []);

  return (
    <div className="container">
      <div className="header">
        <FiFolder size={48} className="eyeIcon" />
        <h1 className="titleHeader">Crea observaciones</h1>
      </div>
      <div className="dataInputContainer">
        {/* Campo: Entidad */}
        <div className="dataInput">
          {isEmptyData.isEmptyEntityData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de entidad"
                value={entity}
                onChange={(e) => {
                  setEntity(e.target.value);
                  verifyDataLength(
                    uebData,
                    e.target.value,
                    infoUrls["ueb"].isEmptyData,
                    infoUrls["ueb"].isDisabledEditIcon
                  );
                }}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditEntityIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["entity"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona una entidad"
                options={entityData}
                value={entityData.find((option) => option.value === entity)}
                onChange={(selectedOption) => {
                  setEntity(selectedOption.value);
                  verifyDataLength(
                    uebData,
                    selectedOption.label,
                    infoUrls["ueb"].isEmptyData,
                    infoUrls["ueb"].isDisabledEditIcon
                  );
                }}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditEntityIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["entity"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Campo: UEB */}
        <div className="dataInput">
          {isEmptyData.isEmptyUebData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de ueb"
                value={ueb}
                onChange={(e) => {
                  setUeb(e.target.value);
                  verifyDataLength(
                    unitData,
                    e.target.value,
                    infoUrls["unit"].isEmptyData,
                    infoUrls["unit"].isDisabledEditIcon
                  );
                }}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditUebIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() => handleIconPress(infoUrls["ueb"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona una ueb"
                options={uebData.filter((item) => item.father === entity)}
                value={uebData.find((option) => option.value === ueb)}
                onChange={(selectedOption) => {
                  setUeb(selectedOption.value);
                  verifyDataLength(
                    unitData,
                    selectedOption.label,
                    infoUrls.unit.isEmptyData,
                    infoUrls.unit.isDisabledEditIcon,
                  );
                }}
                isDisabled={!entity}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditUebIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() => handleIconPress(infoUrls["ueb"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Campo: Unidad */}
        <div className="dataInput">
          {isEmptyData.isEmptyUnitData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de unidad"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  verifyDataLength(
                    areaData,
                    e.target.value,
                    infoUrls["area"].isEmptyData,
                    infoUrls["area"].isDisabledEditIcon
                  );
                }}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditUnitIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() => handleIconPress(infoUrls["unit"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona una unidad"
                options={unitData.filter((item) => item.father === ueb)}
                value={unitData.find((option) => option.value === unit)}
                onChange={(selectedOption) => {
                  setUnit(selectedOption.value);
                  verifyDataLength(
                    areaData,
                    selectedOption.label,
                    infoUrls["area"].isEmptyData,
                    infoUrls["area"].isDisabledEditIcon
                  );
                }}
                isDisabled={!ueb}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditUnitIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() => handleIconPress(infoUrls["unit"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Campo: Área */}
        <div className="dataInput">
          {isEmptyData.isEmptyAreaData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de área"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  verifyDataLength(
                    workerData,
                    e.target.value,
                    infoUrls["worker"].isEmptyData,
                    infoUrls["worker"].isDisabledEditIcon
                  );
                  verifyDataLength(
                    processData,
                    e.target.value,
                    infoUrls["process"].isEmptyData,
                    infoUrls["process"].isDisabledEditIcon
                  );
                }}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditAreaIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() => handleIconPress(infoUrls["area"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona un área"
                options={areaData.filter((item) => item.father === unit)}
                value={areaData.find((option) => option.value === area)}
                onChange={(selectedOption) => {
                  setArea(selectedOption.value);
                  verifyDataLength(
                    workerData,
                    selectedOption.label,
                    infoUrls["worker"].isEmptyData,
                    infoUrls["worker"].isDisabledEditIcon
                  );
                  verifyDataLength(
                    processData,
                    selectedOption.label,
                    infoUrls["process"].isEmptyData,
                    infoUrls["process"].isDisabledEditIcon
                  );
                }}
                isDisabled={!unit}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditAreaIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() => handleIconPress(infoUrls["area"].isEmptyData)}
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Campo: Proceso */}
        <div className="dataInput">
          {isEmptyData.isEmptyProcessData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de proceso"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditProcessIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["process"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona un proceso"
                options={processData.filter((item) => item.father === area)}
                value={processData.find((option) => option.value === process)}
                onChange={(selectedOption) =>
                  setProcess(selectedOption.value)
                }
                isDisabled={!area}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditProcessIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["process"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Campo: Trabajador */}
        <div className="dataInput">
          {isEmptyData.isEmptyWorkerData ? (
            <div className="dataInputView">
              <input
                type="text"
                placeholder="Introduce un nombre de trabajador"
                value={worker}
                onChange={(e) => setWorker(e.target.value)}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditWorkerIcon && (
                <button
                  className="editTextInputToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["worker"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          ) : (
            <div className="dataInputView">
              <Select
                placeholder="Selecciona un trabajador"
                options={workerData.filter((item) => item.father === area)}
                value={workerData.find((option) => option.value === worker)}
                onChange={(selectedOption) =>
                  setWorker(selectedOption.value)
                }
                isDisabled={!area}
                className="dataInputWidth"
              />
              {!isDisabledEditIcon.isDisabledEditWorkerIcon && (
                <button
                  className="editDropDownToggle"
                  onClick={() =>
                    handleIconPress(infoUrls["worker"].isEmptyData)
                  }
                >
                  <FiEdit size={22} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        className="button"
        onClick={() => {
          navigate("/form-screen-dos", {
            state: {
              dataParams: { entity, ueb, unit, area, process, worker },
            },
          });
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
