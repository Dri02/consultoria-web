import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { IoReload, IoStop, IoPause, IoPlay } from "react-icons/io5";
import io from "socket.io-client";
import axios from "axios";
import "./styles/RecordScreen.css";

export default function RecordScreen() {
  const socket = io.connect("http://localhost:3001");
  const [isStartedRequest, setIsStartedRequest] = useState(false);
  const [isPlayedRequest, setIsPlayedRequest] = useState(false);
  const [isPausedRequest, setIsPausedRequest] = useState(true);
  const [isStartedResponse, setIsStartedResponse] = useState(false);
  const [isPlayedResponse, setIsPlayedResponse] = useState(false);
  const [isPausedResponse, setIsPausedResponse] = useState(true);
  const [isModalSaveVisible, setIsModalSaveVisible] = useState(false);
  const [isModalFinishVisible, setIsModalFinishVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState("");
  const [isDiscarded, setIsDiscarded] = useState(false);
  const [isStartedConsultancy, setIsStartedConsultancy] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startDate, setStartDate] = useState("");
  const startDateRef = useRef(startDate);
  const [endDate, setEndDate] = useState("");
  const endDateRef = useRef(endDate);
  const [startDateConsultancy, setStartDateConsultancy] = useState("");
  const startDateConsultancyRef = useRef(startDateConsultancy);
  const [endDateConsultancy, setEndDateConsultancy] = useState("");
  const endDateConsultancyRef = useRef(endDateConsultancy);
  const [state, setState] = useState("");
  const [nameScreen, setNameScreen] = useState("");
  const nameScreenRef = useRef(nameScreen);
  const location = useLocation();
  const navigate = useNavigate();
  const { dataParams } = location.state || {};

  // Función para formatear el tiempo en hh:mm:ss
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const start = async () => {
    setIsStartedRequest(true);
    setIsPlayedRequest((prev) => !prev);
    setIsPausedRequest((prev) => !prev);
  };

  const stop = async () => {
    setIsModalSaveVisible(true);
  };

  const discard = async () => {
    setIsDiscarded(true);
    setIsStartedRequest(false);
  };

  const upload = async () => {
    const data = JSON.stringify({
      prefix: `Consultorías TI/${dataParams.nameConsultancy}/Observaciones/${nameScreenRef.current}`,
      bucket: dataParams.bucket,
    });

    try {
      const response = await axios.post("http://localhost:3002/nameFolders", data, {
        headers: { "Content-Type": "application/json" },
      });
      const folderNames = response.data;
      if (folderNames.includes(nameScreenRef.current)) {
        setInfo("La observación ya existe");
        setIsModalSaveVisible(false);
      } else {
        setIsDiscarded(false);
        setIsStartedRequest(false);
      }
    } catch (error) {
      setInfo(error.response?.data || "Error en la subida");
    }
  };

  const finish = async () => {
    setIsModalFinishVisible(false);
    navigate("/home");
  };

  const startMessage = async () => {
    socket.emit("start");
  };

  const stopMessage = async () => {
    socket.emit("stop");
  };

  const continueMessage = async () => {
    socket.emit("continua");
  };

  const pauseMessage = async () => {
    socket.emit("pausa");
  };

  const uploadMessage = async () => {
    socket.emit("upload", {
      nameScreen: nameScreenRef.current,
      startDate: startDateRef.current,
      endDate: endDateRef.current,
      nameConsultancy: dataParams.nameConsultancy,
      startDateConsultancy: startDateConsultancyRef.current,
      endDateConsultancy: endDateConsultancyRef.current,
      author: dataParams.author,
      entity: dataParams.entity,
      ueb: dataParams.ueb,
      unit: dataParams.unit,
      area: dataParams.area,
      process: dataParams.process,
      worker: dataParams.worker,
      observationType: dataParams.observationType,
      view: dataParams.view,
      collaborators: dataParams.collaborators,
      goals: dataParams.goals,
      bucket: dataParams.bucket,
    });
  };

  const startResponse = useCallback(() => {
    setIsStartedResponse(true);
    setIsPlayedResponse((prev) => !prev);
    setIsPausedResponse((prev) => !prev);
  }, [isPlayedResponse, isPausedResponse]);

  const discardResponse = useCallback(() => {
    setIsStartedResponse(false);
    setIsModalSaveVisible(false);
    setTimer(0);
  }, []);

  const uploadResponse = useCallback(() => {
    setIsStartedResponse(false);
    setIsModalSaveVisible(false);
    setIsModalFinishVisible(true);
    setTimer(0);
    uploadMessage();
  }, []);

  const setInfo = (info) => {
    setIsModalVisible(true);
    setInfoModal(info);
  };

  useEffect(() => {
    if (state === "start") {
      startMessage();
    } else if (state === "stop") {
      stopMessage();
    } else if (state === "continue") {
      continueMessage();
    } else if (state === "pause") {
      pauseMessage();
    }
  }, [state]);

  useEffect(() => {
    let intervalId;
    if (isPlayedResponse) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlayedResponse]);

  useEffect(() => {
    if (isPlayedRequest) {
      setState("continue");
    }
  }, [isPlayedRequest]);

  useEffect(() => {
    if (isPausedRequest) {
      setState("pause");
    }
  }, [isPausedRequest]);

  useEffect(() => {
    if (isStartedRequest) {
      setState("start");
    } else {
      setState("stop");
    }
  }, [isStartedRequest]);

  useEffect(() => {
    const currentDate = new Date();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let second = currentDate.getSeconds();
    let formattedHour = hour > 12 ? hour - 12 : hour;
    let period = hour >= 12 ? "p.m." : "a.m.";
    let formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()} ${formattedHour
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")} ${period}`;

    if (isStartedResponse) {
      setStartDate(formattedDate);
      startDateRef.current = formattedDate;
      if (!isStartedConsultancy) {
        setIsStartedConsultancy(true);
        setStartDateConsultancy(formattedDate);
        startDateConsultancyRef.current = formattedDate;
      }
    } else {
      if (isStartedConsultancy && !isDiscarded) {
        setEndDateConsultancy(formattedDate);
        endDateConsultancyRef.current = formattedDate;
      }
    }

    if (isPausedResponse) {
      setEndDate(formattedDate);
      endDateRef.current = formattedDate;
    }
  }, [isStartedResponse, isPausedResponse, isStartedConsultancy, isDiscarded]);

  useEffect(() => {
    socket.on("started_record", startResponse);
    socket.on("paused_record", startResponse);

    if (isDiscarded) {
      socket.on("stopped_record", discardResponse);
    } else {
      socket.on("stopped_record", uploadResponse);
    }

    return () => {
      socket.off("started_record", startResponse);
      socket.off("paused_record", startResponse);
      if (isDiscarded) {
        socket.off("stopped_record", discardResponse);
      } else {
        socket.off("stopped_record", uploadResponse);
      }
    };
  }, [isDiscarded, startResponse, discardResponse, uploadResponse]);

  return (
    <div className="container">
      <div className="counter">
        {isStartedResponse && (
          <p className="counterText">{formatTime(timer)}</p>
        )}
      </div>
      <div className="containerControls">
        <div className="controls">
          {isStartedResponse && isPausedResponse && (
            <button className="secondControl reloadControl" onClick={discard}>
              <IoReload size={20} />
            </button>
          )}
          <button className="principalControl" onClick={start}>
            {isPlayedResponse ? (
              <IoPause size={30} />
            ) : (
              <div className="playControl" />
            )}
          </button>
          {isStartedResponse && isPausedResponse && (
            <button className="secondControl stopControl" onClick={stop}>
              <IoStop size={20} />
            </button>
          )}
        </div>
        {isModalSaveVisible && (
          <div className="modalInfoOut">
            <div className="modalInfo">
              <p className="modalInfoTextHeader">
                ¿Desea guardar la grabación?
              </p>
              <div className="textInputContainer">
                <input
                  type="text"
                  placeholder="Introduce un nombre"
                  value={nameScreen}
                  onChange={(e) => {
                    setNameScreen(e.target.value);
                    nameScreenRef.current = e.target.value;
                  }}
                  className="textInput"
                />
              </div>
              <div className="optionsModal">
                <button
                  className="modalInfoButton"
                  onClick={() => setIsModalSaveVisible(false)}
                >
                  Cancelar
                </button>
                <span className="separatorOptions">|</span>
                <button className="modalInfoButton" onClick={discard}>
                  Descartar
                </button>
                <span className="separatorOptions">|</span>
                <button className="modalInfoButton" onClick={upload}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
        {isModalFinishVisible && (
          <div className="modalInfoOut">
            <div className="modalInfo">
              <p className="modalInfoTextHeader">
                ¿Desea finalizar la consultoría?
              </p>
              <div className="containerModalInfoButton">
                <button
                  className="modalInfoButton"
                  onClick={() => setIsModalFinishVisible(false)}
                >
                  Continuar
                </button>
                <span className="separatorOptions separatorOptionsFinish">
                  |
                </span>
                <button className="modalInfoButton" onClick={finish}>
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        )}
        {isModalVisible && (
          <div className="modalInfoOut">
            <div className="modalInfo">
              <p className="modalInfoTextHeader">{infoModal}</p>
              <div className="containerModalInfoButton">
                <button
                  className="modalInfoButton"
                  onClick={() => {
                    setIsModalVisible(false);
                    setIsModalSaveVisible(true);
                  }}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
