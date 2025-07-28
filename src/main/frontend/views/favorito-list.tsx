import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Notification } from '@vaadin/react-components';
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
      .then((res) => res.json())
      .then((data) => setImagenes(data ?? []));
    VentaService.listVenta().then((data) => setVentas((data ?? []).filter(Boolean)));
  }, []);

  // Busca los datos del auto por idAuto
  const getAutoData = (favorito: FavoritoItem) => {
    return autos.find((a) => String(a.id) === String(favorito.idAuto)) || {};
  };

  // Devuelve el nombre del auto (marca + modelo)
  const getNombreAuto = (favorito: FavoritoItem) => {
    const auto = getAutoData(favorito);
    return `${auto.marca || ''} ${auto.modelo || ''}`.trim();
  };

  // Devuelve la URL de la primera imagen del auto
  const getImagenAuto = (idAuto: number) => {
    const img = imagenes.find((img) => Number(img.idAuto) === Number(idAuto));
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
    <main style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      <h2
        style={{
          textAlign: 'center',
          color: '#3f51b5',
          fontWeight: 700,
          fontSize: 32,
          marginBottom: 32,
        }}>
        Descubre tus Favoritos
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
          justifyContent: 'center',
        }}>
        {items.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: 40 }}>
            <h3 style={{ fontSize: 24, fontWeight: 600 }}>No tienes autos favoritos</h3>
            <p>Agrega autos a favoritos para verlos aquí.</p>
          </div>
        )}
        {items.map((fav) => {
          const auto = getAutoData(fav);
          return (
            <div
              key={fav.id}
              className="card-bordered auto-card-uniform auto-card-spacing flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card w-full mx-auto relative"
              style={{
                minWidth: 320,
                maxWidth: 400,
                margin: '0 auto',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
              <div
                className="card-image-container-400x300 mb-3 flex flex-row gap-2 overflow-x-auto"
                style={{ background: '#e5e7eb' }}>
                {getImagenAuto(fav.idAuto) ? (
                  <img
                    src={getImagenAuto(fav.idAuto)}
                    alt={auto.modelo}
                    className="card-image-400x300 object-cover rounded-t-lg"
                    style={{ maxHeight: 220, maxWidth: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div
                    className="card-image-400x300 flex items-center justify-center bg-muted rounded-t-lg text-muted-foreground text-4xl"
                    style={{ height: 220 }}>
                    <span role="img" aria-label="Sin imagen">
                      🚗
                    </span>
                  </div>
                )}
              </div>
              <div
                className="flex flex-col flex-grow px-4 gap-2 items-center text-center"
                style={{ flex: 1, minHeight: 0 }}>
                <div className="font-headline text-lg mb-0.5 break-words flex flex-col items-center gap-1 w-full">
                  <span>{auto.modelo}</span>
                  <span className="auto-badge-category whitespace-nowrap mt-0.5">{auto.categoria}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">Año {auto.anio}</div>
                <div className="auto-price-highlight mb-1">
                  ${auto.precio ? Number(auto.precio).toLocaleString() : 'No especificado'}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-2 w-full">
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="font-semibold">KM:</span>{' '}
                    {auto.kilometraje ? Number(auto.kilometraje).toLocaleString() : 'No especificado'}
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="font-semibold">Color:</span> {auto.color || 'No especificado'}
                  </div>
                </div>
                <span className="auto-badge-fuel mb-2 w-max">{auto.tipoCombustible || 'No especificado'}</span>
                <div className="text-xs text-muted-foreground truncate w-full">
                  Matrícula: {auto.matricula || 'No especificado'}
                </div>
                <div className="text-xs text-muted-foreground truncate w-full">
                  Ciudad: {auto.ciudad || 'No especificado'}
                </div>
                <div className="text-xs text-muted-foreground truncate w-full">
                  Puertas: {auto.puertas || 'No especificado'}
                </div>
                <div className="text-xs text-muted-foreground truncate w-full">
                  Categoría: {auto.categoria || 'No especificado'}
                </div>
                <div className="text-xs text-muted-foreground truncate w-full">
                  Descripción: {auto.descripcion || 'No especificado'}
                </div>
              </div>
              <div
                style={{
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  background: '#fff',
                  borderRadius: '0 0 8px 8px',
                }}>
                <button
                  style={{
                    background: '#e53935',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '0 0 8px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    justifyContent: 'center',
                    border: 'none',
                    padding: '14px 0',
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => handleQuitarFavorito(fav)}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#b71c1c')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#e53935')}>
                  Quitar de Favoritos
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
