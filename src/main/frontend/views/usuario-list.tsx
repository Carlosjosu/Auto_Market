import { useEffect } from 'react';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Grid, GridColumn, TextField, VerticalLayout, Dialog, PasswordField } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { UsuarioService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import type { GridItemModel } from '@vaadin/react-components';
import { Email } from '@vaadin/hilla-lit-form';

export const config: ViewConfig = {
  title: 'Usuario',
  menu: {
    icon: 'vaadin:user',
    order: 1,
    title: 'Usuario',
  },
};

type UsuarioEntryFormProps = {
  onUsuarioCreated?: () => void;
};
function UsuarioEntryForm(props: UsuarioEntryFormProps) {
  const nombre = useSignal('');
  const correo = useSignal('');
  const contrasenia = useSignal('');
  const telefono = useSignal('');

  const dialogOpened = useSignal(false);

  const createUsuario = async () => {
    try {
      if (nombre.value.trim() && correo.value.trim() && contrasenia.value.trim() && telefono.value.trim()) {
        await UsuarioService.create(nombre.value, correo.value, contrasenia.value, telefono.value, );
        if (props.onUsuarioCreated) props.onUsuarioCreated();
        nombre.value = '';
        correo.value = '';
        contrasenia.value = '';
        telefono.value = '';
        dialogOpened.value = false;
        Notification.show('Usuario creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
        headerTitle="Nuevo usuario"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createUsuario} theme="primary">
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
          <Emailf
            label="Correo"
            value={correo.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (correo.value = evt.detail.value)}
          />
          <PasswordField
            label="Contrasena"
            value={contrasenia.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (contrasenia.value = evt.detail.value)}
          />
          <TextField
            label="Teléfono"
            value={telefono.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (telefono.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function UsuarioView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await UsuarioService.listUsuario();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de usuarios">
        <Group>
          <UsuarioEntryForm onUsuarioCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="nombre" header="Nombre" />
        <GridColumn path="correo" header="Correo" />
        <GridColumn path="contrasenia" header="Contrasena" />
        <GridColumn path="telefono" header="Teléfono" />
        <GridColumn path="esAdministrador" header="Administrador" />
      </Grid>
    </main>
  );
}
