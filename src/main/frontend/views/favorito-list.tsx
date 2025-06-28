<<<<<<< HEAD
// ...existing code...
=======
import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Notification } from '@vaadin/react-components';
import { FavoritoService, AutoService, VentaService } from 'Frontend/generated/endpoints';

export const config: ViewConfig = {
    title: 'Favorito',
    menu: {
        icon: 'vaadin:heart',
        order: 1,
        title: 'Favorito',
    },
};

interface FavoritoItem {
    id?: number;
    fechaGuardado: string;
    idAuto: number;
    idUsuario: number;
}

export default function FavoritoView() {
    const [items, setItems] = useState<FavoritoItem[]>([]);
    const [autos, setAutos] = useState<any[]>([]);
    const [imagenes, setImagenes] = useState<any[]>([]);
    const [ventas, setVentas] = useState<any[]>([]);

    // Cargar favoritos, autos, imágenes y ventas
    const cargarFavoritos = async () => {
        try {
            const data = await FavoritoService.listFavorito();
            setItems(
                Array.isArray(data)
                    ? data
                        .filter((item: any): item is Record<string, any> => !!item && item.idAuto)
                        .map((item: any) => ({
                            id: item.id ? Number(item.id) : undefined,
                            fechaGuardado: String(item.fechaGuardado ?? ''),
                            idAuto: Number(item.idAuto),
                            idUsuario: Number(item.idUsuario),
                        }))
                    : []
            );
        } catch (e) {
            setItems([]);
        }
    };

    useEffect(() => {
        cargarFavoritos();
        AutoService.listAuto().then((data) => {
            setAutos((data ?? []).filter(Boolean));
        });
        fetch('/api/imagenes')
            .then(res => res.json())
            .then(data => setImagenes(data ?? []));
        VentaService.listVenta().then((data) => setVentas((data ?? []).filter(Boolean)));
    }, []);

    // Busca los datos del auto por idAuto
    const getAutoData = (favorito: FavoritoItem) => {
        return autos.find(a => String(a.id) === String(favorito.idAuto)) || {};
    };

    // Devuelve el nombre del auto (marca + modelo)
    const getNombreAuto = (favorito: FavoritoItem) => {
        const auto = getAutoData(favorito);
        return `${auto.marca || "Sin marca"} ${auto.modelo || ""}`.trim();
    };

    // Devuelve la URL de la primera imagen del auto
    const getImagenAuto = (idAuto: number) => {
        const img = imagenes.find(img => Number(img.idAuto) === Number(idAuto));
        return img ? img.url : null;
    };

    // Quitar de favoritos
    const handleQuitarFavorito = async (favorito: FavoritoItem) => {
        try {
            await FavoritoService.delete(favorito.id!);
            Notification.show('Eliminado de favoritos', { duration: 2000, position: 'top-center', theme: 'success' });
            await cargarFavoritos();
        } catch (error: any) {
            console.error(error);
            Notification.show('Error al quitar de favoritos', { duration: 3000, position: 'top-center', theme: 'error' });
        }
    };

    return (
        <main style={{ background: "#f8fafc", minHeight: "100vh", padding: "2rem" }}>
            <h2 style={{
                textAlign: "center",
                color: "#3f51b5",
                fontWeight: 700,
                fontSize: 32,
                marginBottom: 32
            }}>
                Descubre tus Favoritos
            </h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                gap: 32,
                justifyContent: "center"
            }}>
                {items.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#888", padding: 40 }}>
                        <h3 style={{ fontSize: 24, fontWeight: 600 }}>No tienes autos favoritos</h3>
                        <p>Agrega autos a favoritos para verlos aquí.</p>
                    </div>
                )}
                {items.map((fav) => (
                    <div key={fav.id} style={{
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px #0001",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 320,
                        maxWidth: 400,
                        margin: "0 auto"
                    }}>
                        {/* Nombre grande */}
                        <div style={{
                            background: "#e5e7eb",
                            padding: "18px 0",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: 26,
                            color: "#b0b0b0"
                        }}>
                            {getNombreAuto(fav)}
                        </div>
                        {/* Imagen */}
                        <div style={{
                            background: "#e5e7eb",
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 40,
                            color: "#b0b0b0"
                        }}>
                            {getImagenAuto(fav.idAuto)
                                ? <img src={getImagenAuto(fav.idAuto)} alt="Auto" style={{ maxHeight: 110, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }} />
                                : getNombreAuto(fav)}
                        </div>
                        {/* Botón quitar favorito */}
                        <div style={{ padding: 16, borderTop: "1px solid #eee", display: "flex", justifyContent: "center" }}>
                            <Button
                                theme="error"
                                style={{
                                    background: "#e53935",
                                    color: "#fff",
                                    fontWeight: 600,
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    width: "100%",
                                    justifyContent: "center"
                                }}
                                onClick={() => handleQuitarFavorito(fav)}
                            >
                                Quitar de Favoritos
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
>>>>>>> origin/feature/Sebas-ModuloValoracion
