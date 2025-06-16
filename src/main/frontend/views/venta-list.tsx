import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, DatePicker, NumberField } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { VentaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';

export const config: ViewConfig = {
    title: 'Venta',
    menu: {
        icon: 'vaadin:cart',
        order: 1,
        title: 'Venta',
    },
};

type VentaEntryFormProps = {
    onVentaCreated?: () => void;
};
function VentaEntryForm(props: VentaEntryFormProps) {
    const precioFinal = useSignal<number | undefined>(undefined);
    const fecha = useSignal<string>('');
    const idAuto = useSignal<number | undefined>(undefined);
    const idComprador = useSignal<number | undefined>(undefined);

    const dialogOpened = useSignal(false);

    const createVenta = async () => {
        try {
            if (
                precioFinal.value !== undefined &&
                fecha.value &&
                idAuto.value !== undefined &&
                idComprador.value !== undefined
            ) {
                await VentaService.create(
                    precioFinal.value,
                    fecha.value,
                    idAuto.value,
                    idComprador.value
                );
                if (props.onVentaCreated) props.onVentaCreated();
                precioFinal.value = undefined;
                fecha.value = '';
                idAuto.value = undefined;
                idComprador.value = undefined;
                dialogOpened.value = false;
                Notification.show('Venta creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
                headerTitle="Nueva Venta"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createVenta} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <NumberField
                        label="Precio Final"
                        value={precioFinal.value !== undefined ? String(precioFinal.value) : undefined}
                        onValueChanged={(e) => {
                            const val = e.detail.value;
                            precioFinal.value = val !== '' && val !== undefined ? Number(val) : undefined;
                        }}
                        min={0}
                        step={0.01}
                        required
                    />
                    <DatePicker
                        label="Fecha"
                        value={fecha.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (fecha.value = evt.detail.value)}
                        required
                    />
                    <NumberField
                        label="ID Auto"
                        value={idAuto.value !== undefined ? String(idAuto.value) : undefined}
                        onValueChanged={(e) => {
                            const val = e.detail.value;
                            idAuto.value = val !== '' && val !== undefined ? Number(val) : undefined;
                        }}
                        min={1}
                        required
                    />
                    <NumberField
                        label="ID Comprador"
                        value={idComprador.value !== undefined ? String(idComprador.value) : undefined}
                        onValueChanged={(e) => {
                            const val = e.detail.value;
                            idComprador.value = val !== '' && val !== undefined ? Number(val) : undefined;
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

export default function VentaView() {
    const [items, setItems] = useState<any[]>([]);

    const callData = () => {
        VentaService.listVenta().then(function (data) {
            setItems((data ?? []).filter(Boolean));
        });
    };

    useEffect(() => {
        callData();
    }, []);

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = direction === 'asc' ? 1 : 2;
        VentaService.ordenar(columnId, dir).then(function (data) {
            setItems((data ?? []).filter(Boolean));
        });
    };

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Ventas">
                <Group>
                    <VentaEntryForm onVentaCreated={callData} />
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="N°" />
                <GridSortColumn path="id" header="ID" onDirectionChanged={(e) => order(e, 'id')} />
                <GridSortColumn path="precioFinal" header="Precio Final" onDirectionChanged={(e) => order(e, 'precioFinal')} />
                <GridSortColumn path="fecha" header="Fecha" onDirectionChanged={(e) => order(e, 'fecha')} />
                <GridSortColumn path="idAuto" header="ID Auto" onDirectionChanged={(e) => order(e, 'idAuto')} />
                <GridSortColumn path="idComprador" header="ID Comprador" onDirectionChanged={(e) => order(e, 'idComprador')} />
            </Grid>
        </main>
    );
}