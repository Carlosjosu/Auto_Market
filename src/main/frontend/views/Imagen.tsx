import { useEffect, useState } from 'react';
import { ImagenService, AutoService } from 'Frontend/generated/endpoints';
import { Grid, GridColumn, VerticalLayout, ComboBox, Button, HorizontalLayout, TextField } from '@vaadin/react-components';
import { ViewToolbar, Group } from 'Frontend/components/ViewToolbar';

export const config = {
  title: 'Imagen',
  menu: {
    icon: 'vaadin:picture',
    order: 3,
    title: 'Imagen',
  },
};
function ImagenCell({ url }: { url: string }) {
  return (
    <img src={url} alt="Imagen" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
  );
}

export default function ImagenView() {
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [autos, setAutos] = useState<any[]>([]);
  const [autoSeleccionado, setAutoSeleccionado] = useState<string | null>(null);
  const [descripcionBusqueda, setDescripcionBusqueda] = useState('');
  const [imagenesFiltradas, setImagenesFiltradas] = useState<any[]>([]);

  useEffect(() => {
    ImagenService.listImagen().then((data: any) => {
      setImagenes((data ?? []).filter(Boolean));
    });
    AutoService.listAuto().then((data: any) => {
      setAutos((data ?? []).filter(Boolean));
    });
  }, []);

  const getNombreAuto = (idAuto: number) => {
    const auto = autos.find((a: any) => a.id === idAuto);
    return auto ? auto.modelo : idAuto;
  };

  const filtrarImagenes = () => {
    let filtradas = imagenes;
    if (autoSeleccionado) {
      filtradas = filtradas.filter((img: any) => String(img.idAuto) === autoSeleccionado);
    }
    if (descripcionBusqueda.trim()) {
      filtradas = filtradas.filter((img: any) => (img.descripcion || '').toLowerCase().includes(descripcionBusqueda.trim().toLowerCase()));
    }
    setImagenesFiltradas(filtradas);
  };

  useEffect(() => {
    setImagenesFiltradas(imagenes);
  }, [imagenes]);

  const limpiarFiltros = () => {
    setAutoSeleccionado(null);
    setDescripcionBusqueda('');
    setImagenesFiltradas(imagenes);
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Imágenes">
        <Group />
      </ViewToolbar>
      <div className="auto-toolbar-row">
        <div className="auto-search-group">
          <ComboBox
            label="Buscar por auto"
            items={autos.map((a: any) => ({ label: a.modelo, value: String(a.id) }))}
            value={autoSeleccionado ?? ''}
            onValueChanged={e => setAutoSeleccionado(e.detail.value ?? null)}
            placeholder="Seleccione un auto"
            clearButtonVisible
            className="auto-category-combo"
          />
          <TextField
            label="Buscar por descripción"
            value={descripcionBusqueda}
            onValueChanged={e => setDescripcionBusqueda(e.detail.value)}
            placeholder="Ej: lateral, frontal, etc."
            className="auto-search-textfield"
            autocomplete="off"
          />
          <Button onClick={filtrarImagenes} theme="primary">Buscar</Button>
          <Button onClick={limpiarFiltros} theme="tertiary">Limpiar</Button>
        </div>
      </div>
      <Grid items={imagenesFiltradas} style={{ width: '100%' }}>
        <GridColumn path="id" header="Código" />
        <GridColumn header="Imagen" renderer={({ item }) => <ImagenCell url={item.url} />} />
        <GridColumn path="url" header="URL" />
        <GridColumn path="descripcion" header="Descripción" />
        <GridColumn header="Auto" renderer={({ item }) => getNombreAuto(item.idAuto)} />
        <GridColumn header="¿Principal?" renderer={({ item }) => item.esPrincipal ? '✔️ Sí' : 'No'} />
      </Grid>
    </main>
  );
}
