import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, Checkbox } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { MarcaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Marca',
    menu: {
        icon: 'vaadin:tag',
        order: 3,
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

    const createMarca = async () => {
        try {
            if (nombre.value.trim()) {
                await MarcaService.create(nombre.value, estaActiva.value);
                if (props.onMarcaCreated) props.onMarcaCreated();
                nombre.value = '';
                estaActiva.value = false;
                dialogOpened.value = false;
                Notification.show('Marca creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
                headerTitle="Nuevo Marca"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createMarca} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <TextField
                        label="Nombre"
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
            <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
        </>
    );
}

export default function MarcaView() {

    const callData = () => {
        MarcaService.listMarca().then(function(data){
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
        MarcaService.ordenar(columnId, dir).then(function (data) {
            setItems(data);
        });
    }

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Marcas">
                <Group>
                    <MarcaEntryForm onMarcaCreated={callData}/>
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="Numero" />
                <GridSortColumn path="nombre" header="Nombre" onDirectionChanged={(e) => order(e, 'nombre')} />
                <GridSortColumn path="estaActiva" header="¿Está activa?" onDirectionChanged={(e) => order(e, 'estaActiva')} />
            </Grid>
        </main>
    );
}