import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageInput } from "@vaadin/react-components/MessageInput";
import { Avatar } from "@vaadin/react-components/Avatar";
import { Notification } from "@vaadin/react-components/Notification";
import { Button } from "@vaadin/react-components/Button";
import { Tabs } from "@vaadin/react-components/Tabs";
import { Tab } from "@vaadin/react-components/Tab";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import "../themes/default/mensaje-view.css";
import { useLocation } from 'react-router-dom';

// Services usando LinkedList y grafos
import { MensajeService } from "Frontend/generated/endpoints";
import { ConversacionService } from "Frontend/generated/endpoints";  
import { UsuarioService } from "Frontend/generated/endpoints";

// Configuración del menú con ícono
export const config: ViewConfig = {
  menu: {
    order: 8,
    icon: "vaadin:chat",
    title: "Mensajes"
  },
};

// Clases para LinkedList (sin usar arrays)
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

// Clase para LinkedList de chats
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

// Clase para LinkedList de mensajes
class NodoMensaje {
  mensaje: any;
  siguiente: NodoMensaje | null;

  constructor(mensaje: any) {
    this.mensaje = mensaje;
    this.siguiente = null;
  }
}

// Clase para LinkedList de mensajes - CORREGIR
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
    this.tamaño++; // INCREMENTAR TAMAÑO
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

  // AGREGAR MÉTODO FALTANTE
  obtenerTamaño(): number {
    return this.tamaño;
  }

  limpiar() {
    this.cabeza = null;
    this.tamaño = 0; // RESETEAR TAMAÑO
  }

  // MÉTODO ADICIONAL PARA BUSCAR MENSAJES
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
  const location = useLocation();
  
  // LinkedLists en lugar de arrays
  const [usuarios] = useState<LinkedListUsuarios>(new LinkedListUsuarios());
  const [misChats] = useState<LinkedListChats>(new LinkedListChats());
  const [mensajes] = useState<LinkedListMensajes>(new LinkedListMensajes());
  
  // Estados principales
  const [usuarioActual] = useState<any>({ id: 1, nombre: "Juan", correo: "admin@gmail.com" });
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

  // Cargar usuarios usando LinkedList
  const cargarUsuarios = useCallback(async () => {
    if (cargando) return;
    
    try {
      setCargando(true);
      const usuariosData = await UsuarioService.listUsuario();
      
      usuarios.limpiar();
      
      if (usuariosData) {
        for (let i = 0; i < usuariosData.length; i++) {
          const u = usuariosData[i];
          const usuarioFormateado = {
            id: parseInt(u.id) || 0,
            nombre: u.nombre || u.nickname || `Usuario ${u.id}`,
            nickname: u.nickname,
            apellido: u.apellido,
            telefono: u.telefono,
            correo: u.correo
          };
          usuarios.agregar(usuarioFormateado);
        }
      }
      
      forzarActualizacion();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setNotificacion('Error cargando usuarios');
    } finally {
      setCargando(false);
    }
  }, [cargando, usuarios]);

  // Cargar chats usando LinkedList
  const cargarMisChats = useCallback(async () => {
    if (cargando) return;
    
    try {
      setCargando(true);
      
      if (usuarios.obtenerTamaño() === 0) {
        await cargarUsuarios();
      }
      
      const conversaciones = await ConversacionService.obtenerConversacionesPorUsuario(usuarioActual.id);
      
      misChats.limpiar();
      
      if (conversaciones) {
        for (let i = 0; i < conversaciones.length; i++) {
          const conv = conversaciones[i];
          try {
            const idOtroUsuario = parseInt(conv.idEmisor) === usuarioActual.id 
              ? parseInt(conv.idReceptor) 
              : parseInt(conv.idEmisor);
            
            let otroUsuario = usuarios.buscarPorId(idOtroUsuario);
            
            if (!otroUsuario) {
              try {
                const usuarioData = await UsuarioService.getUsuario(idOtroUsuario);
                if (usuarioData) {
                  otroUsuario = {
                    id: parseInt(usuarioData.id),
                    nombre: usuarioData.nombre || usuarioData.nickname || `Usuario ${idOtroUsuario}`,
                    nickname: usuarioData.nickname,
                    apellido: usuarioData.apellido,
                    telefono: usuarioData.telefono,
                    correo: usuarioData.correo
                  };
                  usuarios.agregar(otroUsuario);
                }
              } catch (error) {
                console.warn(`No se pudo cargar usuario ${idOtroUsuario}:`, error);
              }
            }
            
            const ultimosMensajes = await MensajeService.obtenerMensajesPorConversacion(parseInt(conv.id)) || [];
            const ultimoMensaje = ultimosMensajes.length > 0 ? ultimosMensajes[ultimosMensajes.length - 1] : null;
            
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
            
            misChats.agregar(chat);
          } catch (error) {
            console.error('Error procesando conversación:', error);
          }
        }
      }
      
      forzarActualizacion();
    } catch (error) {
      console.error('Error cargando mis chats:', error);
    } finally {
      setCargando(false);
    }
  }, [usuarios, usuarioActual.id, cargando, misChats, cargarUsuarios]);

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
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
  }, [usuarioActual.id]);

  // Cargar usuarios conectados
  const cargarUsuariosConectados = useCallback(async () => {
    try {
      const conectados = await ConversacionService.obtenerUsuariosConectados(usuarioActual.id);
      setUsuariosConectados(conectados || []);
    } catch (error) {
      console.error('Error cargando usuarios conectados:', error);
      setUsuariosConectados([]);
    }
  }, [usuarioActual.id]);

  // Cargar mensajes usando LinkedList
  const cargarMensajes = useCallback(async (idConversacion: number) => {
    if (!idConversacion) return;
    
    try {
      const mensajesData = await MensajeService.obtenerMensajesOrdenados(idConversacion, true);
      
      mensajes.limpiar();
      
      if (mensajesData) {
        for (let i = 0; i < mensajesData.length; i++) {
          const m = mensajesData[i];
          const mensajeConId = {
            ...m,
            id: m.id || `temp-${i}-${Date.now()}`,
            key: `msg-${m.id || i}-${idConversacion}`
          };
          mensajes.agregar(mensajeConId);
        }
      }
      
      forzarActualizacion();
      cargarEstadisticas();
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      mensajes.limpiar();
      forzarActualizacion();
    }
  }, [mensajes, cargarEstadisticas]);

  // Seleccionar conversación
  const seleccionarConversacion = useCallback(async (usuario: any) => {
    if (!usuario || !usuario.id) return;
    
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
        
        if (seccionActiva === 'explorar') {
          setTimeout(() => {
            cargarMisChats();
            cargarUsuariosConectados();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error seleccionando conversación:', error);
      setNotificacion('Error al acceder a la conversación');
    }
  }, [usuarioActual.id, seccionActiva, cargarMensajes, cargarMisChats, cargarUsuariosConectados, mensajes]);

  // Enviar mensaje
  const enviarMensaje = useCallback(async (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (!conversacion || !contenido?.trim()) return;

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
          cargarMisChats();
        }, 500);
      } else {
        setNotificacion("Error al enviar mensaje");
      }
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setNotificacion('Error al enviar mensaje');
    }
  }, [conversacion, usuarioActual.id, cargarMensajes, cargarMisChats]);

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
  }, [conversacion, cargarMensajes, mensajes]);

  // Iniciar chat con usuario
  const iniciarChatConUsuario = useCallback(async (usuarioId: number, contexto?: any) => {
    try {
      // Buscar el usuario en la lista de usuarios
      let usuario = usuarios.buscarPorId(usuarioId);
      
      // Si no está en la lista, intentar cargarlo individualmente
      if (!usuario) {
        try {
          const usuarioData = await UsuarioService.getUsuario(usuarioId);
          if (usuarioData) {
            usuario = {
              id: parseInt(usuarioData.id),
              nombre: usuarioData.nombre || usuarioData.nickname || `Usuario ${usuarioId}`,
              nickname: usuarioData.nickname,
              apellido: usuarioData.apellido,
              telefono: usuarioData.telefono,
              correo: usuarioData.correo
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

      // Seleccionar la conversación con este usuario
      await seleccionarConversacion(usuario);
      
      // Enviar mensaje inicial si hay contexto
      if (contexto) {
        setTimeout(async () => {
          let mensajeInicial = '';
          
          if (contexto.autoInfo) {
            mensajeInicial = `Hola! Me interesa el auto ${contexto.autoInfo.marca} ${contexto.autoInfo.modelo} ${contexto.autoInfo.anio} por $${contexto.autoInfo.precio}. ¿Podrías darme más información?`;
          } else if (contexto.ventaInfo) {
            mensajeInicial = `Hola! Me interesa la venta del ${contexto.ventaInfo.auto} por $${contexto.ventaInfo.precio}. ¿Está disponible?`;
          }

          if (mensajeInicial && conversacion) {
            try {
              const nuevoMensaje = {
                idConversacion: parseInt(conversacion.id),
                idRemitente: usuarioActual.id,
                contenido: mensajeInicial,
                fechaEnvio: new Date().toISOString()
              };

              const resultado = await MensajeService.agregarMensaje(nuevoMensaje);
              

              if (resultado?.estado === 'success') {
                setTimeout(() => {
                  cargarMensajes(parseInt(conversacion.id));
                  cargarMisChats();
                }, 500);
              }
            } catch (error) {
              console.error('Error enviando mensaje inicial:', error);
            }
          }
        }, 1000);
      }

      setNotificacion(`Iniciando chat con ${usuario.nombre}`);
    } catch (error) {
      console.error('Error iniciando chat con usuario:', error);
      setNotificacion('Error al iniciar el chat');
    }
  }, [usuarios, usuarioActual.id, seleccionarConversacion, conversacion, cargarMensajes, cargarMisChats]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      // CARGAR EN ORDEN ESPECÍFICO
      await cargarUsuarios();        
      await cargarMisChats();        
      await cargarEstadisticas();    
      await cargarUsuariosConectados(); 
    };
    
    cargarDatosIniciales();
  }, [cargarUsuarios, cargarMisChats, cargarEstadisticas, cargarUsuariosConectados]);

  // Auto-scroll
  useEffect(() => {
    if (mensajes && typeof mensajes.obtenerTamaño === 'function' && mensajes.obtenerTamaño() > 0) {
      setTimeout(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [mensajes, actualizarUI]);

  // AGREGAR ESTE useEffect AQUÍ (no dentro del JSX)
  useEffect(() => {
    if (location.state?.chatConUsuario) {
      const { chatConUsuario, autoInfo, ventaInfo } = location.state;
      
      // Esperar a que se carguen los datos iniciales
      setTimeout(() => {
        iniciarChatConUsuario(
          chatConUsuario.id, 
          { autoInfo, ventaInfo }
        );
      }, 2000);

      // Limpiar el state para evitar repetir la acción
      window.history.replaceState({}, document.title);
    }
  }, [location.state, iniciarChatConUsuario]);

  // Obtener usuarios para explorar (sin arrays)
  const obtenerUsuariosParaExplorar = (): any[] => {
    const todosUsuarios = usuarios.obtenerTodos();
    const usuariosParaExplorar: any[] = [];
    
    for (let i = 0; i < todosUsuarios.length; i++) {
      const u = todosUsuarios[i];
      if (u.id === usuarioActual.id) continue;
      
      const yaEstaEnMisChats = misChats.buscarPorUsuario(u.id) !== null;
      
      if (!yaEstaEnMisChats) {
        usuariosParaExplorar.push(u);
      }
    }
    
    return usuariosParaExplorar;
  };

  // Obtener chats filtrados
  const obtenerChatsFiltrados = (): any[] => {
    if (!busqueda) {
      return misChats.obtenerTodos();
    } else {
      return misChats.buscarPorTexto(busqueda);
    }
  };

  // Obtener usuarios filtrados para explorar
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
                  key={`chat-${chat.id}-${index}`}
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
                      {chat.totalMensajes} mensajes
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
            // EXPLORAR
            obtenerUsuariosParaExplorar().length > 0 ? (
              obtenerUsuariosFiltradosParaExplorar().map((u, index) => (
                <div
                  key={`user-${u.id}-${index}`}
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
                      {u.correo || "Sin correo"}
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
                <div>Ya tienes conversaciones con todos los usuarios</div>
                <div style={{fontSize: 12, marginTop: 8}}>
                  Ve a "Mis Chats" para continuar conversaciones
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
              const nombreRemitente = remitente?.nombre || 'Usuario Desconocido';

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
                      <span>{nombreRemitente}</span>
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
              placeholder={`Escribir mensaje a ${usuarioDestino?.nombre}...`}
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