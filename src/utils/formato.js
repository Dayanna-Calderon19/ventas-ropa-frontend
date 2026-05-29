export const formatearMoneda = (valor, moneda = "PEN") => {
    if (valor === null || valor === undefined) return "-";
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: moneda,
        minimumFractionDigits: 2,
    }).format(valor);
};

export const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(fecha));
};

export const formatearFechaHora = (fecha) => {
    if (!fecha) return "-";
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(fecha));
};

export const formatearFechaRelativa = (fecha) => {
    if (!fecha) return "-";
    const ahora = new Date();
    const objetivo = new Date(fecha);
    const diffMs = ahora - objetivo;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHrs / 24);

    if (diffMin < 1) return "Hace un momento";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHrs < 24) return `Hace ${diffHrs} h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;
    return formatearFecha(fecha);
};

export const formatearNumero = (valor) => {
    if (valor === null || valor === undefined) return "-";
    return new Intl.NumberFormat("es-PE").format(valor);
};

export const generarSlug = (texto) => {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .trim();
};

export const truncarTexto = (texto, longitud = 100) => {
    if (!texto) return "";
    if (texto.length <= longitud) return texto;
    return `${texto.slice(0, longitud)}...`;
};

export const capitalizarPrimera = (texto) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export const formatearNombreCompleto = (nombre) => {
    if (!nombre) return "-";
    return nombre
        .split(" ")
        .map((p) => capitalizarPrimera(p))
        .join(" ");
};
