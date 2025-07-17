import { useEffect, useState } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, DatePicker, TextField, VerticalLayout, GridSortColumn, HorizontalLayout, Select, Icon } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

export const config: ViewConfig = {
  title: 'Usuario',
  menu: {
    icon: 'vaadin:users',
    order: 2,
    title: 'Usuario',
  },
};

type UsuarioEntryFormProps = {
  onUsuarioCreated?: () => void;
};

type UsuarioEntryFormUpdateProps = {
  onUsuarioUpdated?: () => void;
};

function UsuarioEntryForm(props: UsuarioEntryFormProps) {
  const nickname = useSignal('');
  const nombre = useSignal('');
  const apellido = useSignal('');
  const cedula = useSignal('');
  const telefono = useSignal('');
  const cuenta = useSignal('');
  const rol = useSignal('');
  const dialogOpened = useSignal(false);

  const cuentas = useSignal<{ value: string, label: string }[]>([]);
  const roles = useSignal<{ value: string, label: string }[]>([]);

  useEffect(() => {
    UsuarioService.listaCuenta().then(data => {
      cuentas.value = (data ?? []).map((a: any) => ({
        value: a.value,
        label: a.label
      }));
    });
  }, []);

  useEffect(() => {
    UsuarioService.listaRol().then(data => {
      roles.value = (data ?? []).map((a: any) => ({
        value: a.value,
        label: a.label
      }));
    });
  }, []);

  const createUsuario = async () => {
    try {
      if (nickname.value && nombre.value && apellido.value && cedula.value && telefono.value && cuenta.value && rol.value) {
        const idCuenta = parseInt(cuenta.value);
        const idRol = parseInt(rol.value);

        await UsuarioService.create(nickname.value, nombre.value, apellido.value, cedula.value, telefono.value, idCuenta, idRol);
        if (props.onUsuarioCreated) props.onUsuarioCreated();
        nickname.value = '';
        nombre.value = '';
        apellido.value = '';
        cedula.value = '';
        telefono.value = '';
        cuenta.value = '';
        rol.value = '';
        dialogOpened.value = false;
        Notification.show('Usuario creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan o hay datos inválidos', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Usuario"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createUsuario} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField
            label="Nickname"
            value={nickname.value}
            minlength={8}
            maxlength={16}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nickname.value = evt.detail.value)}
          />
          <TextField
            label="Nombre"
            value={nombre.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
          />
          <TextField
            label="Apellido"
            value={apellido.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (apellido.value = evt.detail.value)}
          />
          <TextField
            label="Cedula"
            minlength={10}
            maxlength={10}
            value={cedula.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (cedula.value = evt.detail.value)}
          />
          <TextField
            label="Telefono"
            minlength={10}
            maxlength={10}
            value={telefono.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (telefono.value = evt.detail.value)}
          />
          <ComboBox
            label="Cuenta"
            items={cuentas.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={cuenta.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (cuenta.value = evt.detail.value)}
          />
          <ComboBox
            label="Rol"
            items={roles.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={rol.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (rol.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

function UsuarioEntryFormUpdate(props: UsuarioEntryFormUpdateProps) {
  const nickname = useSignal(props.arguments.nickname);
  const telefono = useSignal(props.arguments.telefono);
  const ident = useSignal(props.arguments.id);
  const dialogOpened = useSignal(false);

  const updateUsuario = async () => {
    try {
      if (nickname.value && telefono.value) {
        await UsuarioService.update(parseInt(ident.value), nickname.value, telefono.value);
        if (props.onUsuarioUpdated) props.onUsuarioUpdated();
        nickname.value = '';
        telefono.value = '';
        dialogOpened.value = false;
        Notification.show('Usuario creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan o hay datos inválidos', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Editar Usuario"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={updateUsuario} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField
            label="Nickname"
            value={nickname.value}
            minlength={8}
            maxlength={16}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nickname.value = evt.detail.value)}
          />
          <TextField
            label="Telefono"
            value={telefono.value}
            minlength={10}
            maxlength={10}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (telefono.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)} theme="tertiary-inline" style={{ 
        backgroundColor: '#FFA500', color: 'white',
        width: '32px', height: '32px', minWidth: '32px', 
        minHeight: '32px', padding: 0, display: 'flex', 
        alignItems: 'center', justifyContent: 'center' }}><Icon icon="vaadin:edit" /></Button>
    </>
  );
}

export default function UsuarioView() {
    
  const callData = () => {
        UsuarioService.listUsuario().then(function (data) {
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
        UsuarioService.ordenar(columnId, dir).then(function (data) {
            setItems(data);
        });
    }

  const criterio = useSignal('');
  const texto = useSignal('');
  const itemSelect = [
    {
      label: 'Nickname',
      value: 'nickname',
    },
    {
      label: 'Nombre',
      value: 'nombre',
    },{
      label: 'Apellido',
      value: 'apellido',
    },
    {
      label: 'Cedula',
      value: 'cedula',
    },
    {
      label: 'Telefono',
      value: 'telefono',
    },
    {
      label: 'cuenta',
      value: 'idCuenta',
    },
  ];

  const search = async () => {
    try {
      UsuarioService.buscar(criterio.value, texto.value, 0).then(function (data) {
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

  function indexLink({ item }: { item: Usuario }) {
        return (
            <span>
                <UsuarioEntryFormUpdate arguments={item}  onUsuarioUpdated={callData}>
                </UsuarioEntryFormUpdate>
            </span>
        );
    }

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Usuarios">
        <Group>
          <UsuarioEntryForm onUsuarioCreated={callData} />
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
        <GridSortColumn path="nickname" header="Nickname" onDirectionChanged={(e) => order(e, 'nickname')} />
        <GridSortColumn path="nombre" header="Nombre" onDirectionChanged={(e) => order(e, 'nombre')} />
        <GridSortColumn path="apellido" header="Apellido" onDirectionChanged={(e) => order(e, 'apellido')} />
        <GridSortColumn path="cedula" header="Cedula" onDirectionChanged={(e) => order(e, 'cedula')} />
        <GridSortColumn path="telefono" header="Telefono" onDirectionChanged={(e) => order(e, 'telefono')} />
        <GridSortColumn path="idCuenta" header="cuenta" onDirectionChanged={(e) => order(e, 'idCuenta')} />
        <GridColumn header="Acciones" renderer={indexLink} />
      </Grid>
    </main>
  );
}
