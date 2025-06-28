<<<<<<< HEAD
// ...existing code...
=======
import { useEffect, useState } from 'react';
import { Button, Dialog, Notification, NumberField, DatePicker, ComboBox, VerticalLayout, Select, TextField } from '@vaadin/react-components';
import { VentaService, AutoService, FavoritoService, ValoracionService } from 'Frontend/generated/endpoints';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
    title: 'Venta',
    menu: {
        icon: 'vaadin:cart',
        order: 1,
        title: 'Venta',
    },
};

type VentaItem = {
    id?: number;
    precioFinal: number;
    fecha: string;
    idAuto: number;
    modelo?: string;
    anio?: number;
};

function StarRating({ value, onChange }: { value: number, onChange: (v: number) => void }) {
    return (
        <div style={{ fontSize: 28, color: "#ffa000", cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => onChange(star)}>
                    {star <= value ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
}

export function VentaEntryForm({
    onVentaCreated,
    ventaEditar,
    modoEdicion,
    onCancel,
    onVentaEditada
}: {
    onVentaCreated?: () => void,
    ventaEditar?: VentaItem | null,
    modoEdicion?: boolean,
    onCancel?: () => void,
    onVentaEditada?: () => void
}) {
    const [ventaForm, setVentaForm] = useState({
        precioFinal: '',
        fecha: '',
        idAuto: ''
    });
    const [autos, setAutos] = useState<any[]>([]);

    useEffect(() => {
        AutoService.listAuto().then((data: any) => setAutos((data ?? []).filter(Boolean)));
    }, []);

    useEffect(() => {
        if (ventaEditar && modoEdicion) {
            setVentaForm({
                precioFinal: ventaEditar.precioFinal ? String(ventaEditar.precioFinal) : '',
                fecha: ventaEditar.fecha || '',
                idAuto: ventaEditar.idAuto ? String(ventaEditar.idAuto) : ''
            });
        } else if (!modoEdicion) {
            setVentaForm({ precioFinal: '', fecha: '', idAuto: '' });
        }
    }, [ventaEditar, modoEdicion]);

    const handleChange = (field: string, value: any) => {
        setVentaForm(prev => ({ ...prev, [field]: value }));
    };

    const createVenta = async () => {
        if (!ventaForm.precioFinal || !ventaForm.fecha || !ventaForm.idAuto) {
            Notification.show('Todos los campos son obligatorios', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        try {
            await VentaService.create(
                Number(ventaForm.precioFinal),
                ventaForm.fecha,
                Number(ventaForm.idAuto)
            );
            if (onVentaCreated) onVentaCreated();
            setVentaForm({ precioFinal: '', fecha: '', idAuto: '' });
            Notification.show('Venta registrada correctamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar la venta', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    const editarVenta = async () => {
        if (!ventaForm.precioFinal || !ventaForm.fecha || !ventaForm.idAuto) {
            Notification.show('Todos los campos son obligatorios', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        try {
            if (!ventaEditar || !ventaEditar.id) {
                Notification.show('No se encontró la venta a editar', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await VentaService.update(
                ventaEditar.id,
                Number(ventaForm.precioFinal),
                ventaForm.fecha,
                Number(ventaForm.idAuto)
            );
            if (onVentaEditada) { onVentaEditada(); }
            Notification.show('Venta editada correctamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al editar la venta', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    return (
        <VerticalLayout style={{ gap: '1rem', minWidth: 320, maxWidth: 400 }}>
            <NumberField
                label="Precio final"
                value={ventaForm.precioFinal}
                onValueChanged={e => handleChange('precioFinal', e.detail.value)}
                min={0}
                step={0.01}
                required
                placeholder="Ej: 15000"
            />
            <DatePicker
                label="Fecha"
                value={ventaForm.fecha}
                onValueChanged={e => handleChange('fecha', e.detail.value)}
                required
                placeholder="Seleccione una fecha"
            />
            <ComboBox
                label="Auto"
                items={autos.map((a: any) => ({ label: `${a.marca} ${a.modelo}`, value: String(a.id) }))}
                value={ventaForm.idAuto}
                onValueChanged={e => handleChange('idAuto', e.detail.value)}
                placeholder="Seleccione un auto"
                required
                clearButtonVisible
            />
            <div className="flex gap-2 mt-4 justify-center">
                {onCancel && <Button onClick={onCancel}>Cancelar</Button>}
                {modoEdicion ? (
                    <Button onClick={editarVenta} theme="primary">Guardar cambios</Button>
                ) : (
                    <Button onClick={createVenta} theme="primary">Registrar</Button>
                )}
            </div>
        </VerticalLayout>
    );
}

export default function VentaView() {
    const [dialogOpened, setDialogOpened] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [ventaEditar, setVentaEditar] = useState<VentaItem | null>(null);
    const [ventas, setVentas] = useState<VentaItem[]>([]);
    const [autos, setAutos] = useState<any[]>([]);
    const [sort, setSort] = useState<'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'>('date_desc');
    const [imagenes, setImagenes] = useState<any[]>([]);

    // Para valoración
    const [valoracionDialogOpen, setValoracionDialogOpen] = useState(false);
    const [ventaAValorar, setVentaAValorar] = useState<VentaItem | null>(null);
    const [puntuacion, setPuntuacion] = useState(5);
    const [comentario, setComentario] = useState("");

    // Estados para búsqueda avanzada
    const [criterioBusqueda, setCriterioBusqueda] = useState<string>('fecha');
    const [textoBusqueda, setTextoBusqueda] = useState<string>('');
    const [busquedaActiva, setBusquedaActiva] = useState(false);

    // Solo permitir búsqueda por fecha y marca
    const criterios = [
        { label: 'Fecha', value: 'fecha' },
        { label: 'Marca', value: 'marca' },
    ];

    const handleAgregarFavorito = async (venta: VentaItem) => {
        try {
            await FavoritoService.create(
                new Date().toISOString().split('T')[0],
                venta.idAuto,
                1
            );
            Notification.show('Agregado a favoritos', { duration: 2000, position: 'top-center', theme: 'success' });
        } catch (error: any) {
            Notification.show('Error al agregar a favoritos', { duration: 3000, position: 'top-center', theme: 'error' });
        }
    };

    useEffect(() => {
        AutoService.listAuto().then((data: any) => {
            setAutos((data ?? []).filter(Boolean));
        });
    }, []);

    // Cargar imágenes desde el API REST
    useEffect(() => {
        fetch('/api/imagenes')
            .then(res => res.json())
            .then(data => setImagenes(data ?? []));
    }, []);

    // Cargar ventas según búsqueda y orden
    const cargarVentas = async (forzarBusqueda = false) => {
        let data;
        if ((busquedaActiva || forzarBusqueda) && textoBusqueda) {
            data = await VentaService.buscar(criterioBusqueda, textoBusqueda);
        } else {
            let atributo = 'fecha';
            let tipo = 2;
            if (sort === 'date_asc') { atributo = 'fecha'; tipo = 1; }
            if (sort === 'price_desc') { atributo = 'precioFinal'; tipo = 2; }
            if (sort === 'price_asc') { atributo = 'precioFinal'; tipo = 1; }
            data = await VentaService.ordenar(atributo, tipo);
        }
        setVentas(
            (data ?? [])
                .filter((item: any): item is Record<string, any> => !!item)
                .map((item: any) => ({
                    id: item.id ? Number(item.id) : undefined,
                    precioFinal: Number(item.precioFinal),
                    fecha: String(item.fecha),
                    idAuto: Number(item.idAuto),
                    modelo: item.modelo,
                    anio: item.anio,
                }))
        );
    };

    // Ordenar solo si no hay búsqueda activa
    useEffect(() => {
        if (!busquedaActiva) {
            cargarVentas();
        }
    }, [sort]);

    // Al inicio carga ventas ordenadas
    useEffect(() => {
        cargarVentas();
    }, []);

    // Si limpias el texto de búsqueda, vuelve a cargar ventas ordenadas
    useEffect(() => {
        if (!textoBusqueda) {
            setBusquedaActiva(false);
            cargarVentas();
        }
    }, [textoBusqueda]);

    // Buscar solo al presionar el botón
    const buscarVentas = async () => {
        setBusquedaActiva(true);
        await cargarVentas(true);
    };

    const getNombreAuto = (venta: VentaItem) => {
        const auto = autos.find(a => String(a.id) === String(venta.idAuto));
        if (auto) {
            return `${auto.marca || ""} ${auto.modelo || ""}`.trim() || "Sin información";
        }
        return "Sin información";
    };

    // Devuelve la URL de la primera imagen del auto
    const getImagenAuto = (idAuto: number) => {
        const img = imagenes.find(img => Number(img.idAuto) === Number(idAuto));
        return img ? img.url : null;
    };

    // Guardar valoración
    const guardarValoracion = async () => {
        if (!ventaAValorar) return;
        await ValoracionService.create(
            puntuacion,
            new Date().toISOString().split('T')[0],
            comentario,
            ventaAValorar.id!
        );
        setValoracionDialogOpen(false);
        Notification.show('¡Valoración registrada!', { duration: 3000, position: 'bottom-end', theme: 'success' });
    };

    return (
        <main className="w-full h-full flex flex-col gap-4 p-4" style={{ background: "#f2f2f2" }}>
            <header className="mb-8 text-center">
                <h1 style={{ fontSize: 32, fontWeight: 700, color: "#29ABE2" }}>AutoMarket</h1>
                <p style={{ fontSize: 18, color: "#888" }}>Bienvenido</p>
            </header>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <Select
                    items={criterios}
                    value={criterioBusqueda}
                    onValueChanged={e => setCriterioBusqueda(e.detail.value)}
                    style={{ minWidth: 120 }}
                    placeholder="Criterio"
                />
                <TextField
                    placeholder={`Buscar por ${criterioBusqueda === 'fecha' ? 'fecha (YYYY-MM-DD)' : 'marca'}`}
                    value={textoBusqueda}
                    onValueChanged={e => setTextoBusqueda(e.detail.value)}
                    style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: 16,
                        background: "#fff"
                    }}
                />
                <Button
                    theme="primary"
                    style={{ background: "#29ABE2", color: "#fff", fontWeight: 600, borderRadius: 8 }}
                    onClick={buscarVentas}
                >
                    Buscar
                </Button>
                <Button
                    theme="primary"
                    style={{ background: "#39B54A", color: "#fff", fontWeight: 600, padding: "0 24px", borderRadius: 8 }}
                    onClick={() => { setDialogOpened(true); setModoEdicion(false); setVentaEditar(null); }}
                >
                    + Agregar venta
                </Button>
            </div>
            {/* Grid de tarjetas */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24
            }}>
                {ventas.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#888", padding: 40 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 600 }}>No hay ventas</h2>
                        <p>Intenta cambiar tu búsqueda o agrega una nueva venta.</p>
                    </div>
                )}
                {ventas.map((venta) => (
                    <div key={venta.id} style={{
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px #0001",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            background: "#e5e7eb",
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#b0b0b0"
                        }}>
                            {getImagenAuto(venta.idAuto) ? (
                                <img
                                    src={getImagenAuto(venta.idAuto)}
                                    alt={getNombreAuto(venta)}
                                    style={{ maxHeight: 110, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }}
                                />
                            ) : (
                                getNombreAuto(venta)
                            )}
                        </div>
                        <div style={{ padding: 16, flexGrow: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 18 }}>
                                {getNombreAuto(venta)}
                            </div>
                            <div style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>
                                {venta.anio ? `Año: ${venta.anio}` : ""}
                            </div>
                            <div style={{ color: "#29ABE2", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                                $ {venta.precioFinal.toLocaleString()}
                            </div>
                            <div style={{ color: "#888", fontSize: 14, display: "flex", alignItems: "center" }}>
                                <span style={{ marginRight: 6 }}>🗓️</span>
                                Publicado desde: {venta.fecha}
                            </div>
                        </div>
                        <div style={{
                            padding: 16,
                            borderTop: "1px solid #eee",
                            display: "flex",
                            gap: 8
                        }}>
                            <Button
                                theme="primary"
                                style={{
                                    background: "#ffa000",
                                    color: "#fff",
                                    fontWeight: 600,
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flex: 1,
                                    justifyContent: "center"
                                }}
                                onClick={() => handleAgregarFavorito(venta)}
                            >
                                <span style={{ fontSize: 20, marginRight: 8, display: "flex", alignItems: "center" }}>❤️</span>
                            </Button>
                            <Button theme="secondary" style={{ flex: 1 }}>Chat</Button>
                            <Button theme="primary" style={{ flex: 1 }} onClick={() => {
                                setVentaEditar(venta);
                                setModoEdicion(true);
                                setDialogOpened(true);
                            }}>Editar</Button>
                            <Button
                                theme="primary"
                                style={{ flex: 1, background: "#29ABE2", color: "#fff", borderRadius: 8 }}
                                onClick={() => {
                                    setVentaAValorar(venta);
                                    setPuntuacion(5);
                                    setComentario("");
                                    setValoracionDialogOpen(true);
                                }}
                            >
                                Valorar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog
                headerTitle={modoEdicion ? "Editar venta" : "Registrar nueva venta"}
                opened={dialogOpened}
                onOpenedChanged={e => setDialogOpened(e.detail.value)}
                footer={null}
            >
                <VentaEntryForm
                    onVentaCreated={() => { setDialogOpened(false); cargarVentas(); }}
                    ventaEditar={ventaEditar}
                    modoEdicion={modoEdicion}
                    onCancel={() => setDialogOpened(false)}
                    onVentaEditada={() => { setDialogOpened(false); setModoEdicion(false); setVentaEditar(null); cargarVentas(); }}
                />
            </Dialog>
            {/* Diálogo de valoración */}
            <Dialog
                opened={valoracionDialogOpen}
                headerTitle={`Valorar venta: ${ventaAValorar ? getNombreAuto(ventaAValorar) : ""}`}
                onOpenedChanged={e => setValoracionDialogOpen(e.detail.value)}
                footer={
                    <>
                        <Button onClick={() => setValoracionDialogOpen(false)}>Cancelar</Button>
                        <Button theme="primary" onClick={guardarValoracion}>Guardar valoración</Button>
                    </>
                }
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 300 }}>
                    <label style={{ fontWeight: 600 }}>Puntuación:</label>
                    <StarRating value={puntuacion} onChange={setPuntuacion} />
                    <TextField
                        label="Comentario"
                        value={comentario}
                        onValueChanged={e => setComentario(e.detail.value)}
                        style={{ width: "100%" }}
                        required
                    />
                </div>
            </Dialog>
        </main>
    );
}
>>>>>>> origin/feature/Sebas-ModuloValoracion
