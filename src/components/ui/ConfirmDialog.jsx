import { Modal } from './Modal.jsx'
import { Boton } from './Boton.jsx'

export const ConfirmDialog = ({
    abierto,
    titulo = 'Confirmar acción',
    mensaje,
    textoCancelar = 'Cancelar',
    textoConfirmar = 'Confirmar',
    variante = 'peligro',
    cargando = false,
    onCancelar,
    onConfirmar,
}) => {
    return (
        <Modal
            abierto={abierto}
            onCerrar={onCancelar}
            titulo={titulo}
            tamanio="sm"
            cerrarAlClickFondo={!cargando}
            footer={
                <>
                    <Boton variante="secundario" onClick={onCancelar} disabled={cargando}>
                        {textoCancelar}
                    </Boton>
                    <Boton variante={variante} onClick={onConfirmar} cargando={cargando}>
                        {textoConfirmar}
                    </Boton>
                </>
            }
        >
            <p className="text-sm text-neutral-600">{mensaje}</p>
        </Modal>
    )
}