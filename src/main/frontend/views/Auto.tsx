import { useEffect, useState } from 'react';
import { Button, Dialog, Notification, Checkbox, TextArea, TextField, VerticalLayout, HorizontalLayout, ComboBox } from '@vaadin/react-components';
import { AutoService, MarcaService, ImagenService } from 'Frontend/generated/endpoints';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useSignal } from '@vaadin/hilla-react-signals';
import { CheckboxGroup } from '@vaadin/react-components/CheckboxGroup';


interface AutoItem {
  id: number;
  modelo: string;
  anio: string;
  puertas: number;
  color: string;
  kilometraje: number;
  ciudad: string;
  precio: number;
  matricula: string;
  codigoVIN: string;
  descripcion: string;
  fechaRegistro: string;
  estaDisponible: boolean;
  idVenta: number;
  idMarca: number;
  tipoCombustible: string;
  categoria: string;
}

export const config = {
    title: 'Auto',
    menu: {
        icon: 'vaadin:car',
        order: 2,
        title: 'Auto',
    },
};

function AutoEntryForm({ onAutoCreated, marcas, setMarcas, ventas, tiposCombustible, categorias, onCancel, autoEditar, modoEdicion, onAutoEditado }: {
    onAutoCreated?: () => void,
    marcas: { id: number, nombre: string }[],
    setMarcas: React.Dispatch<React.SetStateAction<{ id: number, nombre: string }[]>>,
    ventas: { id: number }[],
    tiposCombustible: string[],
    categorias: string[],
    onCancel?: () => void,
    autoEditar?: any | null,
    modoEdicion?: boolean,
    onAutoEditado?: () => void
}) {
    const [autoForm, setAutoForm] = useState({
        modelo: '', anio: '', puertas: '', color: '', kilometraje: '', ciudad: '', precio: '', matricula: '', codigoVIN: '', descripcion: '', fechaRegistro: '', estaDisponible: true, idVenta: '', idMarca: '', tipoCombustible: '', categoria: ''
    });
    const [imagenes, setImagenes] = useState<any[]>([]);
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<string[]>([]);
    const [idMarcaSeleccionada, setIdMarcaSeleccionada] = useState<number | null>(null);

    const handleChange = (field: string, value: any) => {
        setAutoForm(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        ImagenService.listImagen().then((data: any) => {
            setImagenes((data ?? []).filter(Boolean));
        });
    }, []);

    useEffect(() => {
        if (autoEditar && modoEdicion) {
            setAutoForm({
                modelo: autoEditar.modelo || '',
                anio: autoEditar.anio || '',
                puertas: autoEditar.puertas ? String(autoEditar.puertas) : '',
                color: autoEditar.color || '',
                kilometraje: autoEditar.kilometraje ? String(autoEditar.kilometraje) : '',
                ciudad: autoEditar.ciudad || '',
                precio: autoEditar.precio ? String(autoEditar.precio) : '',
                matricula: autoEditar.matricula || '',
                codigoVIN: autoEditar.codigoVIN || '',
                descripcion: autoEditar.descripcion || '',
                fechaRegistro: autoEditar.fechaRegistro || '',
                estaDisponible: autoEditar.estaDisponible,
                idVenta: autoEditar.idVenta ? String(autoEditar.idVenta) : '',
                idMarca: autoEditar.idMarca ? String(autoEditar.idMarca) : '',
                tipoCombustible: autoEditar.tipoCombustible || '',
                categoria: autoEditar.categoria || ''
            });
            setIdMarcaSeleccionada(autoEditar.idMarca || null);
            const asociadas = imagenes.filter(img => Number(img.idAuto) === Number(autoEditar.id)).map(img => String(img.id));
            setImagenesSeleccionadas(asociadas);
        } else if (!modoEdicion) {
            setAutoForm({
                modelo: '', anio: '', puertas: '', color: '', kilometraje: '', ciudad: '', precio: '', matricula: '', codigoVIN: '', descripcion: '', fechaRegistro: '', estaDisponible: true, idVenta: '', idMarca: '', tipoCombustible: '', categoria: ''
            });
            setIdMarcaSeleccionada(null);
            setImagenesSeleccionadas([]);
        }
    }, [autoEditar, modoEdicion, imagenes, marcas]);

    function formatFecha(fecha: string): string | undefined {
        if (!fecha) return undefined;
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
        const d = new Date(fecha);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
        return undefined;
    }

    const createAuto = async () => {
        try {
            if (!autoForm.modelo.trim()) {
                Notification.show('El campo Modelo es obligatorio', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            if (!idMarcaSeleccionada) {
                Notification.show('Debe seleccionar una marca', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await AutoService.create(
                autoForm.modelo,
                autoForm.anio,
                autoForm.puertas ? Number(autoForm.puertas) : undefined,
                autoForm.color,
                autoForm.kilometraje || undefined,
                autoForm.ciudad,
                autoForm.precio ? parseFloat(autoForm.precio) : undefined,
                autoForm.matricula,
                autoForm.codigoVIN,
                autoForm.descripcion,
                autoForm.fechaRegistro ? formatFecha(autoForm.fechaRegistro) : undefined,
                autoForm.estaDisponible,
                autoForm.idVenta ? Number(autoForm.idVenta) : undefined,
                idMarcaSeleccionada,
                autoForm.tipoCombustible,
                autoForm.categoria
            );
            const autos = await AutoService.listAuto();
            const autoCreado = autos && autos.length > 0 ? autos[autos.length - 1] : null;
            const idAutoNuevo = autoCreado?.id || autoCreado?.idAuto;
            await ImagenService.asociarImagenesAUnAuto(Number(idAutoNuevo), imagenesSeleccionadas.map(id => Number(id)));
            if (onAutoCreated) onAutoCreated();
            setAutoForm({
                modelo: '', anio: '', puertas: '', color: '', kilometraje: '', ciudad: '', precio: '', matricula: '', codigoVIN: '', descripcion: '', fechaRegistro: '', estaDisponible: true, idVenta: '', idMarca: '', tipoCombustible: '', categoria: ''
            });
            setIdMarcaSeleccionada(null);
            setImagenesSeleccionadas([]);
            Notification.show('Auto creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al guardar el auto', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    const editarAuto = async () => {
        try {
            if (!autoEditar) return;
            if (!idMarcaSeleccionada) {
                Notification.show('Debe seleccionar una marca', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            await AutoService.updateAuto(
                autoEditar.id,
                autoForm.modelo,
                autoForm.anio,
                autoForm.puertas ? Number(autoForm.puertas) : undefined,
                autoForm.color,
                autoForm.kilometraje || undefined,
                autoForm.ciudad,
                autoForm.precio ? parseFloat(autoForm.precio) : undefined,
                autoForm.matricula,
                autoForm.codigoVIN,
                autoForm.descripcion,
                autoForm.fechaRegistro ? formatFecha(autoForm.fechaRegistro) : undefined,
                autoForm.estaDisponible,
                autoForm.idVenta ? Number(autoForm.idVenta) : undefined,
                idMarcaSeleccionada,
                autoForm.tipoCombustible,
                autoForm.categoria
            );
            await ImagenService.asociarImagenesAUnAuto(Number(autoEditar.id), imagenesSeleccionadas.map(id => Number(id)));
            if (onAutoEditado) onAutoEditado();
            Notification.show('Auto editado correctamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
        } catch (error: any) {
            Notification.show(error?.message || 'Error al editar el auto', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    const [file, setFile] = useState<File | null>(null);
    const [descripcionImg, setDescripcionImg] = useState('');
    const [subiendoImg, setSubiendoImg] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    const handleDescripcionImgChange = (e: any) => {
      setDescripcionImg(e.detail.value);
    };

    const handleUploadImagen = async () => {
      if (!file || !descripcionImg) return;
      setSubiendoImg(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'Imagenes');
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dld5pxm9z/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        await ImagenService.create(data.secure_url, descripcionImg, 0);
        setFile(null);
        setDescripcionImg('');
        ImagenService.listImagen().then((data: any) => {
          setImagenes((data ?? []).filter(Boolean));
        });
        Notification.show('Imagen subida y guardada correctamente', { duration: 3000, position: 'top-center', theme: 'success' });
      } catch (err) {
        Notification.show('Error al subir o guardar la imagen', { duration: 5000, position: 'top-center', theme: 'error' });
      } finally {
        setSubiendoImg(false);
      }
    };

    const marcarComoPrincipal = async (idImagen: number, idAuto: number) => {
      await fetch(`/api/imagenes/principal?idImagen=${idImagen}&idAuto=${idAuto}`, {
        method: 'POST'
      });
      const data = await ImagenService.listImagen();
      setImagenes((data ?? []).filter(Boolean));
    };

    const ImagenesAutoGallery = ({ imagenes, autoId }: any) => {
      const imagenesDelAuto = imagenes.filter((img: any) => Number(img.idAuto) === Number(autoId));
      return (
        <div className="form-grid-fullwidth">
          <label>Imágenes subidas</label>
          <div className="auto-image-gallery">
            {imagenesDelAuto.length > 0 ? (
              imagenesDelAuto.map((img: any) => (
                <div key={img.id} className="auto-image-label">
                  <img src={img.url} alt={img.descripcion} className="auto-image-thumb" />
                  <span className="auto-image-desc">{img.descripcion}</span>
                  <Button
                    theme={img.esPrincipal === 'true' || img.esPrincipal === true ? 'primary' : 'secondary'}
                    onClick={() => marcarComoPrincipal(img.id, img.idAuto)}
                    disabled={img.esPrincipal === 'true' || img.esPrincipal === true}
                  >
                    {img.esPrincipal === 'true' || img.esPrincipal === true ? 'Principal' : 'Marcar como principal'}
                  </Button>
                </div>
              ))
            ) : (
              <div className="auto-image-label text-muted-foreground">No hay imágenes subidas</div>
            )}
          </div>
        </div>
      );
    };

    const SubidaImagen = ({ file, setFile, descripcionImg, setDescripcionImg, subiendoImg, handleUploadImagen, handleFileChange, handleDescripcionImgChange }: any) => (
      <div className="form-grid-fullwidth auto-upload-box">
        <label htmlFor="auto-upload-file">Subir nueva imagen</label>
        <input
          id="auto-upload-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="auto-upload-input"
        />
        <Button onClick={() => document.getElementById('auto-upload-file')?.click()}>
          Elegir imagen
        </Button>
        {file && (
          <div className="file-selected-name">
            <strong>{file.name}</strong>
          </div>
        )}
        <TextField
          label="Descripción de la imagen"
          value={descripcionImg}
          onValueChanged={e => setDescripcionImg(e.detail.value)}
          placeholder="Descripción de la imagen"
        />
        <button onClick={handleUploadImagen} disabled={!file || !descripcionImg || subiendoImg}>
          {subiendoImg ? 'Subiendo...' : 'Subir imagen'}
        </button>
      </div>
    );

    return (
        <VerticalLayout>
            <div className="form-grid-3col">
                <TextField label="Modelo" value={autoForm.modelo} placeholder="Ej: Corolla" onValueChanged={e => handleChange('modelo', e.detail.value)} />
                <TextField label="Año" value={autoForm.anio} placeholder="Ej: 2020" onValueChanged={e => handleChange('anio', e.detail.value)} />
                <TextField label="Puertas" value={autoForm.puertas} placeholder="Ej: 4" onValueChanged={e => handleChange('puertas', e.detail.value)} />
                <TextField label="Color" value={autoForm.color} placeholder="Ej: Rojo" onValueChanged={e => handleChange('color', e.detail.value)} />
                <TextField label="Kilometraje" value={autoForm.kilometraje} placeholder="Ej: 35000" onValueChanged={e => handleChange('kilometraje', e.detail.value)} />
                <TextField label="Ciudad" value={autoForm.ciudad} placeholder="Ej: Quito" onValueChanged={e => handleChange('ciudad', e.detail.value)} />
                <TextField label="Precio" value={autoForm.precio} placeholder="Ej: 15000" onValueChanged={e => handleChange('precio', e.detail.value)} />
                <TextField label="Matrícula" value={autoForm.matricula} placeholder="Ej: ABC123" onValueChanged={e => handleChange('matricula', e.detail.value)} />
                <TextField label="VIN" value={autoForm.codigoVIN} placeholder="Ej: 1HGCM82633A004352" onValueChanged={e => handleChange('codigoVIN', e.detail.value)} />
                <TextField label="Fecha Registro (yyyy-MM-dd)" value={autoForm.fechaRegistro} placeholder="Ej: 2024-06-08" onValueChanged={e => handleChange('fechaRegistro', e.detail.value)} />
                <ComboBox label="Venta" items={ventas.map(v => ({ label: String(v.id), value: String(v.id) }))} value={autoForm.idVenta} placeholder="Seleccione una venta" onValueChanged={(e: CustomEvent<{ value: string }>) => handleChange('idVenta', e.detail.value)} />
                <ComboBox
                  label="Marca"
                  items={marcas.map(m => ({ label: m.nombre, value: String(m.id) }))}
                  value={idMarcaSeleccionada ? String(idMarcaSeleccionada) : ''}
                  placeholder="Seleccione una marca"
                  onValueChanged={e => setIdMarcaSeleccionada(Number(e.detail.value))}
                  clearButtonVisible
                />
                <ComboBox label="Tipo Combustible" items={tiposCombustible} value={autoForm.tipoCombustible} placeholder="Ej: GASOLINA" onValueChanged={(e: CustomEvent<{ value: string }>) => handleChange('tipoCombustible', e.detail.value)} />
                <ComboBox label="Categoría" items={categorias} value={autoForm.categoria} placeholder="Ej: SEDAN" onValueChanged={(e: CustomEvent<{ value: string }>) => handleChange('categoria', e.detail.value)} className="combo-categoria" />
                <div className="form-grid-fullwidth">
                    <Checkbox label="¿Disponible?" checked={autoForm.estaDisponible} onCheckedChanged={e => handleChange('estaDisponible', e.detail.value)} />
                </div>
                <div className="form-grid-fullwidth">
                    <TextArea label="Descripción" value={autoForm.descripcion} style={{ width: '100%', minHeight: '100px', maxHeight: '150px' }} placeholder="Descripción del auto" onValueChanged={e => handleChange('descripcion', e.detail.value)} />
                </div>
                <ImagenesAutoGallery imagenes={imagenes} autoId={modoEdicion && autoEditar ? autoEditar.id : undefined} />
                <SubidaImagen file={file} setFile={setFile} descripcionImg={descripcionImg} setDescripcionImg={setDescripcionImg} subiendoImg={subiendoImg} handleUploadImagen={handleUploadImagen} handleFileChange={handleFileChange} handleDescripcionImgChange={handleDescripcionImgChange} />
            </div>
            <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={onCancel}>Cancelar</Button>
                {modoEdicion ? (
                    <Button onClick={editarAuto} theme="primary">Guardar cambios</Button>
                ) : (
                    <Button onClick={createAuto} theme="primary">Registrar</Button>
                )}
            </div>
        </VerticalLayout>
    );
}

export default function AutoView() {
    const [items, setItems] = useState<AutoItem[]>([]);
    const [marcas, setMarcas] = useState<{ id: number, nombre: string }[]>([]);
    const [ventas, setVentas] = useState<{ id: number }[]>([]);
    const [tiposCombustible, setTiposCombustible] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [autoEditar, setAutoEditar] = useState<AutoItem | null>(null);
    const [imagenes, setImagenes] = useState<any[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [resultadoBusqueda, setResultadoBusqueda] = useState<any | null>(null);
    const [categoriaBusqueda, setCategoriaBusqueda] = useState('');
    const [resultadoCategoria, setResultadoCategoria] = useState<any[] | null>(null);

    const callData = () => {
        AutoService.listAuto()
            .then(data => setItems(
                (data ?? [])
                    .filter(Boolean)
                    .map((item: any) => ({
                        id: item.id,
                        modelo: item.modelo ?? '',
                        anio: item.anio ?? '',
                        puertas: Number(item.puertas) || 0,
                        color: item.color ?? '',
                        kilometraje: Number(item.kilometraje) || 0,
                        ciudad: item.ciudad ?? '',
                        precio: Number(item.precio) || 0,
                        matricula: item.matricula ?? '',
                        codigoVIN: item.codigoVIN ?? '',
                        descripcion: item.descripcion ?? '',
                        fechaRegistro: item.fechaRegistro ?? '',
                        estaDisponible: Boolean(item.estaDisponible),
                        idVenta: Number(item.idVenta) || 0,
                        idMarca: Number(item.idMarca) || 0,
                        tipoCombustible: item.tipoCombustible ?? '',
                        categoria: item.categoria ?? ''
                    }))
            ))
            .catch(() => Notification.show('Error al cargar autos', { duration: 5000, position: 'top-center', theme: 'error' }));
    };

    const buscarAuto = async () => {
        if (!busqueda.trim()) {
            setResultadoBusqueda(null);
            Notification.show('Ingrese un modelo para buscar', { duration: 3000, position: 'top-center', theme: 'error' });
            return;
        }
        const result = await AutoService.buscarPorAtributo('modelo', busqueda)  ;
        if (result) {
            setResultadoBusqueda(result);
        } else {
            setResultadoBusqueda(null);
            Notification.show('No se encontró el auto', { duration: 4000, position: 'top-center', theme: 'error' });
        }
    };

    const buscarPorCategoria = (categoria: string) => {
        setCategoriaBusqueda(categoria);
        if (!categoria) {
            setResultadoCategoria(null);
            return;
        }
        const filtrados = items.filter(auto => (auto.categoria || '').toLowerCase() === categoria.toLowerCase());
        setResultadoCategoria(filtrados);
    };

    useEffect(() => {
        callData();
        MarcaService.listMarca().then((data: any) => {
            setMarcas((data ?? []).filter(Boolean).map((m: any) => ({ id: Number(m.id), nombre: m.nombre })));
        });
        AutoService.getTiposCombustible().then((data) => setTiposCombustible((data ?? []).filter(Boolean) as string[]));
        AutoService.getCategoriasLegibles().then((data) => setCategorias((data ?? []).filter(Boolean) as string[]));
        import('Frontend/generated/endpoints').then(({ VentaService }) => {
            if (VentaService && VentaService.listVenta) {
                VentaService.listVenta().then((data: any) => {
                    setVentas((data ?? []).filter(Boolean).map((v: any) => ({ id: Number(v.id) })));
                });
            }
        });
        ImagenService.listImagen().then((data: any) => {
            setImagenes((data ?? []).filter(Boolean));
        });
    }, []);

    return (
        <main className="w-full h-full flex flex-col gap-4 p-4">
            <ViewToolbar title="Lista de Autos">
            <Group />
        </ViewToolbar>
            <div className="auto-toolbar-row">
                <div className="auto-search-group">
                    <ComboBox
                        label="Categoría"
                        items={categorias}
                        value={categoriaBusqueda}
                        onValueChanged={e => buscarPorCategoria(e.detail.value)}
                        placeholder="Categoría"
                        clearButtonVisible
                        className="auto-category-combo"
                    />
                    <TextField
                        label="Buscar auto por modelo"
                        value={busqueda}
                        onValueChanged={e => setBusqueda(e.detail.value)}
                        placeholder="Ej: Corolla"
                        className="auto-search-textfield"
                        autocomplete="off"
                    />
                    <Button onClick={buscarAuto} theme="primary">Buscar</Button>
                    <Button onClick={() => { setBusqueda(''); setCategoriaBusqueda(''); setResultadoBusqueda(null); setResultadoCategoria(null); }} theme="tertiary">Limpiar</Button>
                </div>
                <Button theme="primary" onClick={() => { setDialogOpened(true); setModoEdicion(false); setAutoEditar(null); }} className="auto-add-btn">Agregar auto</Button>
            </div>
            {resultadoBusqueda ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <AutoCard auto={resultadoBusqueda} marcas={marcas} imagenes={imagenes} setDialogOpened={setDialogOpened} setModoEdicion={setModoEdicion} setAutoEditar={setAutoEditar} />
                </div>
            ) : resultadoCategoria ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {resultadoCategoria.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">No hay autos para esta categoría.</div>
                    ) : resultadoCategoria.map((auto, idx) => (
                        <AutoCard key={idx} auto={auto} marcas={marcas} imagenes={imagenes} setDialogOpened={setDialogOpened} setModoEdicion={setModoEdicion} setAutoEditar={setAutoEditar} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {items.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">
                            No hay autos para mostrar.
                        </div>
                    ) : items.map((auto, idx) => (
                        <AutoCard key={idx} auto={auto} marcas={marcas} imagenes={imagenes} setDialogOpened={setDialogOpened} setModoEdicion={setModoEdicion} setAutoEditar={setAutoEditar} />
                    ))}
                </div>
            )}
            <Dialog
                headerTitle={modoEdicion ? "Editar auto" : "Registrar nuevo auto"}
                opened={dialogOpened}
                onOpenedChanged={e => setDialogOpened(e.detail.value)}
                footer={null}
            >
                <AutoEntryForm
                    onAutoCreated={() => { callData(); setDialogOpened(false); }}
                    marcas={marcas}
                    setMarcas={setMarcas}
                    ventas={ventas}
                    tiposCombustible={tiposCombustible}
                    categorias={categorias}
                    onCancel={() => setDialogOpened(false)}
                    autoEditar={autoEditar}
                    modoEdicion={modoEdicion}
                    onAutoEditado={() => { callData(); setDialogOpened(false); setModoEdicion(false); setAutoEditar(null); }}
                />
            </Dialog>
        </main>
    );
}

function AutoCard({ auto, marcas, imagenes, setDialogOpened, setModoEdicion, setAutoEditar }: any) {
    const marca = marcas.find((m: any) => m.id === Number(auto.idMarca))?.nombre || auto.idMarca;
    const imagenPrincipal = imagenes.find((img: any) => Number(img.idAuto) === Number(auto.id) && (img.esPrincipal === 'true' || img.esPrincipal === true));
    return (
        <div className="card-bordered flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card h-full min-w-[300px] max-w-[400px] mx-auto relative">
            <div className="card-image-container-400x300 mb-2 flex flex-row gap-2 overflow-x-auto">
                {imagenPrincipal ? (
                    <img src={imagenPrincipal.url} alt={auto.modelo} className="card-image-400x300 object-cover rounded-t-lg" />
                ) : (
                    <div className="card-image-400x300 flex items-center justify-center bg-muted rounded-t-lg text-muted-foreground text-4xl">
                        <span role="img" aria-label="Sin imagen">🚗</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-grow px-3 pb-3 gap-1 items-center text-center">
                <div className="font-headline text-lg mb-0.5 break-words flex flex-col items-center gap-1 w-full">
                    <span>{auto.modelo}</span>
                    <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded px-2 py-0.5 whitespace-nowrap mt-0.5">{auto.categoria}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">Año {auto.anio}</div>
                <div className="text-primary font-bold text-xl mb-1">${Number(auto.precio).toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-2 w-full">
                    <div className="flex items-center gap-1.5 justify-center">
                        <span className="font-semibold">KM:</span> {Number(auto.kilometraje).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                        <span className="font-semibold">Color:</span> {auto.color}
                    </div>
                </div>
                <span className="inline-block bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs font-semibold mb-2 w-max">{auto.tipoCombustible}</span>
                <div className="text-xs text-muted-foreground truncate w-full">Matrícula: {auto.matricula}</div>
                <div className="flex gap-2 mt-2 justify-center">
                    <Button onClick={() => { setDialogOpened(true); setModoEdicion(true); setAutoEditar(auto); }}>Editar</Button>
                </div>
            </div>
        </div>
    );
}