import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content" 

/**
 * Alerta para notificar una peración exitosa
 * 
 * @param {string} mensaje - Mensaje a mostrar en la alerta
 */
const alertaSuccess = (mensaje) => {
    const MySwal = withReactContent(Swal)

    MySwal.fire({
        title: mensaje,
        icon: 'success'
    })
}

/**
 * Alerta para notificar un error en la operación
 * 
 * @param {string} mensaje - Mensaje a mostrar en la alerta 
 */
const alertaError = (mensaje) => {
    const MySwal = withReactContent(Swal)

    MySwal.fire({
        title: mensaje,
        icon: 'error'
    })
}

/**
 * Alerta para notificar una advertencia en la operación
 * 
 * @param {string} mensaje - Mensaje a mostrar en la alerta
 * @param {string} id - (Opcional) Identificador del control para posicionar el cursor 
 */
const alertaWarning = (mensaje, id = '') => {
    onFocus(id)
    const MySwal = withReactContent(Swal)

    MySwal.fire({
        title: mensaje,
        icon: 'warning'
    })
}

/**
 * Posicionar el cursor del teclado en un control
 * 
 * @param {string} id - Identificador del control para posicionar el cursor 
 */
const onFocus = (id) => {
    if (id !== '') {
        document.getElementById(id).focus()
    }
}

export {
    alertaSuccess,
    alertaError,
    alertaWarning
}