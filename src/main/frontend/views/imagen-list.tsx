import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, GridItemModel, ComboBox, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ImagenService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Imagen',
  menu: {
    icon: 'vaadin:picture',
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
  const auto = useSignal('');
  const dialogOpened = useSignal(false);

  const autos = useSignal<{ value: string, label: string }[]>([]);

  useEffect(() => {
    ImagenService.listaAuto().then(data => {
      autos.value = (data ?? []).map((a: any) => ({
        value: a.value,
        label: a.label
      }));
    });
  }, []);

  const createImagen = async () => {
    try {
      if ( url.value.trim() && descripcion.value.trim() && auto.value) {
        const idAuto = parseInt(auto.value)+1;
        await ImagenService.create( url.value, descripcion.value, idAuto);
        if (props.onImagenCreated) props.onImagenCreated();
        url.value = '';
        descripcion.value = '';
        auto.value = '';
        dialogOpened.value = false;
        Notification.show('Imagen creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
        headerTitle="Nueva imagen"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createImagen} theme="primary">Registrar</Button>
          </>
        }
      >
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
          <ComboBox
            label="Auto"
            items={autos.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={auto.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (auto.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function ImagenView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await ImagenService.listImagen();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de imágenes">
        <Group>
          <ImagenEntryForm onImagenCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="url" header="URL" />
        <GridColumn path="descripcion" header="Descripción" />
        <GridColumn path="auto" header="Auto" />
      </Grid>
    </main>
  );
}