import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, Checkbox, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { AutoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Auto',
    menu: {
        icon: 'vaadin:tag',
        order: 1,
        title: 'Auto',
    },
};

type AutoEntryFormProps = {
    onAutoCreated?: () => void;
};
function AutoEntryForm(props: AutoEntryFormProps) {
    const anio = useSignal('');
    const modelo = useSignal('');
    const puertas = useSignal(0);
    const color = useSignal('');
    const kilometraje = useSignal(0);
    const ciudad = useSignal('');
    const precio = useSignal(0);
    const matricula = useSignal('');
    const codigoVIN = useSignal('');
    const descripcion = useSignal('');
    const fechaRegistro = useSignal(new Date());
    const estaDisponible = useSignal(false);
    const idVendedor = useSignal(0);
    const idMarca = useSignal(0);
    const tipoCombustible = useSignal('');
    const categoria = useSignal('');

    const dialogOpened = useSignal(false);

    const createAuto = async () => {
        try {
            if (anio.value.trim() && modelo.value.trim()) {
                await AutoService.create(anio.value, modelo.value, puertas.value, color.value, kilometraje.value, ciudad.value, precio.value, matricula.value, codigoVIN.value, descripcion.value, fechaRegistro.value.toISOString(), estaDisponible.value, idVendedor.value, idMarca.value, tipoCombustible.value, categoria.value);
                if (props.onAutoCreated) props.onAutoCreated();
                anio.value = '';
                modelo.value = '';
                puertas.value = 0;
                color.value = '';
                kilometraje.value = 0;
                ciudad.value = '';
                precio.value = 0;
                matricula.value = '';
                codigoVIN.value = '';
                descripcion.value = '';
                fechaRegistro.value = new Date();
                estaDisponible.value = false;
                idVendedor.value = 0;
                idMarca.value = 0;
                tipoCombustible.value = '';
                categoria.value = '';
                dialogOpened.value = false;
                Notification.show('Auto creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo crear, faltan o hay datos inválidos', {
                    duration: 5000,
                    position: 'top-center',
                    theme: 'error',
                });
            }
        } catch (error) {
            handleError(error);
        }
    };

    // Opciones para los ComboBox
    const [tipoCombustibleOptions, setTipoCombustibleOptions] = useState<string[]>([]);
    const [categoriaOptions, setCategoriaOptions] = useState<string[]>([]);

    // Cargar opciones de enums desde el backend
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const tipos = await AutoService.getTipoCombustibleOptions();
                setTipoCombustibleOptions((tipos || []).filter((t): t is string => typeof t === 'string'));
            } catch (e) {
                Notification.show('Error cargando tipos de combustible', { theme: 'error' });
            }
            try {
                const categorias = await AutoService.getCategoriaOptions();
                setCategoriaOptions((categorias || []).filter((c): c is string => typeof c === 'string'));
            } catch (e) {
                Notification.show('Error cargando categorías', { theme: 'error' });
            }
        };
        fetchOptions();
    }, []);

    return (
        <>
            <Dialog
                modeless
                headerTitle="Nuevo Auto"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createAuto} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '100%', maxWidth: '30rem', gap: '1rem', padding: '1rem' }}>
                    <TextField label="Año" value={anio.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (anio.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Modelo" value={modelo.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (modelo.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Puertas" value={String(puertas.value)} onValueChanged={(evt: CustomEvent<{ value: string }>) => (puertas.value = Number(evt.detail.value))} style={{ width: '100%' }} />
                    <TextField label="Color" value={color.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (color.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Kilometraje" value={String(kilometraje.value)} onValueChanged={(evt: CustomEvent<{ value: string }>) => (kilometraje.value = Number(evt.detail.value))} style={{ width: '100%' }} />
                    <TextField label="Ciudad" value={ciudad.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (ciudad.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Precio" value={String(precio.value)} onValueChanged={(evt: CustomEvent<{ value: string }>) => (precio.value = Number(evt.detail.value))} style={{ width: '100%' }} />
                    <TextField label="Matrícula" value={matricula.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (matricula.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Código VIN" value={codigoVIN.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (codigoVIN.value = evt.detail.value)} style={{ width: '100%' }} />
                    <TextField label="Descripción" value={descripcion.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (descripcion.value = evt.detail.value)} style={{ width: '100%' }} />
                    <Checkbox label="¿Está disponible?" checked={estaDisponible.value} onCheckedChanged={(evt: CustomEvent<{ value: boolean }>) => (estaDisponible.value = evt.detail.value)} style={{ marginBottom: '0.5rem' }} />
                    <TextField label="ID Vendedor" value={String(idVendedor.value)} onValueChanged={(evt: CustomEvent<{ value: string }>) => (idVendedor.value = Number(evt.detail.value))} style={{ width: '100%' }} />
                    <TextField label="ID Marca" value={String(idMarca.value)} onValueChanged={(evt: CustomEvent<{ value: string }>) => (idMarca.value = Number(evt.detail.value))} style={{ width: '100%' }} />
                    <ComboBox
                      label="Tipo Combustible"
                      items={tipoCombustibleOptions}
                      value={tipoCombustible.value}
                      onValueChanged={(evt: CustomEvent<{ value: string }>) => (tipoCombustible.value = evt.detail.value)}
                      style={{ width: '100%' }}
                    />
                    <ComboBox
                      label="Categoría"
                      items={categoriaOptions}
                      value={categoria.value}
                      onValueChanged={(evt: CustomEvent<{ value: string }>) => (categoria.value = evt.detail.value)}
                      style={{ width: '100%' }}
                    />
                </VerticalLayout>
            </Dialog>
            <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
        </>
    );
}

export default function AutoView() {
    const callData = () => {
        AutoService.listAuto().then(function(data){
            setItems(Array.isArray(data) ? data.filter(Boolean) : []);
        });
    };
    
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: any) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        AutoService.ordenar(columnId, dir).then(function (data) {
            setItems(Array.isArray(data) ? data.filter(Boolean) : []);
        });
    }

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

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
                <GridSortColumn path="idVendedor" header="ID Vendedor" onDirectionChanged={(e) => order(e, 'idVendedor')} />
                <GridSortColumn path="idMarca" header="ID Marca" onDirectionChanged={(e) => order(e, 'idMarca')} />
                <GridSortColumn path="tipoCombustible" header="Tipo Combustible" onDirectionChanged={(e) => order(e, 'tipoCombustible')} />
                <GridSortColumn path="categoria" header="Categoría" onDirectionChanged={(e) => order(e, 'categoria')} />
            </Grid>
        </main>
    );
}