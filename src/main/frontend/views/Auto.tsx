import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Button, Dialog, Notification, Checkbox, TextArea, TextField, VerticalLayout, HorizontalLayout, ComboBox, RadioGroup, RadioButton, CustomField } from '@vaadin/react-components';
=======
import { Button, Dialog, Notification, Checkbox, TextArea, TextField, VerticalLayout, HorizontalLayout, ComboBox, RadioGroup, RadioButton } from '@vaadin/react-components';
>>>>>>> origin/develop
import { AutoService, MarcaService, ImagenService, FavoritoService, CuentaService } from 'Frontend/generated/endpoints';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useSignal } from '@vaadin/hilla-react-signals';
import { CheckboxGroup } from '@vaadin/react-components/CheckboxGroup';
<<<<<<< HEAD
import { useAuth, role } from 'Frontend/security/auth';
=======
import { useAuth } from 'Frontend/security/auth';
>>>>>>> origin/develop
import { useNavigate } from 'react-router-dom';


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
  idVendedor: number;
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

<<<<<<< HEAD
function AutoEntryForm({ onAutoCreated, marcas, setMarcas, ventas, tiposCombustible, categorias, onCancel, autoEditar, modoEdicion, onAutoEditado, onDataRefresh, usuarioActual }: {
=======
function AutoEntryForm({ onAutoCreated, marcas, setMarcas, ventas, tiposCombustible, categorias, onCancel, autoEditar, modoEdicion, onAutoEditado, onDataRefresh, usuarioActual, isAdmin }: {
>>>>>>> origin/develop
    onAutoCreated?: () => void,
    marcas: { id: number, nombre: string }[],
    setMarcas: React.Dispatch<React.SetStateAction<{ id: number, nombre: string }[]>>,
    ventas: { id: number }[],
    tiposCombustible: string[],
    categorias: string[],
    onCancel?: () => void,
    autoEditar?: any | null,
    modoEdicion?: boolean,
    onAutoEditado?: () => void,
    onDataRefresh?: () => void,
<<<<<<< HEAD
    usuarioActual?: any
=======
    usuarioActual?: any,
    isAdmin?: boolean
>>>>>>> origin/develop
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
                usuarioActual?.id || 1, // Usar ID del usuario actual como vendedor
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
            
<<<<<<< HEAD
            // Validaciones de permisos usando el backend
            const rolResponse = await role();
            const esAdmin = rolResponse?.rol === 'ROLE_admin';
            if (!esAdmin && Number(autoEditar.idVendedor) !== Number(usuarioActual?.id)) {
=======
            // Validaciones de permisos
            if (!isAdmin && Number(autoEditar.idVendedor) !== Number(usuarioActual?.id)) {
>>>>>>> origin/develop
                Notification.show('No tienes permisos para editar este auto', { duration: 5000, position: 'top-center', theme: 'error' });
                return;
            }
            
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
      try {
        const response = await fetch(`/api/imagenes/principal?idImagen=${idImagen}&idAuto=${idAuto}`, {
          method: 'POST'
        });
        
        if (response.ok) {
          // Usar setTimeout para asegurar que el backend procesó completamente la actualización
          setTimeout(async () => {
            // Recargar las imágenes del formulario para ver los cambios inmediatos
            const data = await ImagenService.listImagen();
            const imagenesData = (data ?? []).filter(Boolean);
            setImagenes(imagenesData);
            
            // Ejecutar callback para actualizar tarjetas si está disponible
            if (onDataRefresh) {
              onDataRefresh();
            }
          }, 100);
          
          Notification.show('Imagen principal actualizada', { 
            duration: 3000, 
            position: 'top-center', 
            theme: 'success' 
          });
        } else {
          throw new Error('Error al actualizar la imagen principal');
        }
      } catch (error) {
        console.error('Error al marcar como principal:', error);
        Notification.show('Error al marcar como imagen principal', { 
          duration: 5000, 
          position: 'top-center', 
          theme: 'error' 
        });
      }
    };

    const ImagenesAutoGallery = ({ imagenes, autoId }: any) => {
      const imagenesDelAuto = imagenes.filter((img: any) => Number(img.idAuto) === Number(autoId));
      
      const handleMarcarPrincipal = async (idImagen: number) => {
        await marcarComoPrincipal(idImagen, Number(autoId));
      };
      
      return (
        <div className="form-grid-fullwidth">
          <label>Imágenes subidas</label>
          <div className="auto-image-gallery">
            {imagenesDelAuto.length > 0 ? (
              imagenesDelAuto.map((img: any) => {
                const esPrincipal = img.esPrincipal === 'true' || img.esPrincipal === true || img.esPrincipal === 1;
                return (
                  <div key={img.id} className="auto-image-label">
                    <img src={img.url} alt={img.descripcion} className="auto-image-thumb" />
                    <span className="auto-image-desc">{img.descripcion}</span>
                    {esPrincipal && (
                      <span className="auto-principal-badge">
                        ⭐ PRINCIPAL
                      </span>
                    )}
                    <Button
                      theme={esPrincipal ? 'primary' : 'secondary'}
                      onClick={() => handleMarcarPrincipal(img.id)}
                      disabled={esPrincipal}
                      className="auto-principal-button"
                    >
                      {esPrincipal ? 'Es Principal' : 'Marcar Principal'}
                    </Button>
                  </div>
                );
              })
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
                    <TextArea label="Descripción" value={autoForm.descripcion} className="auto-description-textarea" placeholder="Descripción del auto" onValueChanged={e => handleChange('descripcion', e.detail.value)} />
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
    const { state } = useAuth();
    const navigate = useNavigate();
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
<<<<<<< HEAD
    const [opcionesBusqueda, setOpcionesBusqueda] = useState<any[]>([]);
    // Eliminados estados de búsqueda por categoría
=======
    const [categoriaBusqueda, setCategoriaBusqueda] = useState('');
    const [resultadoCategoria, setResultadoCategoria] = useState<any[] | null>(null);
>>>>>>> origin/develop
    const [renderKey, setRenderKey] = useState(0);
    
    // Estados para el modal de detalles
    const [detalleDialogOpened, setDetalleDialogOpened] = useState(false);
    const [autoSeleccionado, setAutoSeleccionado] = useState<AutoItem | null>(null);
    
    // Estados para manejo de roles y modos
<<<<<<< HEAD
    const [usuarioActual, setUsuarioActual] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [mostrarSoloMios, setMostrarSoloMios] = useState(false);

    const callData = () => {
        setRenderKey(prev => prev + 1);
        const userId = state.user?.credentials;
        if (userId) setUsuarioActual({ id: userId });
        role().then((rolResponse) => {
            const esAdmin = rolResponse?.rol === 'ROLE_admin';
            setIsAdmin(esAdmin);
            let autoPromise;
            if (esAdmin) {
                autoPromise = AutoService.listAuto();
            } else if (mostrarSoloMios && userId) {
                autoPromise = AutoService.listAutosByVendedor(Number(userId));
            } else {
                autoPromise = AutoService.listAuto();
            }
=======
    const [modoUsuario, setModoUsuario] = useState<'vendedor' | 'comprador'>('comprador');
    const [usuarioActual, setUsuarioActual] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const callData = () => {
        // Incrementar la key para forzar re-renderizado
        setRenderKey(prev => prev + 1);
        
        // Cargar información del usuario actual
        CuentaService.getCurrentUserInfo().then(userInfo => {
            setUsuarioActual(userInfo);
            setIsAdmin(userInfo?.rol === 'admin');
            
            // Actualizar autos según el modo y rol
            let autoPromise;
            if (userInfo?.rol === 'admin') {
                // Admin ve todos los autos
                autoPromise = AutoService.listAuto();
            } else if (modoUsuario === 'vendedor' && userInfo?.id) {
                // Vendedor ve solo sus autos
                autoPromise = AutoService.listAutosByVendedor(Number(userInfo.id));
            } else if (modoUsuario === 'comprador' && userInfo?.id) {
                // Comprador ve autos de otros (disponibles)
                autoPromise = AutoService.listAutosForComprador(Number(userInfo.id));
            } else {
                // Por defecto, mostrar todos disponibles
                autoPromise = AutoService.listAuto();
            }
            
>>>>>>> origin/develop
            autoPromise.then(data => {
                const autosData = (data ?? [])
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
                        estaDisponible: item.estaDisponible === 'true',
                        idVenta: Number(item.idVenta) || 0,
                        idMarca: Number(item.idMarca) || 0,
                        idVendedor: Number(item.idVendedor) || 0,
                        tipoCombustible: item.tipoCombustible ?? '',
                        categoria: item.categoria ?? ''
                    }));
                setItems(autosData);
            }).catch(() => Notification.show('Error al cargar autos', { duration: 5000, position: 'top-center', theme: 'error' }));
<<<<<<< HEAD
        }).catch(() => {
            setIsAdmin(false);
            Notification.show('Error al verificar rol de usuario', { duration: 3000, position: 'top-center', theme: 'error' });
        });
=======
        });
        
        // Actualizar otros datos - estas líneas se ejecutan en useEffect por separado
        // MarcaService, tiposCombustible y categorias se cargan en useEffect
        
        // También actualizar las imágenes cuando se actualicen los autos
>>>>>>> origin/develop
        ImagenService.listImagen().then((data: any) => {
            const imagenesData = (data ?? []).filter(Boolean);
            setImagenes(imagenesData);
        }).catch(() => {
            console.error('Error al cargar imágenes en callData');
        });
    };

    const buscarAuto = async (modelo?: string) => {
        const texto = (typeof modelo === 'string' ? modelo : busqueda).trim();
        if (!texto) {
            setResultadoBusqueda(null);
            Notification.show('Ingrese un modelo para buscar', { duration: 3000, position: 'top-center', theme: 'error' });
            return;
        }
        const resultados = await AutoService.buscarPorModeloFlexible(texto);
        if (resultados && resultados.length > 0) {
            // Si se seleccionó desde el ComboBox, mostrar solo ese auto
            if (typeof modelo === 'string') {
                setResultadoBusqueda(resultados[0]);
            } else {
                setResultadoBusqueda(resultados[0]);
            }
        } else {
            setResultadoBusqueda(null);
            Notification.show('No se encontró el auto', { duration: 4000, position: 'top-center', theme: 'error' });
        }
    };

    // Autocompletado: cargar sugerencias mientras se escribe
    const handleInputBusqueda = async (e: any) => {
        const value = e.detail.value;
        setBusqueda(value);
        if (value.trim().length === 0) {
            setOpcionesBusqueda([]);
            setResultadoBusqueda(null);
            return;
        }
        const resultados = await AutoService.buscarPorModeloFlexible(value);
        setOpcionesBusqueda(resultados ?? []);
    };

    // Eliminada función de búsqueda por categoría

    const abrirDetalleAuto = (auto: AutoItem) => {
        setAutoSeleccionado(auto);
        setDetalleDialogOpened(true);
    };

    const abrirDetalleAuto = (auto: AutoItem) => {
        setAutoSeleccionado(auto);
        setDetalleDialogOpened(true);
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
            const imagenesData = (data ?? []).filter(Boolean);
            setImagenes(imagenesData);
        });
    }, []);

<<<<<<< HEAD
    // useEffect para responder a cambios de filtro
    useEffect(() => {
        callData(); // Recargar datos cuando cambie el filtro
    }, [mostrarSoloMios]);

    return (
        <main className="auto-main-background w-full h-full flex flex-col gap-2 md:gap-4 p-4 md:p-6 lg:p-8">
            <ViewToolbar title="Lista de Autos" />
            <div className="auto-toolbar-row">
                <div className="auto-search-group flex flex-row items-center gap-2 w-full">
                    {/* Eliminado ComboBox de categoría */}
                    <div className="auto-search-dropdown-container relative flex-1 min-w-[220px] max-w-xs">
                        <TextField
                            label="Buscar auto por modelo"
                            value={busqueda}
                            onValueChanged={e => {
                                setBusqueda(e.detail.value);
                                handleInputBusqueda({ detail: { value: e.detail.value } });
                            }}
                            placeholder="Ej: Corolla"
                            className="auto-search-textfield"
                            clearButtonVisible
                            autocomplete="off"
                        />
                        {busqueda && opcionesBusqueda.length > 0 && (
                            <div className="auto-search-suggestions-dropdown">
                                {opcionesBusqueda.map((auto, idx) => (
                                    <div
                                        key={auto.id || idx}
                                        className="auto-search-suggestion-item"
                                        onMouseDown={() => {
                                            setBusqueda(auto.modelo);
                                            buscarAuto(auto.modelo);
                                            setOpcionesBusqueda([]);
                                        }}
                                    >
                                        {auto.modelo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button onClick={() => buscarAuto()} className="auto-btn-primary">Buscar</Button>
                    {/* Botón agregar auto para todos los usuarios */}
                    <Button onClick={() => { setDialogOpened(true); setModoEdicion(false); setAutoEditar(null); }} className="auto-btn-success auto-add-btn">Agregar auto</Button>
                    {/* Toggle "Mis autos" como botón visual tipo toggle */}
                    {!isAdmin && (
                        <button
                            type="button"
                            className={`auto-toggle-btn-mis-autos${mostrarSoloMios ? ' active' : ''}`}
                            onClick={() => setMostrarSoloMios(v => !v)}
                        >
                            {mostrarSoloMios ? '✓ Mis autos' : 'Mis autos'}
                        </button>
=======
    // useEffect para responder a cambios de modo
    useEffect(() => {
        callData(); // Recargar datos cuando cambie el modo
    }, [modoUsuario]);

    return (
        <main className="auto-main-background w-full h-full flex flex-col gap-2 md:gap-4 p-4 md:p-6 lg:p-8">
            <ViewToolbar title="Lista de Autos">
                <Group>
                    {!isAdmin && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium"></span>
                            <RadioGroup
                                value={modoUsuario}
                                onValueChanged={(e) => setModoUsuario(e.detail.value as 'vendedor' | 'comprador')}
                                theme="horizontal"
                            >
                                <RadioButton value="comprador" label="Comprar" />
                                <RadioButton value="vendedor" label="Vender" />
                            </RadioGroup>
                        </div>
                    )}
                    {isAdmin && (
                        <span className="text-sm text-gray-600">👑 Modo Administrador</span>
                    )}
                </Group>
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
                    <Button onClick={buscarAuto} className="auto-btn-primary">Buscar</Button>
                    <Button onClick={() => { setBusqueda(''); setCategoriaBusqueda(''); setResultadoBusqueda(null); setResultadoCategoria(null); }} className="auto-clear-btn">Limpiar</Button>
                    {(isAdmin || modoUsuario === 'vendedor') && (
                        <Button onClick={() => { setDialogOpened(true); setModoEdicion(false); setAutoEditar(null); }} className="auto-btn-success auto-add-btn">Agregar auto</Button>
>>>>>>> origin/develop
                    )}
                </div>
            </div>
            {resultadoBusqueda ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-6 md:px-8 lg:px-10 py-6">
                    <AutoCard 
                        key={`single-${renderKey}`} 
                        auto={resultadoBusqueda} 
                        marcas={marcas} 
                        imagenes={imagenes} 
                        setDialogOpened={setDialogOpened} 
                        setModoEdicion={setModoEdicion} 
                        setAutoEditar={setAutoEditar} 
                        abrirDetalleAuto={abrirDetalleAuto}
<<<<<<< HEAD
                        usuarioActual={usuarioActual}
                        isAdmin={isAdmin}
                        mostrarSoloMios={mostrarSoloMios}
                    />
=======
                        modoUsuario={modoUsuario}
                        usuarioActual={usuarioActual}
                        isAdmin={isAdmin}
                    />
                </div>
            ) : resultadoCategoria ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-6 md:px-8 lg:px-10 py-6">
                    {resultadoCategoria.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">No hay autos para esta categoría.</div>
                    ) : resultadoCategoria.map((auto, idx) => (
                        <AutoCard 
                            key={`cat-${renderKey}-${idx}`} 
                            auto={auto} 
                            marcas={marcas} 
                            imagenes={imagenes} 
                            setDialogOpened={setDialogOpened} 
                            setModoEdicion={setModoEdicion} 
                            setAutoEditar={setAutoEditar} 
                            abrirDetalleAuto={abrirDetalleAuto}
                            modoUsuario={modoUsuario}
                            usuarioActual={usuarioActual}
                            isAdmin={isAdmin}
                        />
                    ))}
>>>>>>> origin/develop
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 px-6 md:px-8 lg:px-10 py-6">
                    {items.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-10">
                            No hay autos para mostrar.
                        </div>
                    ) : items.map((auto, idx) => (
                        <AutoCard 
                            key={`main-${renderKey}-${idx}`} 
                            auto={auto} 
                            marcas={marcas} 
                            imagenes={imagenes} 
                            setDialogOpened={setDialogOpened} 
                            setModoEdicion={setModoEdicion} 
                            setAutoEditar={setAutoEditar} 
                            abrirDetalleAuto={abrirDetalleAuto}
<<<<<<< HEAD
                            usuarioActual={usuarioActual}
                            isAdmin={isAdmin}
                            mostrarSoloMios={mostrarSoloMios}
=======
                            modoUsuario={modoUsuario}
                            usuarioActual={usuarioActual}
                            isAdmin={isAdmin}
>>>>>>> origin/develop
                        />
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
                    onDataRefresh={callData}
                    usuarioActual={usuarioActual}
<<<<<<< HEAD
=======
                    isAdmin={isAdmin}
>>>>>>> origin/develop
                />
            </Dialog>
            
            {/* Dialog de detalles del auto */}
            <Dialog
                headerTitle={autoSeleccionado ? `${autoSeleccionado.modelo} - ${marcas.find(m => m.id === autoSeleccionado.idMarca)?.nombre || 'N/A'}` : "Detalles del Auto"}
                opened={detalleDialogOpened}
                onOpenedChanged={e => setDetalleDialogOpened(e.detail.value)}
                footer={
                    <div className="flex gap-2 justify-end">
                        <Button onClick={() => setDetalleDialogOpened(false)}>Cerrar</Button>
                    </div>
                }
            >
<<<<<<< HEAD
                {autoSeleccionado && <AutoDetailModal auto={autoSeleccionado} marcas={marcas} imagenes={imagenes} navigate={navigate} usuarioActual={usuarioActual} />}
=======
                {autoSeleccionado && <AutoDetailModal auto={autoSeleccionado} marcas={marcas} imagenes={imagenes} navigate={navigate} />}
>>>>>>> origin/develop
            </Dialog>
        </main>
    );
}

// Componente para el modal de detalles con galería moderna
<<<<<<< HEAD
function AutoDetailModal({ auto, marcas, imagenes, navigate, usuarioActual }: { auto: AutoItem, marcas: any[], imagenes: any[], navigate: any, usuarioActual: any }) {
=======
function AutoDetailModal({ auto, marcas, imagenes, navigate }: { auto: AutoItem, marcas: any[], imagenes: any[], navigate: any }) {
>>>>>>> origin/develop
    const [imagenSeleccionada, setImagenSeleccionada] = useState<any>(null);
    const imagenesAuto = imagenes.filter(img => Number(img.idAuto) === Number(auto.id));
    
    useEffect(() => {
        // Seleccionar la imagen principal por defecto, o la primera si no hay principal
        const principal = imagenesAuto.find(img => img.esPrincipal === 'true' || img.esPrincipal === true);
        setImagenSeleccionada(principal || imagenesAuto[0] || null);
    }, [auto.id]);

    const marca = marcas.find(m => m.id === auto.idMarca)?.nombre || 'N/A';

    const handlePreguntar = () => {
<<<<<<< HEAD
        // Verificar si el usuario actual es el mismo que el vendedor del auto
        if (usuarioActual?.id === auto.idVendedor) {
            // Mostrar notificación de que es su propio vehículo
            Notification.show('Este vehículo en venta es tuyo, no puedes enviarte un mensaje a ti mismo.', { 
                duration: 4000, 
                position: 'top-center', 
                theme: 'contrast' 
            });
            return;
        }

        // Navegar al chat con el vendedor del auto
        navigate('/MensajeView', { 
            state: { 
                iniciarChatCon: auto.idVendedor,
=======
        // Navegar al chat con información del auto
        navigate('/mensaje', { 
            state: { 
>>>>>>> origin/develop
                autoInfo: {
                    modelo: auto.modelo,
                    marca: marca,
                    anio: auto.anio,
                    precio: auto.precio,
<<<<<<< HEAD
                    id: auto.id,
                    idVendedor: auto.idVendedor
=======
                    id: auto.id
>>>>>>> origin/develop
                }
            }
        });
    };

    const handleVenta = () => {
        // Navegar a la vista de ventas con el auto preseleccionado
        navigate('/venta-list', { 
            state: { 
                autoSeleccionado: auto
            }
        });
    };

    return (
        <div className="auto-modal-gallery">
            {/* Galería de fotos */}
            <div className="auto-gallery-main">
                {imagenesAuto.length > 0 ? (
                    <>
                        {/* Imagen principal */}
                        <img 
                            src={imagenSeleccionada?.url || imagenesAuto[0]?.url} 
                            alt={imagenSeleccionada?.descripcion || 'Auto'} 
                            className="auto-gallery-main-image"
                        />
                        
                        {/* Miniaturas */}
                        <div className="auto-gallery-thumbnails">
                            {imagenesAuto.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.url}
                                    alt={img.descripcion}
                                    className={`auto-gallery-thumbnail ${imagenSeleccionada?.id === img.id ? 'active' : ''}`}
                                    onClick={() => setImagenSeleccionada(img)}
                                />
                            ))}
                        </div>
                        
                        {/* Descripción de imagen seleccionada */}
                        {imagenSeleccionada?.descripcion && (
                            <div className="auto-gallery-image-description">
                                {imagenSeleccionada.descripcion}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="auto-gallery-no-images">
                        <span className="auto-gallery-no-images-icon">🚗</span>
                        <div className="auto-gallery-no-images-title">Sin imágenes</div>
                        <div className="auto-gallery-no-images-subtitle">No hay imágenes disponibles para este auto</div>
                    </div>
                )}
            </div>

            {/* Detalles del auto */}
            <div className="auto-modal-details">
                {/* Información básica */}
                <div className="auto-modal-section">
                    <h3>Información General</h3>
                    <div className="auto-modal-info-grid">
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Modelo</span>
                            <span className="auto-modal-info-value">{auto.modelo}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Año</span>
                            <span className="auto-modal-info-value">{auto.anio}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Marca</span>
                            <span className="auto-modal-info-value">{marca}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Categoría</span>
                            <span className="auto-modal-badge">{auto.categoria}</span>
                        </div>
                    </div>
                </div>

                {/* Precio */}
                <div className="auto-modal-section">
                    <h3>Precio</h3>
                    <div className="auto-modal-price">${Number(auto.precio).toLocaleString()}</div>
                </div>

                {/* Especificaciones */}
                <div className="auto-modal-section">
                    <h3>Especificaciones</h3>
                    <div className="auto-modal-info-grid">
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Kilometraje</span>
                            <span className="auto-modal-info-value">{Number(auto.kilometraje).toLocaleString()} km</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Color</span>
                            <span className="auto-modal-info-value">{auto.color}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Puertas</span>
                            <span className="auto-modal-info-value">{auto.puertas}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Combustible</span>
                            <span className="auto-modal-badge combustible">{auto.tipoCombustible}</span>
                        </div>
                    </div>
                </div>

                {/* Ubicación e identificación */}
                <div className="auto-modal-section">
                    <h3>Ubicación e Identificación</h3>
                    <div className="auto-modal-info-grid">
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Ciudad</span>
                            <span className="auto-modal-info-value">{auto.ciudad}</span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Matrícula</span>
                            <span className="auto-modal-info-value">{auto.matricula}</span>
                        </div>
                        <div className="auto-modal-info-item full-width">
                            <span className="auto-modal-info-label">VIN</span>
                            <span className="auto-modal-info-value monospace">{auto.codigoVIN}</span>
                        </div>
                    </div>
                </div>

                {/* Estado y fecha */}
                <div className="auto-modal-section">
                    <h3>Estado</h3>
                    <div className="auto-modal-info-grid">
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Disponibilidad</span>
                            <span className={`auto-modal-badge ${auto.estaDisponible ? 'disponible' : 'no-disponible'}`}>
                                {auto.estaDisponible ? '✓ Disponible' : '✗ No disponible'}
                            </span>
                        </div>
                        <div className="auto-modal-info-item">
                            <span className="auto-modal-info-label">Fecha Registro</span>
                            <span className="auto-modal-info-value">{auto.fechaRegistro}</span>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                {auto.descripcion && (
                    <div className="auto-modal-section">
                        <h3>Descripción</h3>
                        <div className="auto-modal-description">
                            {auto.descripcion}
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="auto-modal-section">
                    <div className="flex gap-3 justify-center mt-4">
                        <Button 
                            onClick={handlePreguntar}
                            theme="primary"
                            className="auto-btn-chat"
                        >
                            💬 Preguntar
                        </Button>
                        <Button 
                            onClick={handleVenta}
                            theme="success primary"
                            className="auto-btn-venta"
                        >
                            🏷️ Venta
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

<<<<<<< HEAD
function AutoCard({ auto, marcas, imagenes, setDialogOpened, setModoEdicion, setAutoEditar, abrirDetalleAuto, usuarioActual, isAdmin, mostrarSoloMios }: any) {
=======
function AutoCard({ auto, marcas, imagenes, setDialogOpened, setModoEdicion, setAutoEditar, abrirDetalleAuto, modoUsuario, usuarioActual, isAdmin }: any) {
>>>>>>> origin/develop
    const marca = marcas.find((m: any) => m.id === Number(auto.idMarca))?.nombre || auto.idMarca;
    
    // Buscar imágenes de este auto
    const imagenesDelAuto = imagenes.filter((img: any) => Number(img.idAuto) === Number(auto.id));
    
    // Buscar la imagen principal con detección mejorada
    const imagenPrincipal = imagenesDelAuto.find((img: any) => {
        // Manejar diferentes tipos de valores para esPrincipal
        const esPrincipal = img.esPrincipal === 'true' || 
                           img.esPrincipal === true || 
                           img.esPrincipal === 1 || 
                           img.esPrincipal === '1';
        
        return esPrincipal;
    });
    
    // Si no hay imagen principal, usar la primera imagen del auto
    const imagenMostrar = imagenPrincipal || imagenesDelAuto[0];
    
    const handleAgregarFavorito = async (idAuto: number) => {
        try {
            await FavoritoService.create(
                new Date().toISOString().split('T')[0],
                idAuto,
                1
            );
            Notification.show('Agregado a favoritos', { duration: 2000, position: 'top-center', theme: 'success' });
        } catch (error: any) {
            Notification.show('Error al agregar a favoritos', { duration: 3000, position: 'top-center', theme: 'error' });
        }
    };

    const handleClickTarjeta = (e: React.MouseEvent) => {
        // Evitar que el click en botones abra el modal
        if ((e.target as HTMLElement).closest('vaadin-button')) {
            return;
        }
        abrirDetalleAuto(auto);
    };

    return (
        <div 
            className="card-bordered auto-card-uniform auto-card-spacing flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card w-full mx-auto relative cursor-pointer"
            onClick={handleClickTarjeta}
        >
            {/* Botón de favoritos en esquina superior derecha */}
            <Button
                theme="primary"
                className="favorito-button-circular"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAgregarFavorito(auto.id);
                }}
            >
                <span className="favorito-button-icon">❤️</span>
            </Button>
            
            <div className="card-image-container-400x300 mb-3 flex flex-row gap-2 overflow-x-auto">
                {imagenMostrar ? (
                    <img src={imagenMostrar.url} alt={auto.modelo} className="card-image-400x300 object-cover rounded-t-lg" />
                ) : (
                    <div className="card-image-400x300 flex items-center justify-center bg-muted rounded-t-lg text-muted-foreground text-4xl">
                        <span role="img" aria-label="Sin imagen">🚗</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-grow px-4 pb-4 gap-2 items-center text-center">
                <div className="font-headline text-lg mb-0.5 break-words flex flex-col items-center gap-1 w-full">
                    <span>{auto.modelo}</span>
                    <span className="auto-badge-category whitespace-nowrap mt-0.5">{auto.categoria}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">Año {auto.anio}</div>
                <div className="auto-price-highlight mb-1">${Number(auto.precio).toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-2 w-full">
                    <div className="flex items-center gap-1.5 justify-center">
                        <span className="font-semibold">KM:</span> {Number(auto.kilometraje).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                        <span className="font-semibold">Color:</span> {auto.color}
                    </div>
                </div>
                <span className="auto-badge-fuel mb-2 w-max">{auto.tipoCombustible}</span>
                <div className="text-xs text-muted-foreground truncate w-full">Matrícula: {auto.matricula}</div>
                <div className="flex gap-2 mt-2 justify-center">
<<<<<<< HEAD
                    {/* Botón Editar para admin o para user en 'Mis autos' */}
                    {isAdmin || (mostrarSoloMios && Number(auto.idVendedor) === Number(usuarioActual?.id)) ? (
=======
                    {/* Botones para Administrador - ve todos los controles */}
                    {isAdmin && (
>>>>>>> origin/develop
                        <Button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDialogOpened(true); 
                                setModoEdicion(true); 
                                setAutoEditar(auto);
                            }}
                            className="auto-btn-primary"
                        >
                            Editar
                        </Button>
<<<<<<< HEAD
                    ) : null}
                    {/* Botón para agregar a favoritos eliminado */}
=======
                    )}
                    
                    {/* Botones para Vendedor - solo puede editar sus propios autos */}
                    {modoUsuario === 'vendedor' && !isAdmin && Number(auto.idVendedor) === Number(usuarioActual?.id) && (
                        <Button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setDialogOpened(true); 
                                setModoEdicion(true); 
                                setAutoEditar(auto);
                            }}
                            className="auto-btn-primary"
                        >
                            Editar
                        </Button>
                    )}
                    
                    {/* Botón para Comprador - agregar a favoritos */}
                    {modoUsuario === 'comprador' && !isAdmin && (
                        <Button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAgregarFavorito(auto.id);
                            }}
                            className="auto-btn-success"
                            theme="primary"
                        >
                            ❤️ Favorito
                        </Button>
                    )}
                    
                    {/* Si es vendedor pero no es su auto, mostrar info */}
                    {modoUsuario === 'vendedor' && !isAdmin && Number(auto.idVendedor) !== Number(usuarioActual?.id) && (
                        <span className="text-xs text-gray-500 italic">Auto de otro vendedor</span>
                    )}
>>>>>>> origin/develop
                </div>
            </div>
        </div>
    );
}