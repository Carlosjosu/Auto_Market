import React, { useState, useEffect, useRef, useCallback, Component } from "react";
import { MessageInput } from "@vaadin/react-components/MessageInput";
import { Avatar } from "@vaadin/react-components/Avatar";
import { Notification } from "@vaadin/react-components/Notification";
import { Button } from "@vaadin/react-components/Button";
import { Tabs } from "@vaadin/react-components/Tabs";
import { Tab } from "@vaadin/react-components/Tab";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import "../themes/default/mensaje-view.css";
import { useLocation } from 'react-router-dom';
import { useAuth } from 'Frontend/security/auth';

// Services usando LinkedList y grafos
import { MensajeService } from "Frontend/generated/endpoints";
import { ConversacionService } from "Frontend/generated/endpoints";  
import { UsuarioService } from "Frontend/generated/endpoints";
import { CuentaService } from "Frontend/generated/endpoints";

// Configuración del menú con ícono
export const config: ViewConfig = {
  menu: {
    order: 8,
    icon: "vaadin:chat",
    title: "Mensajes"
  },
};

// ErrorBoundary para capturar errores de React
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20, textAlign: 'center'}}>
          <h2>Algo salió mal</h2>
          <p>Ha ocurrido un error. Por favor, recarga la página.</p>
          <button onClick={() => window.location.reload()}>Recargar</button>
        </div>
      );
    }

    return this.props.children;
  }
}

class NodoUsuario {
  usuario: any;
  siguiente: NodoUsuario | null;

  constructor(usuario: any) {
    this.usuario = usuario;
    this.siguiente = null;
  }
}

class LinkedListUsuarios {
  cabeza: NodoUsuario | null;
  tamaño: number;

  constructor() {
    this.cabeza = null;
    this.tamaño = 0;
  }

  agregar(usuario: any) {
    const nuevoNodo = new NodoUsuario(usuario);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
    this.tamaño++;
  }

  buscarPorId(id: number): any | null {
    let actual = this.cabeza;
    while (actual) {
      if (actual.usuario.id === id) {
        return actual.usuario;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  buscarPorTexto(texto: string): any[] {
    const resultados: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      if (actual.usuario.nombre && actual.usuario.nombre.toLowerCase().includes(texto.toLowerCase())) {
        resultados.push(actual.usuario);
      } else if (actual.usuario.correo && actual.usuario.correo.toLowerCase().includes(texto.toLowerCase())) {
        resultados.push(actual.usuario);
      }
      actual = actual.siguiente;
    }
    return resultados;
  }

  obtenerTodos(): any[] {
    const usuarios: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      usuarios.push(actual.usuario);
      actual = actual.siguiente;
    }
    return usuarios;
  }

  obtenerTamaño(): number {
    return this.tamaño;
  }

  limpiar() {
    this.cabeza = null;
    this.tamaño = 0;
  }
}

class NodoChat {
  chat: any;
  siguiente: NodoChat | null;

  constructor(chat: any) {
    this.chat = chat;
    this.siguiente = null;
  }
}

class LinkedListChats {
  cabeza: NodoChat | null;
  tamaño: number;

  constructor() {
    this.cabeza = null;
    this.tamaño = 0;
  }

  agregar(chat: any) {
    const nuevoNodo = new NodoChat(chat);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
    this.tamaño++;
  }

  buscarPorUsuario(idUsuario: number): any | null {
    let actual = this.cabeza;
    while (actual) {
      if (actual.chat.otroUsuario && actual.chat.otroUsuario.id === idUsuario) {
        return actual.chat;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  existeUsuario(idUsuario: number): boolean {
    return this.buscarPorUsuario(idUsuario) !== null;
  }

  buscarPorTexto(texto: string): any[] {
    const resultados: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      if (actual.chat.otroUsuario?.nombre?.toLowerCase().includes(texto.toLowerCase()) ||
          actual.chat.ultimoMensaje?.toLowerCase().includes(texto.toLowerCase())) {
        resultados.push(actual.chat);
      }
      actual = actual.siguiente;
    }
    return resultados;
  }

  obtenerTodos(): any[] {
    const chats: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      chats.push(actual.chat);
      actual = actual.siguiente;
    }
    return chats;
  }

  obtenerTamaño(): number {
    return this.tamaño;
  }

  limpiar() {
    this.cabeza = null;
    this.tamaño = 0;
  }
}

class NodoMensaje {
  mensaje: any;
  siguiente: NodoMensaje | null;

  constructor(mensaje: any) {
    this.mensaje = mensaje;
    this.siguiente = null;
  }
}

class LinkedListMensajes {
  cabeza: NodoMensaje | null;
  tamaño: number;

  constructor() {
    this.cabeza = null;
    this.tamaño = 0;
  }

  agregar(mensaje: any) {
    const nuevoNodo = new NodoMensaje(mensaje);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
    this.tamaño++;
  }

  obtenerTodos(): any[] {
    const mensajes: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      mensajes.push(actual.mensaje);
      actual = actual.siguiente;
    }
    return mensajes;
  }

  obtenerTamaño(): number {
    return this.tamaño;
  }

  limpiar() {
    this.cabeza = null;
    this.tamaño = 0; 
  }

