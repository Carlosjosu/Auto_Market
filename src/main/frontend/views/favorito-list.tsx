import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, GridItemModel, DatePicker, ComboBox, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { FavoritoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

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
  const usuario = useSignal('');
  const publicacion = useSignal('');
  const fechaMarcado = useSignal('');
  const dialogOpened = useSignal(false);

  const usuarios = useSignal<{ value: string, label: string }[]>([]);
  const publicaciones = useSignal<{ value: string, label: string }[]>([]);

  useEffect(() => {
    FavoritoService.listaUsuario().then(data => {
      usuarios.value = (data ?? []).map((u: any) => ({
        value: u.value,
        label: u.label
      }));
    });
    FavoritoService.listaPublicacion().then(data => {
      publicaciones.value = (data ?? []).map((p: any) => ({
        value: p.value,
        label: p.label
      }));
    });
  }, []);

  const createFavorito = async () => {
    try {
      if (usuario.value && publicacion.value && fechaMarcado.value) {
        const idUsuario = parseInt(usuario.value) + 1;
        const idPublicacion = parseInt(publicacion.value) + 1;
        await FavoritoService.create(
          fechaMarcado.value,
            idUsuario,
            idPublicacion
        );
        if (props.onFavoritoCreated) props.onFavoritoCreated();
        usuario.value = '';
        publicacion.value = '';
        fechaMarcado.value = '';
        dialogOpened.value = false;
        Notification.show('Favorito creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo favorito"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createFavorito} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <ComboBox
            label="Usuario"
            items={usuarios.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={usuario.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (usuario.value = evt.detail.value)}
          />
          <ComboBox
            label="Publicación"
            items={publicaciones.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={publicacion.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (publicacion.value = evt.detail.value)}
          />
          <DatePicker
            label="Fecha marcado"
            value={fechaMarcado.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (fechaMarcado.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function FavoritoView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await FavoritoService.listFavorito();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de favoritos">
        <Group>
          <FavoritoEntryForm onFavoritoCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="Usuario" header="Usuario" />
        <GridColumn path="Publicacion" header="Publicación" />
        <GridColumn path="fechaMarcado" header="Fecha marcado" />
      </Grid>
    </main>
  );
}