import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ImagenService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Imagen',
    menu: {
        icon: 'vaadin:tag',
        order: 1,
        title: 'Imagen',
    },
};

type ImagenEntryFormProps = {
    onImagenCreated?: () => void;
};
function ImagenEntryForm(props: ImagenEntryFormProps) {
    const url = useSignal('');
    const descripcion = useSignal('');
    const idAuto = useSignal(0);
    const dialogOpened = useSignal(false);

    const createImagen = async () => {
        try {
            if (url.value.trim() && descripcion.value.trim() && idAuto.value) {
                await ImagenService.create(url.value, descripcion.value, idAuto.value);
                if (props.onImagenCreated) props.onImagenCreated();
                url.value = '';
                descripcion.value = '';
                idAuto.value = 0;
                dialogOpened.value = false;
                Notification.show('Imagen creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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

    return (
        <>
            <Dialog
                modeless
                headerTitle="Nueva Imagen"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createImagen} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField
                        label="URL"
                        value={url.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (url.value = evt.detail.value)}
                    />
                    <TextField
                        label="Descripción"
                        value={descripcion.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (descripcion.value = evt.detail.value)}
                    />
                    <TextField
                        label="ID Auto"
                        type="number"
                        value={idAuto.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (idAuto.value = Number(evt.detail.value))}
                    />
                </VerticalLayout>
            </Dialog>
            <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
        </>
    );
}

export default function ImagenView() {
    //kk

    const callData = () => {
        ImagenService.listImagen().then(function(data){
            setItems(data);
        });
    };
    
    const [items, setItems] = useState([]);
    useEffect(() => {
        callData();
    }, []);

    const order = (event, columnId) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        ImagenService.ordenar(columnId, dir).then(function (data) {
            setItems(data);
        });
    }

    //kkk
    //   const dataProvider = useDataProvider<any>({
    //     list: async () => {
    //       const result = await ImagenService.listImagen();
    //       return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    //     },
    //   });

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Imagens">
                <Group>
                    <ImagenEntryForm onImagenCreated={callData}/>
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="Numero" />
                <GridSortColumn path="url" header="URL" onDirectionChanged={(e) => order(e, 'url')} />
                <GridSortColumn path="descripcion" header="Descripción" onDirectionChanged={(e) => order(e, 'descripcion')} />
                <GridSortColumn path="idAuto" header="ID Auto" onDirectionChanged={(e) => order(e, 'idAuto')} />
            </Grid>
        </main>
    );
}