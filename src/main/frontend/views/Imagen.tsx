import { useEffect, useState } from 'react';
import { Button, Grid, GridColumn, GridSortColumn, TextField, VerticalLayout, Dialog, ComboBox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ImagenService, AutoService } from 'Frontend/generated/endpoints';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';
import { TextArea } from '@vaadin/react-components/TextArea';
import { useSignal } from '@vaadin/hilla-react-signals';
import { HorizontalLayout } from '@vaadin/react-components/HorizontalLayout';

interface ImagenItem {
  url: string;
  descripcion: string;
  idAuto: number;
}

export const config = {
    title: 'Imagen',
    menu: {
        icon: 'lumo:photo',
        order: 3,
        title: 'Imagen',
    },
};

function ImagenEntryForm({ onImagenCreated }: { onImagenCreated?: () => void }) {
    const [autos, setAutos] = useState<{ id: number, modelo: string, matricula: string }[]>([]);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [editMode, setEditMode] = useState<'edit' | 'create'>('create');

    const [url, setUrl] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idAuto, setIdAuto] = useState('');
    const exampleItem: ImagenItem = {
        url: 'https://ejemplo.com/auto.jpg',
        descripcion: 'Foto lateral del auto',
        idAuto: 1
    };


    const imagenesEjemplo: ImagenItem[] = [
        { url: 'https://ejemplo.com/auto1.jpg', descripcion: 'Foto lateral del auto rojo', idAuto: 1 },
        { url: 'https://ejemplo.com/auto2.jpg', descripcion: 'Foto frontal del auto azul', idAuto: 2 }
    ];
    const [imagenEjemploSeleccionada, setImagenEjemploSeleccionada] = useState(imagenesEjemplo[0]);

    useEffect(() => {
        AutoService.listAuto().then((data: any) => {
            setAutos((data ?? []).filter(Boolean).map((a: any) => ({
                id: Number(a.id ?? a.idAuto ?? a.id_auto ?? 0),
                modelo: a.modelo ?? '',
                matricula: a.matricula ?? ''
            })));
        });
    }, []);

    const handleEdit = () => {
        setUrl(imagenEjemploSeleccionada.url);
        setDescripcion(imagenEjemploSeleccionada.descripcion);
        setIdAuto(String(imagenEjemploSeleccionada.idAuto));
        setEditMode('edit');
        setDialogOpened(true);
    };

    const handleCreate = () => {
        setUrl('');
        setDescripcion('');
        setIdAuto('');
        setEditMode('create');
        setDialogOpened(true);
    };

    const toggleDeleteButtonVisibility = () => {
        setShowDeleteButton(v => !v);
    };

    const handleDeleteSuccess = () => {
        Notification.show(`Imagen eliminada: ${JSON.stringify({ url, descripcion, idAuto })}`);
        setDialogOpened(false);
    };

    const handleSave = async () => {
        try {
            if (!url.trim()) {
                Notification.show('El campo URL es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            if (!descripcion.trim()) {
                Notification.show('El campo Descripción es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            const idAutoNum = Number(idAuto);
            if (!idAuto || isNaN(idAutoNum) || idAutoNum <= 0) {
                Notification.show('El campo ID Auto es obligatorio y debe ser un número válido', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await ImagenService.create(url, descripcion, idAutoNum);
            if (onImagenCreated) onImagenCreated();
            setUrl('');
            setDescripcion('');
            setIdAuto('');
            setDialogOpened(false);
            Notification.show('Imagen creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar la imagen', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    return (
        <VerticalLayout>
            <HorizontalLayout theme="spacing">
                <ComboBox
                    label="Selecciona una imagen de ejemplo para editar"
                    items={imagenesEjemplo.map((img, idx) => ({ label: img.descripcion, value: String(idx) }))}
                    value={String(imagenesEjemplo.indexOf(imagenEjemploSeleccionada))}
                    onValueChanged={e => setImagenEjemploSeleccionada(imagenesEjemplo[Number(e.detail.value)])}
                    style={{ width: 200 }}
                />
                <Button onClick={handleEdit}>Editar Imagen</Button>
                <Button onClick={handleCreate}>Crear nueva</Button>
                <Button onClick={toggleDeleteButtonVisibility}>
                    {showDeleteButton ? 'Ocultar Eliminar' : 'Mostrar Eliminar'}
                </Button>
            </HorizontalLayout>
            <Dialog
                modeless
                headerTitle={editMode === 'edit' ? 'Editar Imagen' : 'Nueva Imagen'}
                opened={dialogOpened}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => setDialogOpened(detail.value)}
                footer={
                    <>
                        <Button onClick={() => setDialogOpened(false)}>Cancelar</Button>
                        {showDeleteButton && editMode === 'edit' && (
                            <Button theme="error" onClick={handleDeleteSuccess}>Eliminar</Button>
                        )}
                        <Button onClick={handleSave} theme="primary">Registrar</Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField label="URL" value={url} placeholder="Ej: https://ejemplo.com/auto.jpg" onValueChanged={e => setUrl(e.detail.value)} />
                    <TextArea
                      label="Descripción"
                      value={descripcion}
                      style={{ width: '100%', minHeight: '100px', maxHeight: '150px' }}
                      onValueChanged={e => setDescripcion(e.detail.value)}
                    />
                    <ComboBox
                        label="Auto"
                        items={autos.map(a => ({ label: `${a.modelo} (${a.matricula})`, value: String(a.id) }))}
                        value={idAuto}
                        placeholder="Seleccione un auto"
                        onValueChanged={e => setIdAuto(e.detail.value)}
                    />
                </VerticalLayout>
            </Dialog>
        </VerticalLayout>
    );
}

export default function ImagenView() {
    const [items, setItems] = useState<ImagenItem[]>([]);
    const [autos, setAutos] = useState<{ id: number, modelo: string, matricula: string }[]>([]);

    const callData = () => {
        ImagenService.listImagen()
            .then(data => setItems(
                (data ?? [])
                    .filter(Boolean)
                    .map((item: any) => ({
                        url: item.url ?? '',
                        descripcion: item.descripcion ?? '',
                        idAuto: Number(item.idAuto) || 0
                    }))
            ))
            .catch(() => Notification.show('Error al cargar imágenes', { duration: 5000, position: 'top-center', theme: 'error' }));
    };

    useEffect(() => {
        callData();
        AutoService.listAuto().then((data: any) => {
            setAutos((data ?? []).filter(Boolean).map((a: any) => ({
                id: Number(a.id ?? a.idAuto ?? a.id_auto ?? 0),
                modelo: a.modelo ?? '',
                matricula: a.matricula ?? ''
            })));
        });
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        ImagenService.ordenar(columnId, dir)
            .then(data => setItems(
                (data ?? [])
                    .filter(Boolean)
                    .map((item: any) => ({
                        url: item.url ?? '',
                        descripcion: item.descripcion ?? '',
                        idAuto: Number(item.idAuto) || 0
                    }))
            ))
            .catch(() => Notification.show('Error al ordenar', { duration: 5000, position: 'top-center', theme: 'error' }));
    };

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Imágenes">
                <Group>
                    <ImagenEntryForm onImagenCreated={callData} />
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="Numero" />
                <GridSortColumn path="url" header="URL" onDirectionChanged={e => order(e, 'url')} />
                <GridSortColumn path="descripcion" header="Descripción" onDirectionChanged={e => order(e, 'descripcion')} />
                <GridColumn
                    header="Auto"
                    renderer={({ item }) => {
                        const auto = autos.find(a => a.id === item.idAuto);
                        return <span>{auto ? `${auto.modelo} (${auto.matricula})` : item.idAuto}</span>;
                    }}
                />
            </Grid>
        </main>
    );
}