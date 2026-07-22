import { useContext } from "react";
import { FavoritosContext } from "../context/FavoritosContext.jsx";

export const useFavoritos = () => {
    const contexto = useContext(FavoritosContext);
    if (!contexto) {
        throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
    }
    return contexto;
};
