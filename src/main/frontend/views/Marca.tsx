import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, Checkbox, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { MarcaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import { HorizontalLayout } from '@vaadin/react-components/HorizontalLayout';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import type { GridItemModel } from '@vaadin/react-components';
import { Icon } from '@vaadin/react-components/Icon';

export const config: ViewConfig = {
    title: 'Marca',
    menu: {
        icon: 'vaadin:tag',
        order: 1,
        title: 'Marca',
    },
};

export default function MarcaView() {
    const callData = () => {
        MarcaService.listMarca().then(function(data: any){
            setItems((data ?? []).filter(Boolean));
        });
    };
    
    const [items, setItems] = useState<any[]>([]);
    const [editDialogOpened, setEditDialogOpened] = useState(false);
    const [marcaEditando, setMarcaEditando] = useState<any | null>(null);
    const [nombreEdit, setNombreEdit] = useState('');
    const [activaEdit, setActivaEdit] = useState(false);
    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        MarcaService.ordenar(columnId, dir).then(function (data: any) {
            setItems((data ?? []).filter(Boolean));
        });
    }

    function numeroRenderer({ item }: { item: any }) {
        if (!item || typeof item.id === 'undefined' || item.id === null) return <span>-</span>;
        return <span>{item.id}</span>;
    }
    function activaBadgeRenderer({ item }: { item: any }) {
        const activa = item && (item.estaActiva === true || item.estaActiva === "true");
        if (!item || typeof item.estaActiva === 'undefined' || item.estaActiva === null) {
            return (
                <Icon
                    aria-label="No definido"
                    icon="vaadin:close-small"
                    theme="badge contrast"
                    title="No definido"
                />
            );
        }
        let icon, title, theme;
        if (activa) {
            icon = 'vaadin:check';
            title = 'Sí';
            theme = 'success';
        } else {
            icon = 'vaadin:close-small';
            title = 'No';
            theme = 'error';
        }
        return (
            <Icon
                aria-label={title}
                icon={icon}
                theme={`badge ${theme}`}
                title={title}
            />
        );
    }
    const [opciones, setOpciones] = useState<string[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultadoBusqueda, setResultadoBusqueda] = useState<any | null>(null);

    useEffect(() => {
        MarcaService.listMarca().then((data: any) => {
            setOpciones((data ?? []).map((item: any) => item.nombre ?? ''));
        });
    }, []);

    const buscarMarca = async () => {
        if (!busqueda.trim()) {
            setResultadoBusqueda(null);
            Notification.show('Ingrese un nombre para buscar', { duration: 3000, position: 'top-center', theme: 'error' });
            return;
        }
        const result = await MarcaService.buscarPorAtributo('nombre', busqueda);
        if (result) {
            setResultadoBusqueda(result);
            setBusqueda('');
        } else {
            setResultadoBusqueda(null);
            Notification.show('No se encontró la marca', { duration: 4000, position: 'top-center', theme: 'error' });
        }
    };

    const abrirEditarMarca = (marca: any) => {
        setMarcaEditando(marca);
        setNombreEdit(marca.nombre);
        setActivaEdit(marca.estaActiva);
        setEditDialogOpened(true);
    };
    const guardarEdicionMarca = async () => {
        if (!nombreEdit.trim()) {
            Notification.show('El campo Nombre es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        try {
            await MarcaService.update(marcaEditando.id, nombreEdit, activaEdit);
            Notification.show('Marca actualizada', { duration: 4000, position: 'bottom-end', theme: 'success' });
            setEditDialogOpened(false);
            setMarcaEditando(null);
            callData();
        } catch (error: any) {
            Notification.show(error?.message || 'Error al actualizar la marca', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };
    const dialogoEdicion = (
        <Dialog
            opened={editDialogOpened}
            headerTitle="Editar Marca"
            onOpenedChanged={({ detail }: { detail: { value: boolean } }) => setEditDialogOpened(detail.value)}
            footer={
                <>
                    <Button onClick={() => setEditDialogOpened(false)}>Cancelar</Button>
                    <Button onClick={guardarEdicionMarca} theme="primary">Guardar</Button>
                </>
            }
        >
            <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                <TextField
                    label="Nombre"
                    value={nombreEdit}
                    onValueChanged={(evt: CustomEvent<{ value: string }>) => setNombreEdit(evt.detail.value)}
                />
                <Checkbox
                    label="¿Está activa?"
                    checked={activaEdit}
                    onCheckedChanged={(evt: CustomEvent<{ value: boolean }>) => setActivaEdit(evt.detail.value)}
                />
            </VerticalLayout>
        </Dialog>
    );

    const [dialogAddOpened, setDialogAddOpened] = useState(false);
    const [nombreAdd, setNombreAdd] = useState('');
    const [activaAdd, setActivaAdd] = useState(false);
    const agregarMarca = async () => {
        if (!nombreAdd.trim()) {
            Notification.show('El campo Nombre es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        try {
            await MarcaService.create(nombreAdd, activaAdd);
            Notification.show('Marca creada', { duration: 4000, position: 'bottom-end', theme: 'success' });
            setDialogAddOpened(false);
            setNombreAdd('');
            setActivaAdd(false);
            callData();
        } catch (error: any) {
            Notification.show(error?.message || 'Error al crear la marca', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };
    const dialogoAgregar = (
        <Dialog
            opened={dialogAddOpened}
            headerTitle="Agregar Marca"
            onOpenedChanged={({ detail }: { detail: { value: boolean } }) => setDialogAddOpened(detail.value)}
            footer={
                <>
                    <Button onClick={() => setDialogAddOpened(false)}>Cancelar</Button>
                    <Button onClick={agregarMarca} theme="primary">Registrar</Button>
                </>
            }
        >
            <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                <TextField
                    label="Nombre"
                    value={nombreAdd}
                    onValueChanged={(evt: CustomEvent<{ value: string }>) => setNombreAdd(evt.detail.value)}
                />
                <Checkbox
                    label="¿Está activa?"
                    checked={activaAdd}
                    onCheckedChanged={(evt: CustomEvent<{ value: boolean }>) => setActivaAdd(evt.detail.value)}
                />
            </VerticalLayout>
        </Dialog>
    );

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Marcas">
                <Group />
            </ViewToolbar>
            <div className="auto-toolbar-row">
                <div className="auto-search-group">
                    <ComboBox
                        label="Buscar marca por nombre"
                        items={opciones.filter(Boolean)}
                        value={busqueda ?? ''}
                        onValueChanged={e => setBusqueda(e.detail.value ?? '')}
                        placeholder="Ej: Toyota"
                        clearButtonVisible
                        className="auto-search-textfield"
                    />
                    <Button onClick={buscarMarca} theme="primary">Buscar</Button>
                    <Button onClick={() => { setBusqueda(''); setResultadoBusqueda(null); }} theme="tertiary">Limpiar</Button>
                    <Button onClick={() => setDialogAddOpened(true)} theme="primary">Agregar Marca</Button>
                </div>
            </div>
            {resultadoBusqueda ? (
                <Grid items={[resultadoBusqueda]}>
                    <GridColumn renderer={numeroRenderer} header="Numero" />
                    <GridSortColumn path="nombre" header="Nombre" onDirectionChanged={(e) => order(e, 'nombre')} />
                    <GridSortColumn path="estaActiva" header="¿Está activa?" renderer={activaBadgeRenderer} onDirectionChanged={(e) => order(e, 'estaActiva')} />
                    <GridColumn header="Acciones" renderer={({ item }) => (
                        <Button theme="tertiary" onClick={() => abrirEditarMarca(item)}>Editar</Button>
                    )} />
                </Grid>
            ) : (
                <Grid items={items.filter(Boolean)}>
                    <GridColumn renderer={numeroRenderer} header="Numero" />
                    <GridSortColumn path="nombre" header="Nombre" onDirectionChanged={(e) => order(e, 'nombre')} />
                    <GridSortColumn path="estaActiva" header="¿Está activa?" renderer={activaBadgeRenderer} onDirectionChanged={(e) => order(e, 'estaActiva')} />
                    <GridColumn header="Acciones" renderer={({ item }) => (
                        <Button theme="tertiary" onClick={() => abrirEditarMarca(item)}>Editar</Button>
                    )} />
                </Grid>
            )}
            {dialogoEdicion}
            {dialogoAgregar}
        </main>
    );
}