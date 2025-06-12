import { useEffect, useState } from 'react';
import { Button, Dialog, Notification, ComboBox, Checkbox, TextArea, TextField, VerticalLayout, HorizontalLayout } from '@vaadin/react-components';
import { AutoService, MarcaService } from 'Frontend/generated/endpoints';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useSignal } from '@vaadin/hilla-react-signals';


interface AutoItem {
  modelo: string;
  anio: string;
  puertas: number;
  color: string;
  kilometraje: number;
  ciudad: string;
  precio: number;
  matricula: string;
  codigoVIN: string;
  descripcion: string;
  fechaRegistro: string;
  estaDisponible: boolean;
  idVenta: number;
  idMarca: number;
  tipoCombustible: string;
  categoria: string;
}

export const config = {
    title: 'Auto',
    menu: {
        icon: 'vaadin:car',
        order: 2,
        title: 'Auto',
    },
};

function AutoEntryForm({ onAutoCreated, marcas, ventas, tiposCombustible, categorias, onCancel }: {
    onAutoCreated?: () => void,
    marcas: { id: number, nombre: string }[],
    ventas: { id: number }[],
    tiposCombustible: string[],
    categorias: string[],
    onCancel?: () => void
}) {
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [puertas, setPuertas] = useState(''); // string
    const [color, setColor] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [precio, setPrecio] = useState('');
    const [matricula, setMatricula] = useState('');
    const [codigoVIN, setCodigoVIN] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [estaDisponible, setEstaDisponible] = useState(true);
    const [idVenta, setIdVenta] = useState(''); // string
    const [idMarca, setIdMarca] = useState(''); // string
    const [tipoCombustible, setTipoCombustible] = useState('');
    const [categoria, setCategoria] = useState('');

    const createAuto = async () => {
        try {
            if (!modelo.trim()) {
                Notification.show('El campo Modelo es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await AutoService.create(
                modelo,
                anio,
                puertas ? Number(puertas) : undefined,
                color,
                kilometraje || undefined,
                ciudad,
                precio || undefined,
                matricula,
                codigoVIN,
                descripcion,
                fechaRegistro,
                estaDisponible,
                idVenta ? Number(idVenta) : undefined,
                idMarca ? Number(idMarca) : undefined,
                tipoCombustible,
                categoria
            );
            if (onAutoCreated) onAutoCreated();
            setModelo('');
            setAnio('');
            setPuertas('');
            setColor('');
            setKilometraje('');
            setCiudad('');
            setPrecio('');
            setMatricula('');
            setCodigoVIN('');
            setDescripcion('');
            setFechaRegistro('');
            setEstaDisponible(true);
            setIdVenta('');
            setIdMarca('');
            setTipoCombustible('');
            setCategoria('');
            Notification.show('Auto creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar el auto', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    return (
        <VerticalLayout>
            {/* Campos en dos columnas usando clase personalizada */}
            <div className="form-grid-2col">
                <TextField label="Modelo" value={modelo} placeholder="Ej: Corolla" onValueChanged={e => setModelo(e.detail.value)} />
                <TextField label="Año" value={anio} placeholder="Ej: 2020" onValueChanged={e => setAnio(e.detail.value)} />
                <TextField label="Puertas" value={puertas} placeholder="Ej: 4" onValueChanged={e => setPuertas(e.detail.value)} />
                <TextField label="Color" value={color} placeholder="Ej: Rojo" onValueChanged={e => setColor(e.detail.value)} />
                <TextField label="Kilometraje" value={kilometraje} placeholder="Ej: 35000" onValueChanged={e => setKilometraje(e.detail.value)} />
                <TextField label="Ciudad" value={ciudad} placeholder="Ej: Quito" onValueChanged={e => setCiudad(e.detail.value)} />
                <TextField label="Precio" value={precio} placeholder="Ej: 15000" onValueChanged={e => setPrecio(e.detail.value)} />
                <TextField label="Matrícula" value={matricula} placeholder="Ej: ABC123" onValueChanged={e => setMatricula(e.detail.value)} />
                <TextField label="VIN" value={codigoVIN} placeholder="Ej: 1HGCM82633A004352" onValueChanged={e => setCodigoVIN(e.detail.value)} />
                <TextField label="Fecha Registro (yyyy-MM-dd)" value={fechaRegistro} placeholder="Ej: 2024-06-08" onValueChanged={e => setFechaRegistro(e.detail.value)} />
                <ComboBox label="Venta" items={ventas.map(v => ({ label: String(v.id), value: String(v.id) }))} value={idVenta} placeholder="Seleccione una venta" onValueChanged={e => setIdVenta(e.detail.value)} />
                {/* Select para marcas registradas */}
                <ComboBox
                    label="Marca"
                    items={marcas.map(m => ({ label: m.nombre, value: String(m.id) }))}
                    value={idMarca}
                    placeholder="Seleccione una marca"
                    onValueChanged={e => setIdMarca(e.detail.value)}
                    clearButtonVisible
                />
                <ComboBox label="Tipo Combustible" items={tiposCombustible} value={tipoCombustible} placeholder="Ej: GASOLINA" onValueChanged={e => setTipoCombustible(e.detail.value)} />
                <ComboBox label="Categoría" items={categorias} value={categoria} placeholder="Ej: SEDAN" onValueChanged={e => setCategoria(e.detail.value)} />
                <div className="form-grid-fullwidth">
                    <Checkbox label="¿Disponible?" checked={estaDisponible} onCheckedChanged={e => setEstaDisponible(e.detail.value)} />
                </div>
                <div className="form-grid-fullwidth">
                    <TextArea label="Descripción" value={descripcion} style={{ width: '100%', minHeight: '100px', maxHeight: '150px' }} onValueChanged={e => setDescripcion(e.detail.value)} />
                </div>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={onCancel}>Cancelar</Button>
                <Button onClick={createAuto} theme="primary">Registrar</Button>
            </div>
        </VerticalLayout>
    );
}

export default function AutoView() {
    const [items, setItems] = useState<AutoItem[]>([]);
    const [marcas, setMarcas] = useState<{ id: number, nombre: string }[]>([]);
    const [ventas, setVentas] = useState<{ id: number }[]>([]);
    const [tiposCombustible, setTiposCombustible] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [dialogOpened, setDialogOpened] = useState(false);

    const callData = () => {
        AutoService.listAuto()
            .then(data => setItems(
                (data ?? [])
                    .filter(Boolean)
                    .map((item: any) => ({
                        modelo: item.modelo ?? '',
                        anio: item.anio ?? '',
                        puertas: Number(item.puertas) || 0,
                        color: item.color ?? '',
                        kilometraje: Number(item.kilometraje) || 0,
                        ciudad: item.ciudad ?? '',
                        precio: Number(item.precio) || 0,
                        matricula: item.matricula ?? '',
                        codigoVIN: item.codigoVIN ?? '',
                        descripcion: item.descripcion ?? '',
                        fechaRegistro: item.fechaRegistro ?? '',
                        estaDisponible: Boolean(item.estaDisponible),
                        idVenta: Number(item.idVenta) || 0,
                        idMarca: Number(item.idMarca) || 0,
                        tipoCombustible: item.tipoCombustible ?? '',
                        categoria: item.categoria ?? ''
                    }))
            ))
            .catch(() => Notification.show('Error al cargar autos', { duration: 5000, position: 'top-center', theme: 'error' }));
    };

    useEffect(() => {
        callData();
        MarcaService.listMarca().then((data: any) => {
            setMarcas((data ?? []).filter(Boolean).map((m: any) => ({ id: Number(m.id), nombre: m.nombre })));
        });
        AutoService.getTiposCombustible().then((data) => setTiposCombustible((data ?? []).filter(Boolean) as string[]));
        AutoService.getCategorias().then((data) => setCategorias((data ?? []).filter(Boolean) as string[]));
        import('Frontend/generated/endpoints').then(({ VentaService }) => {
            if (VentaService && VentaService.listVenta) {
                VentaService.listVenta().then((data: any) => {
                    setVentas((data ?? []).filter(Boolean).map((v: any) => ({ id: Number(v.id) })));
                });
            }
        });
    }, []);

    // Renderizado de tarjetas tipo card
    return (
        <main className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex justify-end mb-4">
                <Button theme="primary" onClick={() => setDialogOpened(true)}>Agregar auto</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        No hay autos para mostrar.
                    </div>
                ) : items.map((auto, idx) => {
                    const marca = marcas.find(m => m.id === auto.idMarca)?.nombre || auto.idMarca;
                    return (
                        <div key={idx} className="card-bordered flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card h-full min-w-[300px] max-w-[400px] mx-auto relative">
                            {/* Botón de favorito SVG en la esquina superior izquierda */}
                            <button
                                className="absolute top-2 left-2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-red-100 transition-colors text-accent leading-none"
                                title="Marcar como favorito"
                                // onClick={() => ... lógica para marcar favorito ...}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart h-6 w-6 fill-accent">
                                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                </svg>
                            </button>
                            <div className="card-image-container-400x300 mb-2">
                                <div className="card-image-400x300 flex items-center justify-center bg-muted rounded-t-lg text-muted-foreground text-4xl">
                                    <span role="img" aria-label="Sin imagen">🚗</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow px-3 pb-3 gap-1 items-center text-center">
                                <div className="font-headline text-lg mb-0.5 break-words flex flex-col items-center gap-1 w-full">
                                    <span>{auto.modelo}</span>
                                    <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded px-2 py-0.5 whitespace-nowrap mt-0.5">{auto.categoria}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">Año {auto.anio}</div>
                                <div className="text-primary font-bold text-xl mb-1">${auto.precio.toLocaleString()}</div>
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-2 w-full">
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <span className="font-semibold">KM:</span> {auto.kilometraje.toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <span className="font-semibold">Color:</span> {auto.color}
                                    </div>
                                </div>
                                <span className="inline-block bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs font-semibold mb-2 w-max">{auto.tipoCombustible}</span>
                                <div className="text-xs text-muted-foreground truncate w-full">Matrícula: {auto.matricula}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Dialog
                headerTitle="Registrar nuevo auto"
                opened={dialogOpened}
                onOpenedChanged={e => setDialogOpened(e.detail.value)}
                footer={null}
            >
                <AutoEntryForm
                    onAutoCreated={() => { callData(); setDialogOpened(false); }}
                    marcas={marcas}
                    ventas={ventas}
                    tiposCombustible={tiposCombustible}
                    categorias={categorias}
                    onCancel={() => setDialogOpened(false)}
                />
            </Dialog>
        </main>
    );
}