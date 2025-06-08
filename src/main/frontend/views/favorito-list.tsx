import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, VerticalLayout, Dialog, GridSortColumn, DatePicker, NumberField } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { FavoritoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Favorito',
    menu: {
        icon: 'vaadin:star',
        order: 1,
        title: 'Favorito',
    },
};

type FavoritoEntryFormProps = {
    onFavoritoCreated?: () => void;
};
function FavoritoEntryForm(props: FavoritoEntryFormProps) {
    const fechaGuardado = useSignal<string>('');
    const idAuto = useSignal<number | undefined>(undefined);
    const idUsuario = useSignal<number | undefined>(undefined);

    const dialogOpened = useSignal(false);

    const createFavorito = async () => {
        try {
            if (
                fechaGuardado.value &&
                idAuto.value !== undefined &&
                idUsuario.value !== undefined
            ) {
                await FavoritoService.create(
                    fechaGuardado.value,
                    idAuto.value,
                    idUsuario.value
                );
                if (props.onFavoritoCreated) props.onFavoritoCreated();
                fechaGuardado.value = '';
                idAuto.value = undefined;
                idUsuario.value = undefined;
                dialogOpened.value = false;
                Notification.show('Favorito creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
                headerTitle="Nuevo Favorito"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createFavorito} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <DatePicker
                        label="Fecha Guardado"
                        value={fechaGuardado.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (fechaGuardado.value = evt.detail.value)}
                        required
                    />
                    <NumberField
                        label="ID Auto"
                        value={idAuto.value !== undefined ? String(idAuto.value) : ''}
                        onValueChanged={(e) => {
                            const val = e.detail.value;
                            idAuto.value = val !== '' ? Number(val) : undefined;
                        }}
                        min={1}
                        required
                    />
                    <NumberField
                        label="ID Usuario"
                        value={idUsuario.value !== undefined ? String(idUsuario.value) : ''}
                        onValueChanged={(e) => {
                            const val = e.detail.value;
                            idUsuario.value = val !== '' ? Number(val) : undefined;
                        }}
                        min={1}
                        required
                    />
                </VerticalLayout>
            </Dialog>
            <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
        </>
    );
}

export default function FavoritoView() {
    const [items, setItems] = useState<any[]>([]);

    const callData = () => {
        FavoritoService.listFavorito().then(function(data){
            setItems(data);
        });
    };
    
    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        <FavoritoService className="ordenar"></FavoritoService>.then(function (data) {
            setItems(data);
        });
    };

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Favoritos">
                <Group>
                    <FavoritoEntryForm onFavoritoCreated={callData}/>
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="N°" />
                <GridSortColumn path="id" header="ID" onDirectionChanged={(e) => order(e, 'id')} />
                <GridSortColumn path="fechaGuardado" header="Fecha Guardado" onDirectionChanged={(e) => order(e, 'fechaGuardado')} />
                <GridSortColumn path="idAuto" header="ID Auto" onDirectionChanged={(e) => order(e, 'idAuto')} />
                <GridSortColumn path="idUsuario" header="ID Usuario" onDirectionChanged={(e) => order(e, 'idUsuario')} />
            </Grid>
        </main>
    );
}