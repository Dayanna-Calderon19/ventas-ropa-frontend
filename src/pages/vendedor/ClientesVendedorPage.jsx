import { useEffect } from "react";
import {
    RiSearchLine,
    RiEyeLine,
    RiUserLine,
    RiAddLine,
} from "react-icons/ri";

import { useUsuarios } from "../../hooks/useUsuarios.js";
import { useBusqueda } from "../../hooks/useBusqueda.js";
import { useModal } from "../../hooks/useModal.js";

import { CabeceraSeccion } from "../../components/admin/CabeceraSeccion.jsx";
import { TablaBase } from "../../components/admin/TablaBase.jsx";

import { Input } from "../../components/ui/Input.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Modal } from "../../components/ui/Modal.jsx";
import { Boton } from "../../components/ui/Boton.jsx";
import { Paginacion } from "../../components/ui/Paginacion.jsx";

import FormRegistroCliente from "../../components/vendedor/FormRegistroCliente.jsx";

import { formatearFecha } from "../../utils/formato.js";

const DetalleCliente = ({ cliente }) => {
    if (!cliente) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-[#c4956a]">
                    <RiUserLine size={32} />
                </div>

                <div>
                    <h3 className="text-lg font-bold">
                        {cliente.nombre}
                    </h3>

                    <p className="text-sm text-neutral-500">
                        {cliente.correo}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded">
                    <p className="text-xs text-neutral-400">
                        Teléfono
                    </p>

                    <p>
                        {cliente.telefono || "No registrado"}
                    </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded">
                    <p className="text-xs text-neutral-400">
                        Cliente desde
                    </p>

                    <p>
                        {formatearFecha(cliente.creadoEn)}
                    </p>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">
                    Historial de pedidos
                </p>

                {cliente.pedidos?.length ? (
                    <div className="flex flex-col gap-2">
                        {cliente.pedidos.map((pedido) => (
                            <div
                                key={pedido.id}
                                className="flex justify-between text-sm border-b pb-2"
                            >
                                <span>
                                    {formatearFecha(
                                        pedido.creadoEn
                                    )}
                                </span>

                                <span>
                                    S/ {pedido.total}
                                </span>

                                <Badge
                                    variante={
                                        pedido.estado ===
                                        "ENTREGADO"
                                            ? "exito"
                                            : "info"
                                    }
                                >
                                    {pedido.estado}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-400">
                        No hay pedidos registrados
                    </p>
                )}
            </div>
        </div>
    );
};

const ClientesVendedorPage = () => {
    const modalDetalle = useModal();
    const modalRegistro = useModal();

    const {
        termino,
        terminoRetrasado,
        manejarCambio: manejarBusqueda,
    } = useBusqueda();

    const {
        datos,
        meta,
        cargando,
        aplicarFiltros,
        irAPagina,
        recargar,
    } = useUsuarios({
        rol: "CLIENTE",
    });

    useEffect(() => {
        aplicarFiltros({
            busqueda: terminoRetrasado || undefined,
        });
    }, [terminoRetrasado]);

    const columnas = [
        {
            clave: "nombre",
            titulo: "Cliente",
            render: (cliente) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                        {cliente.nombre?.charAt(0)}
                    </div>

                    <div>
                        <p className="font-medium">
                            {cliente.nombre}
                        </p>

                        <p className="text-xs text-neutral-500">
                            {cliente.correo}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            clave: "telefono",
            titulo: "Teléfono",
        },

        {
            clave: "pedidos",
            titulo: "Pedidos",
            render: (cliente) => (
                <span>
                    {cliente._count?.pedidos ?? 0}
                </span>
            ),
        },

        {
            clave: "acciones",
            titulo: "",
            render: (cliente) => (
                <div className="flex justify-end">
                    <button
                        onClick={() =>
                            modalDetalle.abrir(cliente)
                        }
                        className="p-2 hover:bg-neutral-100 rounded"
                    >
                        <RiEyeLine />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">

            <CabeceraSeccion
                titulo="Clientes"
                descripcion="Consulta y registra clientes"
                accion={
                    <Boton
                        variante="primario"
                        icono={<RiAddLine />}
                        onClick={() =>
                            modalRegistro.abrir()
                        }
                    >
                        Nuevo cliente
                    </Boton>
                }
            />

            <div className="bg-white border rounded-lg overflow-hidden">

                <div className="p-4 border-b">
                    <Input
                        value={termino}
                        onChange={manejarBusqueda}
                        placeholder="Buscar..."
                        icono={<RiSearchLine />}
                    />
                </div>

                <TablaBase
                    columnas={columnas}
                    filas={datos || []}
                    cargando={cargando}
                />

                {meta?.totalPages > 1 && (
                    <div className="p-4 border-t">
                        <Paginacion
                            meta={meta}
                            onCambiarPagina={irAPagina}
                        />
                    </div>
                )}
            </div>

            <Modal
                abierto={modalDetalle.abierto}
                onCerrar={modalDetalle.cerrar}
                titulo="Detalle del cliente"
                tamanio="sm"
            >
                <DetalleCliente
                    cliente={modalDetalle.datos}
                />
            </Modal>

            <Modal
                abierto={modalRegistro.abierto}
                onCerrar={modalRegistro.cerrar}
                titulo="Registrar cliente"
                tamanio="sm"
            >
                <FormRegistroCliente
                    onCerrar={modalRegistro.cerrar}
                    onGuardado={() => {
                        recargar();
                    }}
                />
            </Modal>

        </div>
    );
};

export default ClientesVendedorPage;