import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, GridItemModel, DatePicker, ComboBox, NumberField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { VentaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Venta',
  menu: {
    icon: 'vaadin:dollar',
    order: 1,
    title: 'Venta',
  },
};

type VentaEntryFormProps = {
  onVentaCreated?: () => void;
};

function VentaEntryForm(props: VentaEntryFormProps) {
  const precioVenta = useSignal('');
  const fechaVenta = useSignal('');
  const comprador = useSignal('');
  const publicacion = useSignal('');
  const dialogOpened = useSignal(false);

  const compradores = useSignal<{ value: string, label: string }[]>([]);
  const publicaciones = useSignal<{ value: string, label: string }[]>([]);

  useEffect(() => {
    VentaService.listaComprador().then(data => {
      compradores.value = (data ?? []).map((u: any) => ({
        value: u.value,
        label: u.label
      }));
    });
    VentaService.listaPublicacion().then(data => {
      publicaciones.value = (data ?? []).map((p: any) => ({
        value: p.value,
        label: p.label
      }));
    });
  }, []);

  const createVenta = async () => {
    try {
      const precio = parseFloat(precioVenta.value);
      if (!isNaN(precio) && fechaVenta.value && comprador.value && publicacion.value) {
        const idComprador = parseInt(comprador.value) + 1;
        const idPublicacion = parseInt(publicacion.value) + 1;
        await VentaService.create(
          precio,
          fechaVenta.value,
          idComprador,
          idPublicacion
        );
        if (props.onVentaCreated) props.onVentaCreated();
        precioVenta.value = '';
        fechaVenta.value = '';
        comprador.value = '';
        publicacion.value = '';
        dialogOpened.value = false;
        Notification.show('Venta registrada', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo registrar, faltan o hay datos inválidos', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva venta"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createVenta} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <NumberField
            label="Precio de venta"
            value={precioVenta.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (precioVenta.value = evt.detail.value)}
          />
          <DatePicker
            label="Fecha de venta"
            value={fechaVenta.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (fechaVenta.value = evt.detail.value)}
          />
          <ComboBox
            label="Comprador"
            items={compradores.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={comprador.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (comprador.value = evt.detail.value)}
          />
          <ComboBox
            label="Publicación"
            items={publicaciones.value}
            itemLabelPath="label"
            itemValuePath="value"
            value={publicacion.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (publicacion.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}

export default function VentaView() {
  const dataProvider = useDataProvider<any>({
    list: async () => {
      const result = await VentaService.listVenta();
      return (result ?? []).filter((item): item is Record<string, unknown> => item !== undefined);
    },
  });

  function indexIndex({ model }: { model: GridItemModel<any> }) {
    return <span>{model.index + 1}</span>;
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de ventas">
        <Group>
          <VentaEntryForm onVentaCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={indexIndex} header="ID" />
        <GridColumn path="precioVenta" header="Precio" />
        <GridColumn path="fechaVenta" header="Fecha de venta" />
        <GridColumn path="comprador" header="Comprador" />
        <GridColumn path="publicacion" header="Publicación" />
      </Grid>
    </main>
  );
}