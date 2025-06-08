import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, NumberField, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { AutoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Auto',
  menu: {
    icon: 'vaadin:car',
    order: 1,
    title: 'Auto',
  },
};

type AutoEntryFormProps = {
  onAutoCreated?: () => void;
};

function AutoEntryForm(props: AutoEntryFormProps) {
  const marca = useSignal('');
  const anio = useSignal('');
  const precio = useSignal('');
  const kilometraje = useSignal('');
  const color = useSignal('');
  const matricula = useSignal('');
  const categoria = useSignal('');
  const tipoCombustible = useSignal('');
  const dialogOpened = useSignal(false);

  const listaCategoria = useSignal<string[]>([]);
  const listaTipoCombustible = useSignal<string[]>([]);

  useEffect(() => {
    AutoService.listCategoria().then((data: (string | undefined)[] | undefined) => {
      listaCategoria.value = (data ?? []).filter((item): item is string => typeof item === 'string');
    });
    AutoService.listTipoCombustible().then((data: (string | undefined)[] | undefined) => {
      listaTipoCombustible.value = (data ?? []).filter((item): item is string => typeof item === 'string');
    });
  }, []);

  const createAuto = async () => {
    try {
      const anioVal = Number(anio.value);
      const precioVal = Number(precio.value);
      const kilometrajeVal = Number(kilometraje.value);

      if (marca.value.trim() && !isNaN(anioVal) && anio.value !== '' && !isNaN(precioVal) && precio.value !== '' && !isNaN(kilometrajeVal) && 
        kilometraje.value !== '' && color.value.trim() && matricula.value.trim() && categoria.value.trim() && tipoCombustible.value.trim()) {
        await AutoService.create(
          marca.value,
          anioVal,
          precioVal,
          kilometrajeVal,
          color.value,
          matricula.value,
          categoria.value,
          tipoCombustible.value
        );
        if (props.onAutoCreated) props.onAutoCreated();
        marca.value = '';
        anio.value = '';
        precio.value = '';
        kilometraje.value = '';
        color.value = '';
        matricula.value = '';
        categoria.value = '';
        tipoCombustible.value = '';
        dialogOpened.value = false;
        Notification.show('Auto creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
        headerTitle="Nuevo auto"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createAuto} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Marca" value={marca.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (marca.value = evt.detail.value)} />
          <NumberField label="Año" value={anio.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (anio.value = evt.detail.value)} />
          <NumberField label="Precio" value={precio.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (precio.value = evt.detail.value)} />
          <NumberField label="Kilometraje" value={kilometraje.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (kilometraje.value = evt.detail.value)} />
          <TextField label="Color" value={color.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (color.value = evt.detail.value)} />
          <TextField label="Matrícula" value={matricula.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (matricula.value = evt.detail.value)} />
          <ComboBox label="Categoría" items={listaCategoria.value} value={categoria.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (categoria.value = evt.detail.value)} />
          <ComboBox label="Tipo de combustible" items={listaTipoCombustible.value} value={tipoCombustible.value} onValueChanged={(evt: CustomEvent<{ value: string }>) => (tipoCombustible.value = evt.detail.value)} />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function AutoView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await AutoService.listAuto();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de autos">
        <Group>
          <AutoEntryForm onAutoCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="marca" header="Marca" />
        <GridColumn path="anio" header="Año" />
        <GridColumn path="precio" header="Precio" />
        <GridColumn path="kilometraje" header="Kilometraje" />
        <GridColumn path="color" header="Color" />
        <GridColumn path="matricula" header="Matrícula" />
        <GridColumn path="categoria" header="Categoría" />
        <GridColumn path="tipoCombustible" header="Tipo de combustible" />
      </Grid>
    </main>
  );
}