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

type MarcaEntryFormProps = {
    onMarcaCreated?: () => void;
};
function MarcaEntryForm(props: MarcaEntryFormProps) {
    const nombre = useSignal('');
    const estaActiva = useSignal(false);
    const dialogOpened = useSignal(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [editMode, setEditMode] = useState<'edit' | 'create' | null>(null);
    
    // Lista de marcas de ejemplo para edición
    const marcasEjemplo = [
        { nombre: 'Toyota', estaActiva: true },
        { nombre: 'Chevrolet', estaActiva: false },
        { nombre: 'Nissan', estaActiva: true }
    ];
    const [marcaEjemploSeleccionada, setMarcaEjemploSeleccionada] = useState(marcasEjemplo[0]);

    const handleEdit = () => {
        nombre.value = marcaEjemploSeleccionada.nombre;
        estaActiva.value = marcaEjemploSeleccionada.estaActiva;
        setEditMode('edit');
        dialogOpened.value = true;
    };
    const handleCreate = () => {
        nombre.value = '';
        estaActiva.value = false;
        setEditMode('create');
        dialogOpened.value = true;
    };
    const toggleDeleteButtonVisibility = () => {
        setShowDeleteButton(v => !v);
    };
    const handleDeleteSuccess = () => {
        Notification.show(`Marca eliminada: ${JSON.stringify({ nombre: nombre.value, estaActiva: estaActiva.value })}`);
        dialogOpened.value = false;
    };
    const createMarca = async () => {
        try {
            if (!nombre.value.trim()) {
                Notification.show('El campo Nombre es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await MarcaService.create(nombre.value, estaActiva.value);
            if (props.onMarcaCreated) props.onMarcaCreated();
            nombre.value = '';
            estaActiva.value = false;
            dialogOpened.value = false;
            Notification.show('Marca creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar la marca', { duration: 5000, position: 'top-center', theme: 'error' });
            handleError(error);
        }
    };
    return (
        <VerticalLayout>
            <HorizontalLayout theme="spacing">
                <ComboBox
                    label="Selecciona una marca de ejemplo para editar"
                    items={marcasEjemplo.map((m, idx) => ({ label: m.nombre, value: String(idx) }))}
                    value={String(marcasEjemplo.indexOf(marcaEjemploSeleccionada))}
                    onValueChanged={e => setMarcaEjemploSeleccionada(marcasEjemplo[Number(e.detail.value)])}
                    style={{ width: 200 }}
                />
                <Button onClick={handleEdit}>Editar Marca</Button>
                <Button onClick={handleCreate}>Crear nuevo</Button>
                <Button onClick={toggleDeleteButtonVisibility}>
                    {showDeleteButton ? 'Ocultar Eliminar' : 'Mostrar Eliminar'}
                </Button>
            </HorizontalLayout>
            <Dialog
                modeless
                headerTitle={editMode === 'edit' ? 'Editar Marca' : 'Nueva Marca'}
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        {showDeleteButton && editMode === 'edit' && (
                            <Button theme="error" onClick={handleDeleteSuccess}>Eliminar</Button>
                        )}
                        <Button onClick={createMarca} theme="primary">Registrar</Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField
                        label="Nombre"
                        placeholder="Ej: Toyota, Chevrolet, Nissan..."
                        value={nombre.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
                    />
                    <Checkbox
                        label="¿Está activa?"
                        checked={estaActiva.value}
                        onCheckedChanged={(evt: CustomEvent<{ value: boolean }>) => (estaActiva.value = evt.detail.value)}
                    />
                </VerticalLayout>
            </Dialog>
        </VerticalLayout>
    );
}

export default function MarcaView() {
    //kk

    const callData = () => {
        MarcaService.listMarca().then(function(data: any){
            console.log('DATA MARCA:', data); // <-- log temporal
            setItems((data ?? []).map((item: any, idx: number) => ({
                id: item.id ?? idx + 1,
                nombre: item.nombre ?? '',
                estaActiva: item.estaActiva ?? false
            })));
        });
    };
    
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        MarcaService.ordenar(columnId, dir).then(function (data: any) {
            console.log('DATA MARCA ORDEN:', data); // <-- log temporal
            setItems((data ?? []).map((item: any, idx: number) => ({
                id: item.id ?? idx + 1,
                nombre: item.nombre ?? '',
                estaActiva: item.estaActiva ?? false
            })));
        });
    }

    //kkk
    //   const dataProvider = useDataProvider<any>({
    //     list: async () => {
    //       const result = await MarcaService.listMarca();
    //       return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    //     },
    //   });

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }
    function numeroRenderer({ item }: { item: any }) {
        return <span>{item.id}</span>;
    }
    function activaRenderer({ item }: { item: any }) {
        return <span>{item.estaActiva ? 'Sí' : 'No'}</span>;
    }
    function activaBadgeRenderer({ item }: { item: any }) {
        let icon, title, theme;
        if (item.estaActiva) {
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

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Marcas">
                <Group>
                    <MarcaEntryForm onMarcaCreated={callData}/>
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={numeroRenderer} header="Numero" />
                <GridSortColumn path="nombre" header="Nombre" onDirectionChanged={(e) => order(e, 'nombre')} />
                <GridSortColumn path="estaActiva" header="¿Está activa?" renderer={activaBadgeRenderer} onDirectionChanged={(e) => order(e, 'estaActiva')} />
            </Grid>
        </main>
    );
}