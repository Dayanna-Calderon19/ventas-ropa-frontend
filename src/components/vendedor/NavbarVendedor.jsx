import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    RiMenuLine,
    RiSearchLine,
    RiCloseLine,
    RiArrowRightSLine,
    RiStoreLine,
    RiDashboardLine,
    RiShoppingCartLine,
    RiFileListLine,
    RiStackLine,
    RiUser3Line,
} from "react-icons/ri";

import { useAuth } from "../../hooks/useAuth.js";

const RUTAS_ETIQUETAS = {
    '/vendedor': 'Dashboard',
    '/vendedor/nueva-venta': 'Nueva Venta',
    '/vendedor/historial': 'Historial de Ventas',
    '/vendedor/inventario': 'Inventario',
    '/vendedor/clientes': 'Clientes',
}

const ACCESOS = [
    {
        nombre: "Dashboard",
        ruta: "/vendedor",
        grupo: "Principal",
        icono: RiDashboardLine,
    },
    {
        nombre: "Nueva Venta",
        ruta: "/vendedor/nueva-venta",
        grupo: "Ventas",
        icono: RiShoppingCartLine,
    },
    {
        nombre: "Historial de Ventas",
        ruta: "/vendedor/historial",
        grupo: "Ventas",
        icono: RiFileListLine,
    },
    {
        nombre: "Inventario",
        ruta: "/vendedor/inventario",
        grupo: "Inventario",
        icono: RiStackLine,
    },
    {
        nombre: "Clientes",
        ruta: "/vendedor/clientes",
        grupo: "Clientes",
        icono: RiUser3Line,
    },
];

const Breadcrumb = () => {
    const location = useLocation();

    const actual =
        ACCESOS.find((item) => item.ruta === location.pathname) ||
        ACCESOS[0];

    return (
        <div className="flex flex-col">
            <span className="text-xs text-neutral-400">
                Panel de vendedor
            </span>

            <h1 className="text-lg font-semibold text-neutral-900">
                {actual.nombre}
            </h1>
        </div>
    );
};

const BuscadorGlobal = () => {
    const [abierto, setAbierto] = useState(false);
    const [texto, setTexto] = useState("");

    const inputRef = useRef(null);

    const navigate = useNavigate();

    const resultados = useMemo(() => {
        if (!texto.trim()) return ACCESOS;

        return ACCESOS.filter((item) => {
            const t = texto.toLowerCase();

            return (
                item.nombre.toLowerCase().includes(t) ||
                item.grupo.toLowerCase().includes(t)
            );
        });
    }, [texto]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();

                setAbierto(true);

                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            }

            if (e.key === "Escape") {
                setAbierto(false);
            }
        };

        document.addEventListener("keydown", handler);

        return () =>
            document.removeEventListener(
                "keydown",
                handler
            );
    }, []);

    const seleccionar = (ruta) => {
        navigate(ruta);

        setTexto("");

        setAbierto(false);
    };

    return (
        <>
            <button
                onClick={() => {
                    setAbierto(true);

                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 100);
                }}
                className="hidden md:flex items-center gap-3 w-64 h-10 px-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-white transition"
            >
                <RiSearchLine size={17} />

                <span className="flex-1 text-left text-sm text-neutral-500">
                    Buscar módulo...
                </span>

                <span className="text-[10px] text-neutral-400 border rounded px-1.5 py-0.5">
                    Ctrl K
                </span>
            </button>

            {abierto && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">

                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() =>
                            setAbierto(false)
                        }
                    />

                    <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">

                        <div className="flex items-center gap-3 p-4 border-b">

                            <RiSearchLine size={18} />

                            <input
                                ref={inputRef}
                                value={texto}
                                onChange={(e) =>
                                    setTexto(
                                        e.target.value
                                    )
                                }
                                placeholder="Buscar..."
                                className="flex-1 outline-none"
                            />

                            <button
                                onClick={() =>
                                    setAbierto(false)
                                }
                            >
                                <RiCloseLine />
                            </button>

                        </div>

                        <div className="max-h-80 overflow-y-auto">

                            {resultados.length ? (
                                resultados.map((item) => {
                                    const Icono =
                                        item.icono;

                                    return (
                                        <button
                                            key={
                                                item.ruta
                                            }
                                            onClick={() =>
                                                seleccionar(
                                                    item.ruta
                                                )
                                            }
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition"
                                        >
                                            <div className="flex items-center gap-3">

                                                <Icono
                                                    size={
                                                        18
                                                    }
                                                />

                                                <div className="text-left">

                                                    <p className="text-sm font-medium">
                                                        {
                                                            item.nombre
                                                        }
                                                    </p>

                                                    <p className="text-xs text-neutral-400">
                                                        {
                                                            item.grupo
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <RiArrowRightSLine />
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-neutral-400 text-sm">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const NavbarVendedor = ({ onAbrirSidebar }) => {
    const { usuario } = useAuth()

    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">

            <div className="flex items-center gap-4">

                <button
                    onClick={onAbrirSidebar}
                    className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
                >
                    <RiMenuLine size={20} />
                </button>

                <Breadcrumb />

            </div>

            <div className="flex items-center gap-4">

                <BuscadorGlobal />

                <Link
                    to="/"
                    className="hidden lg:flex items-center gap-2 px-3 h-10 rounded-lg border hover:bg-neutral-50 transition"
                >
                    <RiStoreLine />

                    <span className="text-sm">
                        Ver tienda
                    </span>
                </Link>

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8933f] to-[#9d6f4a] text-white flex items-center justify-center font-bold">

                        {usuario?.nombre
                            ?.split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}

                    </div>

                    <div className="hidden sm:flex flex-col">

                        <span className="text-xs text-neutral-400">
                            Bienvenido
                        </span>

                        <span className="text-sm font-semibold">
                            {usuario?.nombre?.split(
                                " "
                            )[0]}
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}