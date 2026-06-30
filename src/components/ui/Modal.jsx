import { useState } from 'react'
import { Boton } from './Boton.jsx'
import { Input } from './Input.jsx'
import { RiCloseLine } from 'react-icons/ri'

export const Modal = ({ abierto, cerrar, onCerrar, titulo, children, footer }) => {
    const handleClose = cerrar || onCerrar;
    if (!abierto) return null
    return (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-neutral-900">{titulo}</h2>
                    <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-900"><RiCloseLine size={20} /></button>
                </div>
                {children}
                {footer && <div className="flex justify-end gap-3 mt-6">{footer}</div>}
            </div>
        </div>
    )
}