  buscarPorTexto(texto: string): any[] {
    const resultados: any[] = [];
    let actual = this.cabeza;
    while (actual) {
      if (actual.mensaje.contenido && 
          actual.mensaje.contenido.toLowerCase().includes(texto.toLowerCase())) {
        resultados.push(actual.mensaje);
      }
      actual = actual.siguiente;
    }
    return resultados;
  }
}

const MensajesView: React.FC = () => {
  return (
    <ErrorBoundary>
      <MensajesViewContent />
    </ErrorBoundary>
  );
};

const MensajesViewContent: React.FC = () => {
  const location = useLocation();
  const { state } = useAuth(); // Obtener el estado de autenticación
  
  // LinkedLists en lugar de arrays
  const [usuarios] = useState<LinkedListUsuarios>(new LinkedListUsuarios());
  const [misChats] = useState<LinkedListChats>(new LinkedListChats());
  const [mensajes] = useState<LinkedListMensajes>(new LinkedListMensajes());
  
  // Estados principales
  const [usuarioActual, setUsuarioActual] = useState<any>(null);
  const [cargandoSesion, setCargandoSesion] = useState<boolean>(true);
  const [usuarioDestino, setUsuarioDestino] = useState<any | null>(null);
  const [conversacion, setConversacion] = useState<any>(null);
  
  // Estados para navegación
  const [seccionActiva, setSeccionActiva] = useState<'mis-chats' | 'explorar'>('mis-chats');
  const [usuariosConectados, setUsuariosConectados] = useState<number[]>([]);
  
  // Estados para funcionalidad
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [actualizarUI, setActualizarUI] = useState<number>(0);
  const [inicializado, setInicializado] = useState<boolean>(false);
  const [mensajeInicialEnviado, setMensajeInicialEnviado] = useState<boolean>(false);
  
  // ID del usuario actual desde el sistema de autenticación
  const usuarioIdActual = state.user?.credentials || 2; // Fallback a 2 si no hay credenciales
  
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Función para forzar re-render
  const forzarActualizacion = () => {
    setActualizarUI(prev => prev + 1);
  };

  // Función para formatear fechas
  const formatearFecha = useCallback((fechaString: string) => {
    try {
      if (!fechaString) return '';
      
      let fecha: Date = new Date(fechaString);
      
      if (isNaN(fecha.getTime())) {
        return fechaString;
      }
      
      const ahora = new Date();
      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const fechaMensaje = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      
      const hora = fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      if (fechaMensaje.getTime() === hoy.getTime()) {
        return hora;
      } else {
        const dia = fecha.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        return dia;
      }
    } catch (error) {
      return fechaString;
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    if (cargando) return;
    
    try {
      setCargando(true);
      const usuariosData = await UsuarioService.listUsuario();
      const cuentasData = await CuentaService.listCuenta();
      
      usuarios.limpiar();
      
      if (usuariosData) {
        for (let i = 0; i < usuariosData.length; i++) {
          const u = usuariosData[i];
          if (u && typeof u.id === 'string') {
            // Buscar cuenta asociada
            const cuenta = Array.isArray(cuentasData) ? 
              cuentasData.find(c => c.id === u.idCuenta) : undefined;
            
            const usuarioFormateado = {
              id: parseInt(u.id) || 0,
              nombre: u.nombre || (cuenta?.correo && typeof cuenta.correo === 'string' ? cuenta.correo.split('@')[0] : '') || u.nickname || `Usuario ${u.id}`,
              nickname: u.nickname,
              apellido: u.apellido,
              telefono: u.telefono,
              correo: cuenta?.correo || u.correo || 'sin-correo@example.com',
              idCuenta: u.idCuenta
            };
            usuarios.agregar(usuarioFormateado);
          }
        }
      }
      
      forzarActualizacion();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setNotificacion('Error cargando usuarios');
    } finally {
      setCargando(false);
    }
  }, []);


  const cargarMisChats = useCallback(async () => {
    if (cargando || !usuarioActual?.id) return; 
    try {
      setCargando(true);
      if (usuarios.obtenerTamaño() === 0) {
        await cargarUsuarios();
      }
      
      const conversaciones = await ConversacionService.obtenerConversacionesPorUsuario(usuarioActual.id);
      
      // Limpiar de forma segura
      if (misChats && typeof misChats.limpiar === 'function') {
        misChats.limpiar();
      }
      const usuariosYaProcesados = new Set<number>(); // Para evitar duplicados
      
      if (conversaciones) {
        for (let i = 0; i < conversaciones.length; i++) {
          const conv = conversaciones[i];
          try {
            if (!conv || !conv.idEmisor || !conv.idReceptor) {
              continue;
            }
            const idEmisor = parseInt(conv.idEmisor ?? "0");
            const idReceptor = parseInt(conv.idReceptor ?? "0");
            const idOtroUsuario = idEmisor === usuarioActual.id 
              ? idReceptor 
              : idEmisor;
            
            // Filtrar conversaciones del usuario consigo mismo (LB hablando con LB)
            if (idOtroUsuario === usuarioActual.id) {
              console.log('Ignorando conversación del usuario consigo mismo:', usuarioActual.id);
              continue;
            }
            
            // Saltar si ya procesamos este usuario
            if (usuariosYaProcesados.has(idOtroUsuario)) {
              continue;
            }
            usuariosYaProcesados.add(idOtroUsuario);
            
            let otroUsuario = usuarios.buscarPorId(idOtroUsuario);
            
            if (!otroUsuario) {
              try {
                const usuarioData = await UsuarioService.getUsuario(idOtroUsuario);
                if (usuarioData) {
                  // Buscar cuenta asociada para el usuario individual
                  const cuentasData = await CuentaService.listCuenta();
                  const cuenta = Array.isArray(cuentasData) ? 
                    cuentasData.find(c => c.id === usuarioData.idCuenta) : undefined;
                  
                  otroUsuario = {
                    id: parseInt(usuarioData.id ?? "0"),
                    nombre: usuarioData.nombre || (cuenta?.correo && typeof cuenta.correo === 'string' ? cuenta.correo.split('@')[0] : '') || usuarioData.nickname || `Usuario ${idOtroUsuario}`,
                    nickname: usuarioData.nickname,
                    apellido: usuarioData.apellido,
                    telefono: usuarioData.telefono,
                    correo: cuenta?.correo || usuarioData.correo || 'sin-correo@example.com',
                    idCuenta: usuarioData.idCuenta
                  };
                  usuarios.agregar(otroUsuario);
                }
              } catch (error) {
                console.warn(`No se pudo cargar usuario ${idOtroUsuario}:`, error);
              }
            }
            
            // Obtener todos los mensajes de esta conversación para estadísticas
            const ultimosMensajes = await MensajeService.obtenerMensajesPorConversacion(parseInt(conv.id ?? "0")) || [];
            const ultimoMensaje = ultimosMensajes.length > 0 ? ultimosMensajes[ultimosMensajes.length - 1] : null;
            
            console.log(`Procesando conversación con usuario ${idOtroUsuario} (${otroUsuario?.nombre}): ${ultimosMensajes.length} mensajes`);
            
            // Solo agregar el chat si tiene mensajes (conversación real iniciada)
            if (ultimosMensajes.length > 0) {
              const chat = {
                ...conv,
                id: conv.id || Math.random().toString(36),
                otroUsuario: otroUsuario || { 
                  id: idOtroUsuario, 
                  nombre: `Usuario ${idOtroUsuario}` 
                },
                ultimoMensaje: ultimoMensaje?.contenido || 'Sin mensajes',
                fechaUltimoMensaje: ultimoMensaje?.fechaEnvio || conv.fechaInicio,
                totalMensajes: ultimosMensajes.length
              };
              
              console.log('Agregando chat:', chat.otroUsuario?.nombre, 'mensajes:', chat.totalMensajes);
              misChats.agregar(chat);
            } else {
              console.log(`No se agregó chat con ${otroUsuario?.nombre} porque no tiene mensajes`);
            }
          } catch (error) {
            console.error('Error procesando conversación:', error);
          }
        }
      }
      
      console.log('Total de chats cargados:', misChats.obtenerTamaño());
      forzarActualizacion();
    } catch (error) {
      console.error('Error cargando mis chats:', error);
    } finally {
      setCargando(false);
    }
  }, [usuarioActual?.id]); 

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    if (!usuarioActual?.id) return; 
    
    try {
      const statsMensajes = await MensajeService.obtenerEstadisticas(usuarioActual.id).catch(() => ({}));
      const statsConversaciones = await ConversacionService.obtenerEstadisticas(usuarioActual.id).catch(() => ({}));
      
      setEstadisticas({
        ...statsMensajes,
        ...statsConversaciones
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setEstadisticas({});
    }
  }, [usuarioActual?.id]); 

  // Cargar usuarios conectados
  const cargarUsuariosConectados = useCallback(async () => {
    if (!usuarioActual?.id) return;
    
    try {
      const conectados = await ConversacionService.obtenerUsuariosConectados(usuarioActual.id);
      setUsuariosConectados((conectados || []).filter((id: any) => typeof id === "number"));
    } catch (error) {
      console.error('Error cargando usuarios conectados:', error);
      setUsuariosConectados([]);
    }
  }, [usuarioActual?.id]); 

  // Cargar mensajes usando LinkedList
  const cargarMensajes = useCallback(async (idConversacion: number) => {
    if (!idConversacion) return;
    
    try {
      const mensajesData = await MensajeService.obtenerMensajesOrdenados(idConversacion, true);
      
      mensajes.limpiar();
      
      if (mensajesData) {
        for (let i = 0; i < mensajesData.length; i++) {
          const m = mensajesData[i];
          if (!m) continue;
          const mensajeConId = {
            ...m,
            id: m.id || `temp-${i}-${Date.now()}`,
            key: `msg-${m.id || i}-${idConversacion}`
          };
          mensajes.agregar(mensajeConId);
        }
      }
      
      forzarActualizacion();
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      mensajes.limpiar();
      forzarActualizacion();
    }
  }, [mensajes]);

  // Seleccionar conversación
  const seleccionarConversacion = useCallback(async (usuario: any) => {
    if (!usuario || !usuario.id || !usuarioActual?.id) return;
    
    try {
      setUsuarioDestino(usuario);
      mensajes.limpiar();
      forzarActualizacion();
      
      const conv = await ConversacionService.crearOBuscarConversacion(
        usuarioActual.id, 
        usuario.id, 
        null
      );
      
      if (conv && conv.id) {
        setConversacion(conv);
        await cargarMensajes(parseInt(conv.id));
        
        // Siempre actualizar las listas cuando se selecciona una conversación
        setTimeout(() => {
          cargarMisChats();
          cargarUsuariosConectados();
          forzarActualizacion();
        }, 1000);
      }
    } catch (error) {
      console.error('Error seleccionando conversación:', error);
      setNotificacion('Error al acceder a la conversación');
    }
  }, [usuarioActual?.id, cargarMensajes, cargarMisChats, cargarUsuariosConectados]);

  // Enviar mensaje
  const enviarMensaje = useCallback(async (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (!conversacion || !contenido?.trim() || !usuarioActual?.id) return;

    try {
      const nuevoMensaje = {
        idConversacion: parseInt(conversacion.id),
        idRemitente: usuarioActual.id,
        contenido: contenido.trim(),
        fechaEnvio: new Date().toISOString()
      };

      const resultado = await MensajeService.agregarMensaje(nuevoMensaje);
      
      if (resultado?.estado === 'success') {
        setNotificacion("Mensaje enviado");
        setTimeout(() => {
          cargarMensajes(parseInt(conversacion.id));
          cargarMisChats(); // Esto actualiza la lista de chats
          forzarActualizacion(); // Fuerza el re-render para actualizar explorar
        }, 500);
      } else {
        setNotificacion("Error al enviar mensaje");
      }
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setNotificacion('Error al enviar mensaje');
    }
  }, [conversacion, usuarioActual?.id, cargarMensajes, cargarMisChats]);

  // Buscar mensajes
  const buscarMensajes = useCallback(async (texto: string) => {
    setBusqueda(texto);
    
    if (!texto.trim()) {
      if (conversacion) {
        cargarMensajes(parseInt(conversacion.id));
      }
      return;
    }

    try {
      const resultados = await MensajeService.buscarMensajes(texto);
      mensajes.limpiar();
      
      if (resultados) {
        for (let i = 0; i < resultados.length; i++) {
          mensajes.agregar(resultados[i]);
        }
      }
      
      forzarActualizacion();
      setNotificacion(`${resultados?.length || 0} mensajes encontrados`);
    } catch (error) {
      console.error('Error buscando mensajes:', error);
    }
  }, [conversacion]);

  const iniciarChatConUsuario = useCallback(async (usuarioId: number, contexto?: any) => {
    if (!usuarioActual?.id) { 
      console.error('Usuario actual no está cargado');
      setNotificacion('Error: Usuario no está logueado');
      return;
    }
    
    try {
      let usuario = usuarios.buscarPorId(usuarioId);
      
      // Si no está en la lista, intentar cargarlo individualmente
      if (!usuario) {
        try {
          const usuarioData = await UsuarioService.getUsuario(usuarioId);
          if (usuarioData) {
            // Buscar cuenta asociada
            const cuentasData = await CuentaService.listCuenta();
            const cuenta = Array.isArray(cuentasData) ? 
              cuentasData.find(c => c.id === usuarioData.idCuenta) : undefined;
            
            usuario = {
              id: parseInt(usuarioData.id ?? "0"),
              nombre: usuarioData.nombre || (cuenta?.correo && typeof cuenta.correo === 'string' ? cuenta.correo.split('@')[0] : '') || usuarioData.nickname || `Usuario ${usuarioId}`,
              nickname: usuarioData.nickname,
              apellido: usuarioData.apellido,
              telefono: usuarioData.telefono,
              correo: cuenta?.correo || usuarioData.correo || 'sin-correo@example.com',
              idCuenta: usuarioData.idCuenta
            };
            usuarios.agregar(usuario);
            forzarActualizacion();
          }
        } catch (error) {
          console.error(`Error cargando usuario ${usuarioId}:`, error);
          setNotificacion(`No se pudo cargar el usuario`);
          return;
        }
      }

      if (!usuario) {
        setNotificacion(`Usuario no encontrado`);
        return;
      }

      // Primero crear/buscar conversación
      const conversacionExistente = await ConversacionService.crearOBuscarConversacion(
        usuarioActual.id, 
        usuarioId, 
        null
      );

      if (conversacionExistente?.id) {
        // Cargar la conversación
        setConversacion(conversacionExistente);
        setUsuarioDestino(usuario);
        await cargarMensajes(parseInt(conversacionExistente.id));
        
        // Si hay contexto autoInfo, SIEMPRE enviar el mensaje (sin importar si la conversación existe)
        if (contexto?.autoInfo) {
          // Construir el nombre del vehículo evitando duplicación de marca
          const nombreVehiculo = contexto.autoInfo.modelo.toLowerCase().includes(contexto.autoInfo.marca.toLowerCase()) 
            ? contexto.autoInfo.modelo 
            : `${contexto.autoInfo.marca} ${contexto.autoInfo.modelo}`;
            
          const mensajeInicial = `Hola! Me interesa el auto ${nombreVehiculo} ${contexto.autoInfo.anio} por $${contexto.autoInfo.precio}. ¿Podrías darme más información?`;
          
          const nuevoMensaje = {
            idConversacion: parseInt(conversacionExistente.id),
            idRemitente: usuarioActual.id,
            contenido: mensajeInicial,
            fechaEnvio: new Date().toISOString()
          };

          try {
            const resultado = await MensajeService.agregarMensaje(nuevoMensaje);
            
            if (resultado?.estado === 'success') {
              setNotificacion(`Mensaje enviado a ${usuario.nombre}`);
              // Recargar mensajes después de enviar
              setTimeout(() => {
                cargarMensajes(parseInt(conversacionExistente.id));
                cargarMisChats();
              }, 500);
            }
          } catch (error) {
            console.error('Error enviando mensaje inicial:', error);
            setNotificacion('Error al enviar mensaje inicial');
          }
        } else {
          setNotificacion(`Continuando chat con ${usuario.nombre}`);
        }
      } else {
        // Si no existe, crear nueva conversación
        await seleccionarConversacion(usuario);
        setNotificacion(`Iniciando nuevo chat con ${usuario.nombre}`);
      }

    } catch (error) {
      console.error('Error iniciando chat con usuario:', error);
      setNotificacion('Error al iniciar el chat');
    }
  }, [usuarioActual?.id, seleccionarConversacion, cargarMensajes, cargarMisChats]);

  const obtenerUsuarioActual = useCallback(async () => {
    try {
      setCargandoSesion(true);
      
      // Obtener todos los usuarios desde Usuario.json
      const usuarios = await UsuarioService.listUsuario();
      
      // Usar el ID del usuario desde el sistema de autenticación
      const idUsuario = usuarioIdActual;
  
      const usuarioEncontrado = Array.isArray(usuarios) ? 
        usuarios.find(u => parseInt(u.id) === idUsuario) : undefined;
      
      if (usuarioEncontrado) {
        // Obtener correo desde Cuenta.json
        const cuentas = await CuentaService.listCuenta();
        const cuenta = Array.isArray(cuentas) ? 
          cuentas.find(c => c.id === usuarioEncontrado.idCuenta) : undefined;
        
        setUsuarioActual({
          id: parseInt(String(usuarioEncontrado.id)),
          nombre: usuarioEncontrado.nombre || usuarioEncontrado.nickname || (cuenta?.correo && typeof cuenta.correo === 'string' ? cuenta.correo.split('@')[0] : '') || 'Usuario',
          correo: cuenta?.correo || 'sin-correo@gmail.com',
          nickname: usuarioEncontrado.nickname, 
          apellido: usuarioEncontrado.apellido, 
          telefono: usuarioEncontrado.telefono, 
          cedula: usuarioEncontrado.cedula,
          idCuenta: usuarioEncontrado.idCuenta
        });
      } else {
        // Usuario por defecto si no se encuentra - intentar obtener datos de la cuenta
        try {
          const cuentas = await CuentaService.listCuenta();
          const cuentaActual = Array.isArray(cuentas) ? 
            cuentas.find(c => c.id === usuarioIdActual) : undefined;
          
          setUsuarioActual({
            id: usuarioIdActual,
            nombre: cuentaActual?.correo && typeof cuentaActual.correo === 'string' ? cuentaActual.correo.split('@')[0] : "Usuario",
            correo: cuentaActual?.correo || "usuario@gmail.com",
            nickname: "user"
          });
        } catch (error) {
          // Fallback final
          setUsuarioActual({
            id: usuarioIdActual,
            nombre: "Usuario",
            correo: "usuario@gmail.com",
            nickname: "user"
          });
        }
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      // Usuario por defecto si falla - intentar al menos obtener el correo
      try {
        const cuentas = await CuentaService.listCuenta();
        const cuentaActual = Array.isArray(cuentas) ? 
          cuentas.find(c => c.id === usuarioIdActual) : undefined;
        
        setUsuarioActual({
          id: usuarioIdActual,
          nombre: cuentaActual?.correo && typeof cuentaActual.correo === 'string' ? cuentaActual.correo.split('@')[0] : "Usuario",
          correo: cuentaActual?.correo || "usuario@gmail.com",
          nickname: "user"
        });
      } catch (finalError) {
        // Fallback absoluto
        setUsuarioActual({
          id: usuarioIdActual,
          nombre: "Usuario",
          correo: "usuario@gmail.com",
          nickname: "user"
        });
      }
    } finally {
      // Siempre establecer cargandoSesion a false al final
      setCargandoSesion(false);
    }
  }, [usuarioIdActual]);

  useEffect(() => {
    obtenerUsuarioActual();
  }, [obtenerUsuarioActual]);

  // Limpiar y reiniciar estado cuando cambien las credenciales del usuario
  useEffect(() => {
    // Si el usuario ID cambió, limpiar todo el estado previo
    if (usuarioActual && usuarioActual.id !== usuarioIdActual) {
      console.log('Usuario cambió, limpiando estado previo');
      
      // Limpiar datos del usuario anterior de forma segura
      setTimeout(() => {
        usuarios.limpiar();
        misChats.limpiar();
        mensajes.limpiar();
        setUsuarioDestino(null);
        setConversacion(null);
        setBusqueda("");
        setEstadisticas(null);
        setUsuariosConectados([]);
        setInicializado(false);
        setMensajeInicialEnviado(false);
        
        // Recargar con el nuevo usuario después de limpiar
        obtenerUsuarioActual();
      }, 100);
    }
  }, [usuarioIdActual]); // Removemos obtenerUsuarioActual de las dependencias para evitar bucles

  useEffect(() => {
    if (usuarioActual && !cargandoSesion && !inicializado) {
      // Crear funciones estables para evitar bucles
      const cargarDatosIniciales = async () => {
        try {
          setInicializado(true);
          
          // Cargar usuarios primero
          if (usuarios.obtenerTamaño() === 0) {
            await cargarUsuarios();
          }
          
          // Luego cargar el resto de datos
          await Promise.all([
            cargarMisChats(),
            cargarEstadisticas(),
            cargarUsuariosConectados()
          ]);
        } catch (error) {
          console.error('Error cargando datos iniciales:', error);
        }
      };
      
      cargarDatosIniciales();
    }
  }, [usuarioActual, cargandoSesion, inicializado]);

  useEffect(() => {
    if (mensajes && typeof mensajes.obtenerTamaño === 'function' && mensajes.obtenerTamaño() > 0) {
      const timeoutId = setTimeout(() => {
        try {
          if (mensajesEndRef.current && 
              document.contains(mensajesEndRef.current) && 
              mensajesEndRef.current.parentNode) {
            mensajesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {
          console.warn('Error en scroll de mensajes:', error);
        }
      }, 150); // Incrementar tiempo para dar más margen
      
      return () => clearTimeout(timeoutId);
    }
  }, [mensajes, actualizarUI]);

  // Manejar redirección automática desde otras vistas (Auto.tsx)
  useEffect(() => {
    if (location.state?.iniciarChatCon && usuarioActual?.id && inicializado && !mensajeInicialEnviado) {
      const idVendedor = location.state.iniciarChatCon;
      const autoInfo = location.state.autoInfo;
      
      // Verificar que no sea el mismo usuario
      if (idVendedor === usuarioActual.id) {
        setNotificacion('No puedes enviarte un mensaje a ti mismo sobre tu propio vehículo');
        return;
      }

      // Marcar que se va a enviar el mensaje inicial
      setMensajeInicialEnviado(true);

      // Iniciar chat con el vendedor
      setTimeout(() => {
        iniciarChatConUsuario(idVendedor, { autoInfo });
      }, 1000);

      // Limpiar el state para evitar que se ejecute múltiples veces
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [usuarioActual?.id, inicializado, location.state, iniciarChatConUsuario, mensajeInicialEnviado]);

  const obtenerUsuariosParaExplorar = (): any[] => {
    if (!usuarioActual?.id) return []; // Retornar array vacío en lugar de undefined
    
    const todosUsuarios = usuarios.obtenerTodos();
    const usuariosParaExplorar: any[] = [];
    
    // Obtener IDs de usuarios con los que ya tengo conversaciones con mensajes
    const usuariosConConversacion = new Set<number>();
    const chatsExistentes = misChats.obtenerTodos();
    
    console.log('=== DEPURACIÓN EXPLORAR ===');
    console.log('Usuario actual:', usuarioActual.id, usuarioActual.nombre);
    console.log('Total usuarios registrados:', todosUsuarios.length);
    console.log('Chats existentes:', chatsExistentes.length);
    
    // Debug: ver qué chats existen
    chatsExistentes.forEach((chat, index) => {
      console.log(`Chat ${index + 1}:`, {
        otroUsuarioId: chat.otroUsuario?.id,
        otroUsuarioNombre: chat.otroUsuario?.nombre,
        totalMensajes: chat.totalMensajes,
        valido: chat.otroUsuario?.id && chat.totalMensajes > 0
      });
    });
    
    for (let i = 0; i < chatsExistentes.length; i++) {
      const chat = chatsExistentes[i];
      if (chat.otroUsuario?.id && chat.totalMensajes > 0 && chat.otroUsuario.id !== usuarioActual.id) {
        usuariosConConversacion.add(chat.otroUsuario.id);
        console.log('Agregando usuario con conversación:', chat.otroUsuario.id, chat.otroUsuario.nombre);
      }
    }
    
    console.log('Usuarios con conversación activa:', Array.from(usuariosConConversacion));
    
    for (let i = 0; i < todosUsuarios.length; i++) {
      const u = todosUsuarios[i];
      if (u.id === usuarioActual.id) {
        console.log('Saltando usuario actual:', u.id, u.nombre);
        continue; // Excluir al usuario actual
      }
      
      // Solo agregar usuarios con los que NO tengo conversaciones con mensajes
      if (!usuariosConConversacion.has(u.id)) {
        usuariosParaExplorar.push(u);
        console.log('Agregando para explorar:', u.id, u.nombre);
      } else {
        console.log('Excluyendo de explorar (tiene conversación):', u.id, u.nombre);
      }
    }
    
    console.log('Usuarios para explorar final:', usuariosParaExplorar.length);
    usuariosParaExplorar.forEach(u => console.log('- Para explorar:', u.id, u.nombre));
    console.log('=== FIN DEPURACIÓN ===');
    
    return usuariosParaExplorar;
  };

  const obtenerChatsFiltrados = (): any[] => {
    if (!busqueda) {
      return misChats.obtenerTodos();
    } else {
      return misChats.buscarPorTexto(busqueda);
    }
  };

  const obtenerUsuariosFiltradosParaExplorar = (): any[] => {
    const usuariosParaExplorar = obtenerUsuariosParaExplorar();
    
    if (!busqueda) {
      return usuariosParaExplorar;
    }
    
    const filtrados: any[] = [];
    for (let i = 0; i < usuariosParaExplorar.length; i++) {
      const u = usuariosParaExplorar[i];
      if (u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.correo?.toLowerCase().includes(busqueda.toLowerCase())) {
        filtrados.push(u);
      }
    }
    
    return filtrados;
  };

  if (cargandoSesion && !usuarioActual) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <div>Cargando usuario...</div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar mensaje diferente
  if (!usuarioActual) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <div>No hay usuario autenticado. Por favor, inicia sesión.</div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#111b21"
    }}>
      {/* Sidebar - FONDO BLANCO */}
      <div style={{
        width: 380,
        background: "#ffffff",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #ddd"
      }}>
        {/* Header */}
        <div style={{
          padding: 16, 
          borderBottom: "1px solid #ddd", 
          display: "flex", 
          alignItems: "center", 
          gap: 12,
          background: "#f5f5f5"
        }}>
          <Avatar name={usuarioActual.nombre} />
          <div>
            <div style={{fontWeight: 600, fontSize: 16, color: "#000"}}>{usuarioActual.nombre}</div>
            <div style={{fontSize: 12, color: "#666"}}>
              {usuariosConectados.length} conexiones activas
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div style={{padding: 12, borderBottom: "1px solid #ddd", fontSize: 12, color: "#666"}}>
            <div>Chats activos: {estadisticas.totalConversaciones || 0}</div>
            <div>Usuarios disponibles: {usuarios.obtenerTamaño() - 1}</div>
          </div>
        )}

        {/* Navegación */}
        <Tabs 
          selected={seccionActiva === 'mis-chats' ? 0 : 1}
          onSelectedChanged={e => {
            setSeccionActiva(e.detail.value === 0 ? 'mis-chats' : 'explorar');
            setUsuarioDestino(null);
            setConversacion(null);
            mensajes.limpiar();
            setBusqueda("");
            forzarActualizacion();
          }}
          style={{borderBottom: "1px solid #ddd", background: "#fff"}}
        >
          <Tab style={{color: "#000"}}>Mis Chats ({misChats.obtenerTamaño()})</Tab>
          <Tab style={{color: "#000"}}>Explorar ({obtenerUsuariosParaExplorar().length})</Tab>
        </Tabs>

        {/* Búsqueda */}
        <div style={{padding: 8, borderBottom: "1px solid #ddd"}}>
          <input
            type="text"
            placeholder={seccionActiva === 'mis-chats' ? "Buscar en conversaciones..." : "Buscar usuarios..."}
            value={busqueda}
            onChange={e => {
              const valor = e.target.value;
              setBusqueda(valor);
              if (seccionActiva === 'mis-chats' && conversacion) {
                buscarMensajes(valor);
              }
            }}
            style={{
              width: "100%",
              background: "#f9f9f9",
              border: "1px solid #ddd",
              color: "#000",
              padding: 8,
              borderRadius: 4
            }}
          />
        </div>

        {/* Lista */}
        <div style={{flex: 1, overflowY: "auto"}}>
          {seccionActiva === 'mis-chats' ? (
            // MIS CHATS
            misChats.obtenerTamaño() > 0 ? (
              obtenerChatsFiltrados().map((chat, index) => (
                <div
                  key={`chat-${chat.otroUsuario?.id || chat.id}-${usuarioActual?.id || ''}`}
                  onClick={() => seleccionarConversacion(chat.otroUsuario)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: usuarioDestino?.id === chat.otroUsuario?.id ? "#e3f2fd" : "transparent",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{position: "relative"}}>
                    <Avatar name={chat.otroUsuario?.nombre || 'Usuario'} />
                    {usuariosConectados.includes(chat.otroUsuario?.id) && (
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        background: "#4caf50",
                        borderRadius: "50%",
                        border: "2px solid #fff"
                      }} />
                    )}
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: 4
                    }}>
                      <div style={{fontWeight: 600, fontSize: 14, color: "#000"}}>
                        {chat.otroUsuario?.nombre || 'Usuario'}
                      </div>
                      <div style={{fontSize: 11, color: "#999"}}>
                        {formatearFecha(chat.fechaUltimoMensaje)}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 12, 
                      color: "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {chat.ultimoMensaje}
                    </div>
                    <div style={{fontSize: 10, color: "#999", marginTop: 2}}>
                      {chat.totalMensajes} mensajes • Continuar conversación
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{padding: 20, textAlign: "center", color: "#666"}}>
                <div style={{fontSize: 48}}>💬</div>
                <div>No tienes conversaciones aún</div>
                <div style={{fontSize: 12, marginTop: 8}}>
                  Ve a "Explorar" para iniciar nuevos chats
                </div>
              </div>
            )
          ) : (

            obtenerUsuariosParaExplorar().length > 0 ? (
              obtenerUsuariosFiltradosParaExplorar().map((u, index) => (
                <div
                  key={`user-${u.id}-${usuarioActual?.id || ''}`}
                  onClick={() => seleccionarConversacion(u)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    background: usuarioDestino?.id === u.id ? "#e3f2fd" : "transparent",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "background 0.2s"
                  }}
                >
                  <Avatar name={u.nombre} />
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 600, fontSize: 14, color: "#000"}}>{u.nombre}</div>
                    <div style={{fontSize: 12, color: "#666"}}>
                      {u.correo || "Sin correo"} • {usuariosConectados.includes(u.id) ? "🟢 Conectado" : "⚫ Disponible"}
                    </div>
                    <div style={{fontSize: 10, color: "#4caf50", marginTop: 2}}>
                      Iniciar conversación
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{padding: 20, textAlign: "center", color: "#666"}}>
                <div style={{fontSize: 48}}>🌍</div>
                <div>Todos los usuarios ya tienen conversaciones activas</div>
                <div style={{fontSize: 12, marginTop: 8}}>
                  Los usuarios con conversaciones aparecen en "Mis Chats"
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Área de mensajes - FONDO BLANCO */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#ffffff"
      }}>
        {/* Header */}
        <div style={{
          height: 70,
          background: "#f5f5f5",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #ddd"
        }}>
          {conversacion && usuarioDestino ? (
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <Avatar name={usuarioDestino.nombre} />
              <div>
                <div style={{fontWeight: 600, fontSize: 18, color: "#000"}}>{usuarioDestino.nombre}</div>
                <div style={{fontSize: 12, color: "#666"}}>
                  {usuariosConectados.includes(usuarioDestino.id) ? "🟢 Conectado" : "⚫ Desconectado"}
                </div>
              </div>
            </div>
          ) : (
            <div style={{textAlign: "center", width: "100%"}}>
              <div style={{fontSize: 18, color: "#000"}}>
                {seccionActiva === 'mis-chats' ? "Selecciona un chat" : "Explora y conecta"}
              </div>
              <div style={{fontSize: 12, color: "#666", marginTop: 4}}>
                {seccionActiva === 'mis-chats' ? 
                  "Continúa una conversación existente" : 
                  "Inicia nuevas conversaciones con otros usuarios"
                }
              </div>
            </div>
          )}

          <div style={{display: "flex", gap: 8}}>
            <Button
              theme="tertiary small"
              onClick={() => {
                cargarEstadisticas();
                cargarMisChats();
                cargarUsuariosConectados();
              }}
              style={{color: "#666"}}
              disabled={cargando}
            >
              {cargando ? "..." : "🔄 Actualizar"}
            </Button>
          </div>
        </div>

        {/* Mensajes */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#ffffff"
        }}>
          {conversacion && mensajes && mensajes.obtenerTamaño() > 0 ? (
            mensajes.obtenerTodos().map((m: any, index: number) => {
              const remitente = usuarios.buscarPorId(parseInt(m.idRemitente));
              const esActual = parseInt(m.idRemitente) === usuarioActual.id;
              const nombreRemitente = esActual ? usuarioActual.nombre : (remitente?.nombre || `Usuario ${m.idRemitente}`);

              return (
                <div
                  key={m.key || m.id || `msg-${index}`}
                  style={{
                    display: "flex",
                    flexDirection: esActual ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 8
                  }}
                >
                  <Avatar name={nombreRemitente} />
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: "18px",
                      background: esActual ? "#dcf8c6" : "#f1f1f1",
                      color: "#000",
                      wordWrap: "break-word",
                      position: "relative",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    <div style={{marginBottom: 4, color: "#000"}}>{m.contenido}</div>
                    <div style={{
                      fontSize: 11, 
                      textAlign: "right", 
                      opacity: 0.7,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#666"
                    }}>
                      <span>{formatearFecha(m.fechaEnvio)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : conversacion ? (
            <div style={{textAlign: "center", color: "#666", marginTop: 50}}>
              <div style={{fontSize: 48}}>💬</div>
              <div style={{fontSize: 18, marginBottom: 8, color: "#000"}}>
                Inicia la conversación con {usuarioDestino?.nombre}
              </div>
              <div style={{fontSize: 14, color: "#666"}}>
                Esta conversación está almacenada usando LinkedList y grafos
              </div>
            </div>
          ) : (
            <div style={{textAlign: "center", color: "#666", marginTop: 50}}>
              <div style={{fontSize: 64}}>
                {seccionActiva === 'mis-chats' ? "💬" : "🌍"}
              </div>
              <div style={{fontSize: 20, marginBottom: 12, color: "#000"}}>
                {seccionActiva === 'mis-chats' ? 
                  "Tus conversaciones te esperan" : 
                  "Explora y conecta con nuevos usuarios"
                }
              </div>
              <div style={{fontSize: 14, maxWidth: 400, margin: "0 auto", lineHeight: 1.5, color: "#666"}}>
                {seccionActiva === 'mis-chats' ? 
                  "Selecciona una conversación de la izquierda para continuar charlando." :
                  "Descubre usuarios disponibles para iniciar nuevas conversaciones."
                }
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input */}
        {conversacion && (
          <div style={{
            padding: 16,
            background: "#f9f9f9",
            borderTop: "1px solid #ddd"
          }}>
            <MessageInput
              onSubmit={enviarMensaje}
              style={{ 
                width: "100%", 
                color: "#000",
                background: "#fff"
              }}
            />
          </div>
        )}
      </div>

      {/* Notificaciones */}
      <Notification
        opened={!!notificacion}
        duration={3000}
        onOpenedChanged={e => !e.detail.value && setNotificacion(null)}
        position="top-center"
      >
        {notificacion}
      </Notification>
    </div>
  );
};

export default MensajesView;