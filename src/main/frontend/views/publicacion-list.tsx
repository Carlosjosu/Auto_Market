import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, DatePicker, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { PublicacionService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Publicación',
  menu: {
    icon: 'vaadin:book',
    order: 1,
    title: 'Publicación',
  },
};

type PublicacionEntryFormProps = {
  onPublicacionCreated?: () => void;
};

function PublicacionEntryForm(props: PublicacionEntryFormProps) {
  const fechaPublicacion = useSignal('');
  const titulo = useSignal('');
  const descripcion = useSignal('');
  const estado = useSignal('');
  const auto = useSignal('');
  const vendedor = useSignal('');
  const dialogOpened = useSignal(false);

  const autos = useSignal<{ value: string, label: string }[]>([]);
  const vendedores = useSignal<{ value: string, label: string }[]>([]);
  const estados = useSignal<string[]>([]);

  useEffect(() => {
    PublicacionService.listaAuto().then(data => {
      autos.value = (data ?? []).map((a: any) => ({
        value: a.value,
        label: a.label
      }));
    });
    PublicacionService.listaVendedor().then(data => {
      vendedores.value = (data ?? []).map((v: any) => ({
        value: v.value,
        label: v.label
      }));
    });
    PublicacionService.listEstado().then(data => {
      estados.value = (data ?? []).filter((e): e is string => typeof e === 'string');
    });
  }, []);

  const createPublicacion = async () => {
    try {
      if (
        fechaPublicacion.value &&
        titulo.value.trim() &&
        descripcion.value.trim() &&
        estado.value &&
        auto.value &&
        vendedor.value
      ) {
        const idAuto = parseInt(auto.value)+1;
        const idVendedor = parseInt(vendedor.value)+1;
        await PublicacionService.create(
          fechaPublicacion.value,
          titulo.value,
          descripcion.value,
          estado.value,
          idAuto,
          idVendedor
        );
        if (props.onPublicacionCreated) props.onPublicacionCreated();
        fechaPublicacion.value = '';
        titulo.value = '';
        descripcion.value = '';
        estado.value = '';
        auto.value = '';
        vendedor.value = '';
        dialogOpened.value = false;
        Notification.show('Publicación creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
        headerTitle="Nueva publicación"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createPublicacion} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <DatePicker
            label="Fecha de publicación"
            value={fechaPublicacion.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (fechaPublicacion.value = evt.detail.value)}
          />
          <TextField
            label="Título"
            value={titulo.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (titulo.value = evt.detail.value)}
          />
          <TextField
            label="Descripción"
            value={descripcion.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (descripcion.value = evt.detail.value)}
          />
          <ComboBox
            label="Estado"
            items={estados.value}
            value={estado.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (estado.value = evt.detail.value)}
          />
          <ComboBox
            label="Auto"
            items={autos.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={auto.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (auto.value = evt.detail.value)}
          />
          <ComboBox
            label="Vendedor"
            items={vendedores.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={vendedor.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (vendedor.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function PublicacionView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await PublicacionService.listPublicacion();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de publicaciones">
        <Group>
          <PublicacionEntryForm onPublicacionCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="fechaPublicacion" header="Fecha publicación" />
        <GridColumn path="titulo" header="Título" />
        <GridColumn path="descripcion" header="Descripción" />
        <GridColumn path="estado" header="Estado" />
        <GridColumn path="auto" header="Auto" />
        <GridColumn path="vendedor" header="Vendedor" />
      </Grid>
    </main>
  );
}