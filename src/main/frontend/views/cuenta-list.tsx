import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, EmailField, VerticalLayout, Dialog, GridSortColumn, HorizontalLayout, Select, Icon } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { CuentaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import type { GridItemModel } from '@vaadin/react-components';
import { useAuth, role } from 'Frontend/security/auth';
import { useNavigate } from 'react-router';

export const config: ViewConfig = {
    title: 'Cuenta',
    menu: {
        icon: 'vaadin:wallet',
        order: 1,
        title: 'Cuenta',
    },
};

type CuentaEntryFormProps = {
    onCuentaCreated?: () => void;
};

type CuentaEntryFormUpdateProps = {
    onCuentaUpdated?: () => void;
};

function CuentaEntryForm(props: CuentaEntryFormProps) {
    const correo = useSignal('');
    const clave = useSignal('');
    const dialogOpened = useSignal(false);

    const createCuenta = async () => {
        try {
            if (correo.value.trim() && clave.value.trim()) {
                await CuentaService.create(correo.value, clave.value);
                if (props.onCuentaCreated) props.onCuentaCreated();
                correo.value = '';
                clave.value = '';
                dialogOpened.value = false;
                Notification.show('Cuenta creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
                headerTitle="Nueva Cuenta"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={createCuenta} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <EmailField
                        label="Correo"
                        value={correo.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (correo.value = evt.detail.value)}
                    />
                    <TextField
                        label="clave"
                        value={clave.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (clave.value = evt.detail.value)}
                    />
                </VerticalLayout>
            </Dialog>
            <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
        </>
    );
}

function CuentaEntryFormUpdate(props: CuentaEntryFormUpdateProps) {
    const correo = useSignal(props.arguments.correo);
    const clave = useSignal('');
    const ident = useSignal(props.arguments.id);
    const dialogOpened = useSignal(false);

    const updateCuenta = async () => {
        try {
            if (clave.value.trim()) {
                await CuentaService.update(parseInt(ident.value), clave.value);
                if (props.onCuentaUpdated) props.onCuentaUpdated();
                correo.value = '';
                clave.value = '';
                dialogOpened.value = false;
                Notification.show('Cuenta modificada', { duration: 5000, position: 'bottom-end', theme: 'success' });
            } else {
                Notification.show('No se pudo modificar, faltan o hay datos inválidos', {
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
                headerTitle="Editar Cuenta"
                opened={dialogOpened.value}
                onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
                    dialogOpened.value = detail.value;
                }}
                footer={
                    <>
                        <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
                        <Button onClick={updateCuenta} theme="primary">
                            Registrar
                        </Button>
                    </>
                }>
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <EmailField
                        label="Correo"
                        value={correo.value}
                        readonly
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (correo.value = evt.detail.value)}
                    />
                    <TextField
                        label="clave"
                        value={clave.value}
                        onValueChanged={(evt: CustomEvent<{ value: string }>) => (clave.value = evt.detail.value)}
                    />
                </VerticalLayout>
            </Dialog>
            <Button onClick={() => (dialogOpened.value = true)} theme="tertiary-inline" style={{
                backgroundColor: '#FFA500', color: 'white',
                width: '32px', height: '32px', minWidth: '32px',
                minHeight: '32px', padding: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            }}><Icon icon="vaadin:edit" /></Button>
        </>
    );
}

export default function CuentaView() {

    const { state } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state.user) {
            navigate('/login?error=true');
            return;
        }
        role().then((rolResponse) => {
            if (rolResponse?.rol !== 'ROLE_admin') {
                Notification.show('No tiene permisos para acceder a esta página', { theme: 'error' });
                navigate('/');
            }
        });
    }, [state.user, navigate]);

    const callData = () => {
        CuentaService.listCuenta().then(function (data) {
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
        CuentaService.ordenar(columnId, dir).then(function (data) {
            setItems(data);
        });
    }

    const criterio = useSignal('');
    const texto = useSignal('');
    const itemSelect = [
        {
            label: 'Correo',
            value: 'correo',
        },
        {
            label: 'Rol',
            value: 'idRol',
        },
    ];

    const search = async () => {
        try {
            CuentaService.buscar(criterio.value, texto.value, 0).then(function (data) {
                setItems(data);
            });

            criterio.value = '';
            texto.value = '';

            Notification.show('Busqueda realizada', { duration: 5000, position: 'bottom-end', theme: 'success' });


        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    function indexLink({ item }: { item: Cuenta }) {
        return (
            <span>
                <CuentaEntryFormUpdate arguments={item} onCuentaUpdated={callData}>
                </CuentaEntryFormUpdate>
            </span>
        );
    }

    function indexIndex({ model }: { model: GridItemModel<any> }) {
        return <span>{model.index + 1}</span>;
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Lista de Cuentas">
                <Group>
                    <CuentaEntryForm onCuentaCreated={callData} />
                </Group>
            </ViewToolbar>
            <HorizontalLayout theme="spacing">
                <Select items={itemSelect}
                    value={criterio.value}
                    onValueChanged={(evt) => (criterio.value = evt.detail.value)}
                    placeholder="Selecione un criterio">
                </Select>
                <TextField
                    placeholder="Search"
                    style={{ width: '50%' }}
                    value={texto.value}
                    onValueChanged={(evt) => (texto.value = evt.detail.value)}
                >
                    <Icon slot="prefix" icon="vaadin:search" />
                </TextField>
                <Button onClick={search} theme="primary">
                    BUSCAR
                </Button>
            </HorizontalLayout>
            <Grid items={items}>
                <GridColumn renderer={indexIndex} header="Numero" />
                <GridSortColumn path="correo" header="Correo" onDirectionChanged={(e) => order(e, 'nombre')} />
                <GridSortColumn path="idRol" header="Rol" onDirectionChanged={(e) => order(e, 'idRol')} />
                <GridColumn header="Acciones" renderer={indexLink} />
            </Grid>
        </main>
    );
}