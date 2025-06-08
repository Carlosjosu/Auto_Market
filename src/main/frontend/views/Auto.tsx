import { useEffect, useState } from 'react';
import { Button, Grid, GridColumn, GridSortColumn, TextField, VerticalLayout, Dialog, Checkbox, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { AutoService, MarcaService } from 'Frontend/generated/endpoints';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { HorizontalLayout } from '@vaadin/react-components/HorizontalLayout';
import { TextArea } from '@vaadin/react-components/TextArea';


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

function AutoEntryForm({ onAutoCreated }: { onAutoCreated?: () => void }) {
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
    const [dialogOpened, setDialogOpened] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [editMode, setEditMode] = useState<'edit' | 'create' | null>(null);
    const [tiposCombustible, setTiposCombustible] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [marcas, setMarcas] = useState<{ id: number, nombre: string }[]>([]);
    const [ventas, setVentas] = useState<{ id: number }[]>([]);

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
            setDialogOpened(false);
            Notification.show('Auto creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar el auto', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    useEffect(() => {
        AutoService.getTiposCombustible().then((data) => setTiposCombustible((data ?? []).filter(Boolean) as string[]));
        AutoService.getCategorias().then((data) => setCategorias((data ?? []).filter(Boolean) as string[]));
        MarcaService.listMarca().then((data: any) => {
            setMarcas((data ?? []).filter(Boolean).map((m: any) => ({ id: Number(m.id), nombre: m.nombre })));
        });
        // Obtener ventas
        import('Frontend/generated/endpoints').then(({ VentaService }) => {
            if (VentaService && VentaService.listVenta) {
                VentaService.listVenta().then((data: any) => {
                    setVentas((data ?? []).filter(Boolean).map((v: any) => ({ id: Number(v.id) })));
                });
            }
        });
    }, []);

    // Lista de autos de ejemplo para edición
    const autosEjemplo: AutoItem[] = [
        {
            modelo: 'Corolla', anio: '2020', puertas: 4, color: 'Rojo', kilometraje: 35000, ciudad: 'Quito', precio: 15000, matricula: 'ABC123', codigoVIN: '1HGCM82633A004352', descripcion: 'Auto en excelente estado', fechaRegistro: '2024-06-08', estaDisponible: true, idVenta: 1, idMarca: 1, tipoCombustible: 'GASOLINA', categoria: 'SEDAN'
        },
        {
            modelo: 'Sentra', anio: '2019', puertas: 4, color: 'Azul', kilometraje: 42000, ciudad: 'Guayaquil', precio: 12000, matricula: 'DEF456', codigoVIN: '2HGCM82633A004353', descripcion: 'Buen estado, único dueño', fechaRegistro: '2023-05-10', estaDisponible: false, idVenta: 2, idMarca: 2, tipoCombustible: 'DIESEL', categoria: 'HATCHBACK'
        }
    ];
    const [autoEjemploSeleccionado, setAutoEjemploSeleccionado] = useState(autosEjemplo[0]);

    const handleEdit = () => {
        const item = autoEjemploSeleccionado;
        setModelo(item.modelo);
        setAnio(item.anio);
        setPuertas(String(item.puertas));
        setColor(item.color);
        setKilometraje(String(item.kilometraje));
        setCiudad(item.ciudad);
        setPrecio(String(item.precio));
        setMatricula(item.matricula);
        setCodigoVIN(item.codigoVIN);
        setDescripcion(item.descripcion);
        setFechaRegistro(item.fechaRegistro);
        setEstaDisponible(item.estaDisponible);
        setIdVenta(String(item.idVenta));
        setIdMarca(String(item.idMarca));
        setTipoCombustible(item.tipoCombustible);
        setCategoria(item.categoria);
        setEditMode('edit');
        setDialogOpened(true);
    };
    const handleCreate = () => {
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
        setEditMode('create');
        setDialogOpened(true);
    };
    const toggleDeleteButtonVisibility = () => {
        setShowDeleteButton(v => !v);
    };
    const handleDeleteSuccess = () => {
        Notification.show(`Auto eliminado: ${JSON.stringify({ modelo, anio, puertas, color, kilometraje, ciudad, precio, matricula, codigoVIN, descripcion, fechaRegistro, estaDisponible, idVenta, idMarca, tipoCombustible, categoria })}`);
        setDialogOpened(false);
    };

    return (
        <VerticalLayout>
            <HorizontalLayout theme="spacing">
                <ComboBox
                    label="Selecciona un auto de ejemplo para editar"
                    items={autosEjemplo.map((a, idx) => ({ label: `${a.modelo} (${a.anio})`, value: String(idx) }))}
                    value={String(autosEjemplo.indexOf(autoEjemploSeleccionado))}
                    onValueChanged={e => setAutoEjemploSeleccionado(autosEjemplo[Number(e.detail.value)])}
                    style={{ width: 200 }}
                />
                <Button onClick={handleEdit}>Editar Auto</Button>
                <Button onClick={handleCreate}>Crear nuevo</Button>
                <Button onClick={toggleDeleteButtonVisibility}>
                    {showDeleteButton ? 'Ocultar Eliminar' : 'Mostrar Eliminar'}
                </Button>
            </HorizontalLayout>
            <Dialog
                modeless
                headerTitle={editMode === 'edit' ? 'Editar Auto' : 'Nuevo Auto'}
                opened={dialogOpened}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => setDialogOpened(detail.value)}
                footer={
                    <>
                        <Button onClick={() => setDialogOpened(false)}>Cancelar</Button>
                        {showDeleteButton && editMode === 'edit' && (
                            <Button theme="error" onClick={handleDeleteSuccess}>Eliminar</Button>
                        )}
                        <Button onClick={createAuto} theme="primary">Registrar</Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField label="Modelo" value={modelo} placeholder="Ej: Corolla" onValueChanged={e => setModelo(e.detail.value)} />
                    <TextField label="Año" value={anio} placeholder="Ej: 2020" onValueChanged={e => setAnio(e.detail.value)} />
                    <TextField label="Puertas" value={puertas} placeholder="Ej: 4" onValueChanged={e => setPuertas(e.detail.value)} />
                    <TextField label="Color" value={color} placeholder="Ej: Rojo" onValueChanged={e => setColor(e.detail.value)} />
                    <TextField label="Kilometraje" value={kilometraje} placeholder="Ej: 35000" onValueChanged={e => setKilometraje(e.detail.value)} />
                    <TextField label="Ciudad" value={ciudad} placeholder="Ej: Quito" onValueChanged={e => setCiudad(e.detail.value)} />
                    <TextField label="Precio" value={precio} placeholder="Ej: 15000" onValueChanged={e => setPrecio(e.detail.value)} />
                    <TextField label="Matrícula" value={matricula} placeholder="Ej: ABC123" onValueChanged={e => setMatricula(e.detail.value)} />
                    <TextField label="VIN" value={codigoVIN} placeholder="Ej: 1HGCM82633A004352" onValueChanged={e => setCodigoVIN(e.detail.value)} />
                    <TextArea label="Descripción" value={descripcion} style={{ width: '100%', minHeight: '100px', maxHeight: '150px' }} onValueChanged={e => setDescripcion(e.detail.value)} />
                    <TextField label="Fecha Registro (yyyy-MM-dd)" value={fechaRegistro} placeholder="Ej: 2024-06-08" onValueChanged={e => setFechaRegistro(e.detail.value)} />
                    <Checkbox label="¿Disponible?" checked={estaDisponible} onCheckedChanged={e => setEstaDisponible(e.detail.value)} />
                    <ComboBox label="Venta" items={ventas.map(v => ({ label: String(v.id), value: String(v.id) }))} value={idVenta} placeholder="Seleccione una venta" onValueChanged={e => setIdVenta(e.detail.value)} />
                    <ComboBox label="Marca" items={marcas.map(m => ({ label: m.nombre, value: String(m.id) }))} value={idMarca} placeholder="Seleccione una marca" onValueChanged={e => setIdMarca(e.detail.value)} />
                    <ComboBox label="Tipo Combustible" items={tiposCombustible} value={tipoCombustible} placeholder="Ej: GASOLINA" onValueChanged={e => setTipoCombustible(e.detail.value)} />
                    <ComboBox label="Categoría" items={categorias} value={categoria} placeholder="Ej: SEDAN" onValueChanged={e => setCategoria(e.detail.value)} />
                </VerticalLayout>
            </Dialog>
        </VerticalLayout>
    );
}

export default function AutoView() {
    const [items, setItems] = useState<AutoItem[]>([]);
    const [marcas, setMarcas] = useState<{ id: number, nombre: string }[]>([]);

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
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        AutoService.ordenar(columnId, dir)
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
            .catch(() => Notification.show('Error al ordenar', { duration: 5000, position: 'top-center', theme: 'error' }));
    };

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    useEffect(() => {
        MarcaService.listMarca().then((data: any) => {
            setMarcas((data ?? []).filter(Boolean).map((m: any) => ({ id: Number(m.id), nombre: m.nombre })));
        });
    }, []);

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Autos">
                <Group>
                    <AutoEntryForm onAutoCreated={callData}/>
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="Numero" />
                <GridSortColumn path="anio" header="Año" onDirectionChanged={(e) => order(e, 'anio')} />
                <GridSortColumn path="modelo" header="Modelo" onDirectionChanged={(e) => order(e, 'modelo')} />
                <GridSortColumn path="color" header="Color" onDirectionChanged={(e) => order(e, 'color')} />
                <GridSortColumn path="precio" header="Precio" onDirectionChanged={(e) => order(e, 'precio')} />
                <GridSortColumn path="ciudad" header="Ciudad" onDirectionChanged={(e) => order(e, 'ciudad')} />
                <GridSortColumn path="matricula" header="Matrícula" onDirectionChanged={(e) => order(e, 'matricula')} />
                <GridSortColumn path="codigoVIN" header="Código VIN" onDirectionChanged={(e) => order(e, 'codigoVIN')} />
                <GridSortColumn path="descripcion" header="Descripción" onDirectionChanged={(e) => order(e, 'descripcion')} />
                <GridSortColumn path="estaDisponible" header="¿Disponible?" onDirectionChanged={(e) => order(e, 'estaDisponible')} />
                <GridColumn
                  header="Venta"
                  renderer={({ item }) => <span>{item.idVenta}</span>}
                />
                <GridColumn
                  header="Marca"
                  renderer={({ item }) => {
                    const marca = marcas.find(m => m.id === item.idMarca);
                    return <span>{marca ? marca.nombre : item.idMarca}</span>;
                  }}
                />
                <GridSortColumn path="tipoCombustible" header="Tipo Combustible" onDirectionChanged={(e) => order(e, 'tipoCombustible')} />
                <GridSortColumn path="categoria" header="Categoría" onDirectionChanged={(e) => order(e, 'categoria')} />
            </Grid>
        </main>
    );
}