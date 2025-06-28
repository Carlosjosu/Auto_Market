<<<<<<< HEAD
// ...existing code...
=======
import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, GridSortColumn, NumberField, DatePicker, Select } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ValoracionService, VentaService, AutoService } from 'Frontend/generated/endpoints';
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
                    puntuacion.value!,
                    fecha.value, 
                    comentario.value,
                    idVenta.value!
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
            <Button>
            </Button>
        </>
    );
}

function ValoracionSearchForm(props: { onSearch: (atributo: string, valor: string) => void }) {
    const [atributo, setAtributo] = useState('id');
    const [valor, setValor] = useState('');

    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 0 }}>
            <Select
                style={{ minWidth: 180 }}
                value={atributo}
                onValueChanged={e => setAtributo(e.detail.value)}
                items={[
                    { label: 'Puntuación', value: 'puntuacion' },
                ]}
                placeholder="Seleccionar atributo"
            />
            <TextField
                style={{ minWidth: 220 }}
                placeholder="Ingrese valor a buscar..."
                value={valor}
                onValueChanged={e => setValor(e.detail.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') props.onSearch(atributo, valor);
                }}
            />
            <Button
                theme="primary"
                style={{
                    background: "#ffc107",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "8px 20px"
                }}
                onClick={() => props.onSearch(atributo, valor)}
            >
                Buscar
            </Button>
            <Button
                style={{
                    background: "#fff",
                    color: "#29ABE2",
                    border: "1px solid #29ABE2",
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: "8px 20px"
                }}
                onClick={() => { setValor(''); props.onSearch('', ''); }}
            >
                Limpiar
            </Button>
        </div>
    );
}

export default function ValoracionView() {
    const [items, setItems] = useState<any[]>([]);
    const [ventas, setVentas] = useState<any[]>([]);
    const [autos, setAutos] = useState<any[]>([]);

    // Cargar ventas y autos para poder mostrar marca/modelo
    useEffect(() => {
        VentaService.listVenta().then((data) => setVentas((data ?? []).filter(Boolean)));
        AutoService.listAuto().then((data) => setAutos((data ?? []).filter(Boolean)));
    }, []);

    const callData = () => {
        ValoracionService.listValoracion().then((data) => setItems((data ?? []).filter(Boolean)));
    };

    useEffect(() => {
        callData();
    }, []);

    const handleSearch = (atributo: string, valor: string) => {
        if (!atributo || valor === '') {
            callData();
            return;
        }
        ValoracionService.buscar(atributo, valor).then((data) => setItems((data ?? []).filter(Boolean)));
    };

    const order = (event: any, columnId: string) => {
        const direction = event.detail.value;
        var dir = (direction == 'asc') ? 1 : 2;
        ValoracionService.ordenar(columnId, dir).then((data) => setItems((data ?? []).filter(Boolean)));
    };

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    // Función para obtener marca y modelo desde idVenta
    const getMarcaModelo = (idVenta: number) => {
        const venta = ventas.find((v: any) => Number(v.id) === Number(idVenta));
        if (!venta) return '';
        const auto = autos.find((a: any) => Number(a.id) === Number(venta.idAuto));
        if (!auto) return '';
        return `${auto.marca ?? ''} ${auto.modelo ?? ''}`.trim();
    };

    return (
        <main style={{ background: "#f4faff", minHeight: "100vh", padding: "2rem" }}>
            <div style={{
                background: "#f8fbff",
                borderRadius: 12,
                padding: "1.5rem",
                marginBottom: 24,
                boxShadow: "0 2px 8px #0001",
                border: "1px solid #e0e7ef"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18
                }}>
                    <h2 style={{ color: "#29ABE2", fontWeight: 700, fontSize: 28, margin: 0 }}>Lista de Valoraciones</h2>
                    <ValoracionEntryForm onValoracionCreated={callData} />
                </div>
                <ValoracionSearchForm onSearch={handleSearch} />
            </div>
            <div style={{
                background: "#f8fbff",
                borderRadius: 12,
                padding: "1.5rem",
                boxShadow: "0 2px 8px #0001",
                border: "1px solid #e0e7ef"
            }}>
                <Grid items={items}>
                    <GridColumn renderer={indexIndex} header="N°" />
                    <GridSortColumn path="puntuacion" header="Puntuación" onDirectionChanged={(e) => order(e, 'puntuacion')} />
                    <GridSortColumn path="fecha" header="Fecha" onDirectionChanged={(e) => order(e, 'fecha')} />
                    <GridColumn
                        path="comentario"
                        header="Comentario"
                    />
                    <GridColumn
                        header="Auto valorado"
                        renderer={({ item }) => <span>{getMarcaModelo(item.idVenta)}</span>}
                    />
                </Grid>
            </div>
        </main>
    );
}
>>>>>>> origin/feature/Sebas-ModuloValoracion
