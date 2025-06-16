import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, NumberField, DatePicker } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ValoracionService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Valoracion',
    menu: {
        icon: 'vaadin:comments',
        order: 1,
        title: 'Valoracion',
    },
};

type ValoracionEntryFormProps = {
    onValoracionCreated?: () => void;
};
function ValoracionEntryForm(props: ValoracionEntryFormProps) {
    const puntuacion = useSignal<number | undefined>(undefined);
    const fecha = useSignal<string>('');
    const comentario = useSignal<string>('');
    const idVenta = useSignal<number | undefined>(undefined);

    const dialogOpened = useSignal(false);

    const createValoracion = async () => {
        try {
            if (
                puntuacion.value !== undefined &&
                fecha.value &&
                comentario.value.trim() &&
                idVenta.value !== undefined
            ) {
                await ValoracionService.create(
                    puntuacion.value,
                    fecha.value,
                    comentario.value,
                    idVenta.value
                );
                if (props.onValoracionCreated) props.onValoracionCreated();
                puntuacion.value = undefined;
                fecha.value = '';
                comentario.value = '';
                idVenta.value = undefined;
                dialogOpened.value = false;
                Notification.show('Valoración creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
                headerTitle="Nueva Valoración"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createValoracion} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <NumberField
                        label="Puntuación"
                        value={puntuacion.value !== undefined ? String(puntuacion.value) : ''}
                        onValueChanged={e => {
                            const val = e.detail.value;
                            puntuacion.value = val !== '' ? Number(val) : undefined;
                        }}
                        min={1}
                        max={5}
                        required
                    />
                    <DatePicker
                        label="Fecha"
                        value={fecha.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (fecha.value = evt.detail.value)}
                        required
                    />
                    <TextField
                        label="Comentario"
                        value={comentario.value}
                        onValueChanged={e => (comentario.value = e.detail.value)}
                        required
                    />
                    <NumberField
                        label="ID Venta"
                        value={idVenta.value !== undefined ? String(idVenta.value) : ''}
                        onValueChanged={e => {
                            const val = e.detail.value;
                            idVenta.value = val !== '' ? Number(val) : undefined;
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

export default function ValoracionView() {
    const [items, setItems] = useState<any[]>([]);

    const callData = () => {
        ValoracionService.listValoracion().then(function (data) {
            setItems((data ?? []).filter(Boolean));
        });
    };

    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        ValoracionService.ordenar(columnId, dir).then(function (data) {
            setItems((data ?? []).filter(Boolean));
        });
    }

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Valoraciones">
                <Group>
                    <ValoracionEntryForm onValoracionCreated={callData} />
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="N°" />
                <GridSortColumn path="id" header="ID" onDirectionChanged={(e) => order(e, 'id')} />
                <GridSortColumn path="puntuacion" header="Puntuación" onDirectionChanged={(e) => order(e, 'puntuacion')} />
                <GridSortColumn path="fecha" header="Fecha" onDirectionChanged={(e) => order(e, 'fecha')} />
                <GridSortColumn path="comentario" header="Comentario" onDirectionChanged={(e) => order(e, 'comentario')} />
                <GridSortColumn path="idVenta" header="ID Venta" onDirectionChanged={(e) => order(e, 'idVenta')} />
            </Grid>
        </main>
    );
}