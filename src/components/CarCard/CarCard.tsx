import './CarCard.css'; 
import React, {useState} from 'react'; 
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faWrench, faHammer, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import moment from 'moment';
import axios from 'axios';

interface CarCardProps {
  id: number,
  make: string, 
  model: string, 
  image: string, 
  description: string, 
  km: number, 
  estimatedate: string, 
  person?: string, 
  inMaintenance?: boolean 
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const CarCard: React.FunctionComponent<CarCardProps> = ({make, model, km, id, image, description, estimatedate, person, inMaintenance=false} : CarCardProps) => {
    const [modalIsOpen,setIsOpen] = useState(false);
    const [personName, setPersonName] = useState("");
    const [estimadatedDate, setEstimadatedDate] = useState("");
    const [modalFormErrorMsg, setModalFormErrorMsg] = useState("");

    const MODAL_ERRORS = {
      EMPTY_FIELDS: "Debe llenar todos los campos", 
      INVALID_DATE: "Formato de fecha incorrecta (YYYY/MM/DD)", 
      DATE_BEFORE_TODAY: "La fecha debe ser mayor a la fecha actual", 
      SERVER_ERROR: "Ups! Ocurrió un error en el servidor, inténtelo más tarde"
    };
    
    const openModal = () => {
      setIsOpen(true);
    }

    const closeModal = () => {
      setIsOpen(false);
    }

    const sendUpdateCar = (id: number, personName: string, estimadatedDate: string, inMaintenance=true) => {
      return axios.put(`${process.env.REACT_APP_API_URL}/cars/${id}/`, {personName, estimadatedDate, inMaintenance})
    }

    const handleRemoveInMaintenance = () => {
      sendUpdateCar(id, personName, estimadatedDate, false)
      .then(_ => window.location.reload())
      .catch(err => {
        console.log(err);
        alert(MODAL_ERRORS.SERVER_ERROR)
      })
    }


    const handleSend = () => {
      let date = moment(estimadatedDate, "YYYY/MM/DD", true);
      let today = moment();
      if (!personName || !estimadatedDate) {
        setModalFormErrorMsg(MODAL_ERRORS.EMPTY_FIELDS)
      } else if (!date.isValid()) {
        setModalFormErrorMsg(MODAL_ERRORS.INVALID_DATE)
      } else if (date.isBefore(today)) {
        setModalFormErrorMsg(MODAL_ERRORS.DATE_BEFORE_TODAY)
      } else {
        setModalFormErrorMsg("")
        sendUpdateCar(id, personName, estimadatedDate).then(_ => window.location.reload())
        .catch(err => {
          console.log(err);
          setModalFormErrorMsg(MODAL_ERRORS.SERVER_ERROR)
        })
      }
    }

    return (
        <>
          <div className={`car-card col s12 m4 l4 ${inMaintenance && "in-maintenance"}`} data-id={id}>
            <div className="card">
              <div className="card-image">
                <img src={image} onError={(e:any) => {e.target.onError = null; e.target.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5XZQ2SNLQ9I5LwMj2cc6rcAKEDda79PdqgLWLXcj_sUCleekXXQVAFZZbRhRIqZ64y9c&usqp=CAU"}} alt={make}/>
                <span className="card-title">
                  <span className="card-title-wrapper">
                      { inMaintenance && <FontAwesomeIcon icon={faHammer} /> } 
                      {` ${make}`} | {model}
                    </span>
                  </span>
              </div>
              <div className="card-content">
                <p>
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  { km ? ` ${km} `  : " N/A " }
                  <b> km</b>
                </p>
                <p> 
                <FontAwesomeIcon icon={faWrench} /> {description}
                </p>
                <p>
                <FontAwesomeIcon icon={faCalendarAlt} />  {estimatedate || "N/A"}
                </p>
                {
                (person && inMaintenance) && 
                <p> 
                  <FontAwesomeIcon icon={faUser} />  
                  {` ${person}`}
                </p>
                }
              </div>
              <div className="card-action">
                {
                  inMaintenance ? 
                  <a href="#!" onClick={() => handleRemoveInMaintenance()}>Quitar de Mantenimiento</a> :
                  <a href="#!" onClick={() => openModal()}>Poner en Mantenimiento</a> 
                }
                
              </div>
            </div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Car Modal" 
          >

            <form className="col s12">
              <div className="row">
                <div className="input-field col s6">
                  <input id="person-name" type="text" className="validate" value={personName} onChange={(evt) => setPersonName(evt.target.value)} />
                  <label htmlFor="person-name">Nombre Persona</label>
                </div>

                <div className="input-field col s6">
                  <input id="estimadated-time" type="text" className="validate" value={estimadatedDate} onChange={(evt) => setEstimadatedDate(evt.target.value)} />
                  <span className="helper-text">*Asegurese que este en formato YYYY/MM/DD</span>
                  <label htmlFor="estimadated-time">Fecha Estimada</label>
                </div>
              </div>
              
              <p className="helper-text error-msg">{modalFormErrorMsg}</p>
              <a className="waves-effect waves-light btn" id="send-btn" onClick={() => handleSend()}>Enviar</a>
            </form>

          </Modal>
        </>
    )
}

CarCard.prototype = {
  id: PropTypes.number.isRequired,
  make: PropTypes.string.isRequired, 
  model: PropTypes.string.isRequired, 
  image: PropTypes.string.isRequired, 
  description: PropTypes.string.isRequired, 
  km: PropTypes.number.isRequired, 
}

export default CarCard;