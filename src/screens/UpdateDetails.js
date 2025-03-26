import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FiFolder } from "react-icons/fi";
import axios from "axios";
//import "./styles/UpdateDetails.css";

export default function UpdateDetails() {
  const [nameScreen, setNameScreen] = useState("");
  const [nameConsultancy, setNameConsultancy] = useState("");
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal] = useState("");
  const [folders, setFolders] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isConsultancy } = location.state || {};

  const sendUpdate = async (newData) => {
    try {
      await axios.post("http://localhost:3002/modifyJson", newData, {
        headers: { "Content-Type": "application/json" },
      });
      if (isConsultancy) {
        folders.map(async (folderName) => {
          const sendData = JSON.stringify({
            prefix: `Consultorías TI/${nameConsultancy}/Observaciones/${folderName}/`,
            modifications: [{ field: "nameConsultancy", value: nameConsultancy }],
            notRecursive: false,
          });
          try {
            await axios.post("http://localhost:3002/modifyJson", sendData, {
              headers: { "Content-Type": "application/json" },
            });
            navigate("/home");
          } catch (error) {
            console.log(error.response.data);
          }
        });
      }
      navigate("/home");
    } catch (error) {
      setInfo(error.response.data);
    }
  };

  const updateDetails = async () => {
    const verifyData = JSON.stringify({
      prefix: isConsultancy
        ? `Consultorías TI/${nameConsultancy}`
        : `Consultorías TI/${data.nameConsultancy}/Observaciones/${nameScreen}`,
    });

    try {
      const response = await axios.post("http://localhost:3002/nameFolders", verifyData, {
        headers: { "Content-Type": "application/json" },
      });
      const newData = JSON.stringify({
        prefix: isConsultancy
          ? `Consultorías TI/${data.nameConsultancy}/`
          : `Consultorías TI/${data.nameConsultancy}/Observaciones/${data.nameScreen}/`,
        modifications: isConsultancy
          ? [
              { field: "nameConsultancy", value: nameConsultancy },
              { field: "goals", value: goals },
            ]
          : [{ field: "nameScreen", value: nameScreen }],
        notRecursive: true,
      });
      const folderNames = response.data;
      if (
        isConsultancy
          ? data.nameConsultancy !== nameConsultancy
          : data.nameScreen !== nameScreen
      ) {
        if (
          isConsultancy
            ? folderNames.includes(nameConsultancy)
            : folderNames.includes(nameScreen)
        ) {
          isConsultancy
            ? setInfo("La consultoría ya existe")
            : setInfo("La observación ya existe");
        } else {
          sendUpdate(newData);
        }
      } else {
        sendUpdate(newData);
      }
    } catch (error) {
      setInfo(error.response.data);
    }
  };

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfo(info);
  };

  useEffect(() => {
    if (isConsultancy) {
      setNameConsultancy(data.nameConsultancy);
      setGoals(data.goals);
    } else {
      setNameScreen(data.nameScreen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConsultancy) {
      const sendData = JSON.stringify({
        prefix: `Consultorías TI/${data.nameConsultancy}/Observaciones/`,
      });
      axios
        .post("http://localhost:3002/nameFolders", sendData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setFolders(response.data);
        })
        .catch((error) => {
          setInfo(error.response.data);
          setIsModalVisible(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="header">
        <FiFolder size={48} className="lockIcon" />
        <h1 className="titleHeader">Modifica info</h1>
      </div>
      <div
        className={`textInputContainer ${
          isConsultancy ? "textInputContainerConsultancy" : ""
        }`}
      >
        <div>
          <input
            type="text"
            placeholder={`Introduce un nombre de ${
              isConsultancy ? "consultoría" : "observación"
            }`}
            value={isConsultancy ? nameConsultancy : nameScreen}
            onChange={(e) =>
              isConsultancy
                ? setNameConsultancy(e.target.value)
                : setNameScreen(e.target.value)
            }
            className="textInput"
          />
        </div>
        {isConsultancy && (
          <div>
            <textarea
              placeholder="Introduce los objetivos"
              value={goals.join("\n")}
              onChange={(e) => {
                if (e.target.value.endsWith("\n")) {
                  setGoals(e.target.value.split("\n"));
                } else {
                  setGoals(
                    e.target.value.split("\n").filter((goal) => goal.trim() !== "")
                  );
                }
              }}
              className="textInput textInputGoals"
            />
          </div>
        )}
      </div>
      <button className="button" onClick={updateDetails}>
        Actualizar
      </button>
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
    </div>
  );
}
