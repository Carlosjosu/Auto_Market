import React, { useState, useEffect, useRef } from "react";
import { MessageInput } from "@vaadin/react-components/MessageInput";
import { Avatar } from "@vaadin/react-components/Avatar";
import { Notification } from "@vaadin/react-components/Notification";
import { Button } from "@vaadin/react-components/Button";
import "../themes/default/mensaje-view.css";

// Importar los servicios de Spring Boot
import { MensajeService } from "Frontend/generated/endpoints";
import { ConversacionService } from "Frontend/generated/endpoints";
import { UsuarioService } from "Frontend/generated/endpoints";

// Interfaces actualizadas
interface Usuario {
  id: number;
  nombre: string;
  nickname?: string;
  apellido?: string;
  telefono?: string;
}

interface Conversacion {
  id: number;
  idEmisor: number;
  idReceptor: number;
  fechaInicio: string;
  estaActiva?: boolean;
}

interface Mensaje {
  id: number;
  idConversacion: number;
  idRemitente: number;
  contenido: string;
  fechaEnvio: string;
}

interface EstadisticasMensajes {
  totalMensajes: number;
  mensajesNoLeidos: number;
  conversacionesActivas: number;
}

const MensajesView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [usuarioDestino, setUsuarioDestino] = useState<Usuario | null>(null);
  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasMensajes | null>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [usuariosConectados, setUsuariosConectados] = useState<number[]>([]);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Cargar usuarios al inicio
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const usuariosData = await UsuarioService.listUsuario();
      if (usuariosData) {
        const usuariosFormateados = usuariosData.map((u: any) => ({
          id: u.id,
          nombre: u.nombre || u.nickname || 'Usuario',
          nickname: u.nickname,
          apellido: u.apellido,
          telefono: u.telefono
        }));
        setUsuarios(usuariosFormateados);
        setUsuarioActual(usuariosFormateados[0] || null);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setNotificacion('Error cargando usuarios');
    }
  };

  // Cargar estadísticas cuando cambia usuario actual
  useEffect(() => {
    if (usuarioActual) {
      cargarEstadisticas();
      cargarUsuariosConectados();
      verificarMensajesNoLeidos();
    }
  }, [usuarioActual]);

  const cargarEstadisticas = async () => {
    if (!usuarioActual) return;
    try {
      const stats = await MensajeService.obtenerEstadisticas(usuarioActual.id);
      setEstadisticas(stats as EstadisticasMensajes);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const cargarUsuariosConectados = async () => {
    if (!usuarioActual) return;
    try {
      const conectados = await ConversacionService.obtenerUsuariosConectados(usuarioActual.id);
      setUsuariosConectados(conectados || []);
    } catch (error) {
      console.error('Error cargando usuarios conectados:', error);
    }
  };

  const verificarMensajesNoLeidos = async () => {
    try {
      const noLeido = await MensajeService.obtenerSiguienteMensajeNoLeido();
      if (noLeido) {
        setMensajesNoLeidos(prev => [...prev, noLeido]);
        setNotificacion(`Nuevo mensaje: ${noLeido.contenido?.substring(0, 30)}...`);
      }
    } catch (error) {
      console.error('Error verificando mensajes no leídos:', error);
    }
  };

  // Cambiar conversación cuando cambia usuario destino
  useEffect(() => {
    if (usuarioActual && usuarioDestino) {
      buscarOCrearConversacion();
    } else {
      setConversacion(null);
      setMensajes([]);
    }
  }, [usuarioDestino, usuarioActual]);

  const buscarOCrearConversacion = async () => {
    if (!usuarioActual || !usuarioDestino) return;
    
    try {
      // Buscar conversación existente
      let conv = await ConversacionService.buscarConversacion(usuarioActual.id, usuarioDestino.id);
      
      if (!conv) {
        // Crear nueva conversación
        const nuevaConv = {
          idEmisor: usuarioActual.id,
          idReceptor: usuarioDestino.id,
          fechaInicio: new Date().toISOString(),
          estaActiva: true
        };
        
        await ConversacionService.agregarConversacion(nuevaConv);
        conv = await ConversacionService.buscarConversacion(usuarioActual.id, usuarioDestino.id);
      }
      
      setConversacion(conv);
      if (conv) {
        cargarMensajes(conv.id);
      }
    } catch (error) {
      console.error('Error gestionando conversación:', error);
      setNotificacion('Error al acceder a la conversación');
    }
  };

  const cargarMensajes = async (idConversacion: number) => {
    try {
      // Usar el nuevo método con ordenamiento
      const mensajesData = await MensajeService.obtenerMensajesOrdenados(idConversacion, true);
      setMensajes(mensajesData || []);
      
      // Marcar mensajes como leídos
      mensajesData?.forEach((msg: any) => {
        if (msg.idRemitente !== usuarioActual?.id) {
          MensajeService.marcarComoLeido(Number(msg.id));
        }
      });
      
      // Actualizar estadísticas
      cargarEstadisticas();
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  // Polling para mensajes en tiempo real
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (conversacion) {
      cargarMensajes(conversacion.id);
      interval = setInterval(() => {
        cargarMensajes(conversacion.id);
        verificarMensajesNoLeidos();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [conversacion]);

  // Scroll automático al final
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (!conversacion || !usuarioActual || !contenido.trim()) return;

    try {
      const nuevoMensaje = {
        idConversacion: conversacion.id,
        idRemitente: usuarioActual.id,
        contenido: contenido.trim(),
        fechaEnvio: new Date().toISOString()
      };

      await MensajeService.agregarMensaje(nuevoMensaje);
      setNotificacion("Mensaje enviado");
      
      // Recargar mensajes inmediatamente
      cargarMensajes(conversacion.id);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setNotificacion('Error al enviar mensaje');
    }
  };

  const buscarMensajes = async (texto: string) => {
    if (!texto.trim()) {
      if (conversacion) cargarMensajes(conversacion.id);
      return;
    }

    try {
      const resultados = await MensajeService.buscarMensajes(texto);
      setMensajes(resultados || []);
      setNotificacion(`${resultados?.length || 0} mensajes encontrados`);
    } catch (error) {
      console.error('Error buscando mensajes:', error);
    }
  };

  const verificarConexion = async (usuarioId: number) => {
    if (!usuarioActual) return false;
    try {
      return await ConversacionService.usuariosEstaConnectados(usuarioActual.id, usuarioId);
    } catch {
      return false;
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#111b21"
    }}>
      {/* Sidebar de usuarios con estadísticas */}
      <div style={{
        width: 360,
        background: "#202c33",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #222"
      }}>
        {/* Header con usuario actual */}
        <div style={{padding: 16, borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 8}}>
          <Avatar name={usuarioActual?.nombre || ""} />
          <select
            value={usuarioActual?.id || ""}
            onChange={e => {
              const nuevo = usuarios.find(u => u.id === Number(e.target.value));
              setUsuarioActual(nuevo || null);
              setUsuarioDestino(null);
            }}
            style={{background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: 4}}
          >
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div style={{padding: 12, borderBottom: "1px solid #222", fontSize: 12, color: "#aebac1"}}>
            <div>📊 Total mensajes: {estadisticas.totalMensajes}</div>
            <div>🔔 No leídos: {estadisticas.mensajesNoLeidos}</div>
            <div>💬 Conversaciones: {estadisticas.conversacionesActivas}</div>
          </div>
        )}

        {/* Búsqueda */}
        <div style={{padding: 8, borderBottom: "1px solid #222"}}>
          <input
            type="text"
            placeholder="Buscar mensajes..."
            onChange={e => buscarMensajes(e.target.value)}
            style={{
              width: "100%",
              background: "#2a3942",
              border: "none",
              color: "#fff",
              padding: 8,
              borderRadius: 4
            }}
          />
        </div>

        <div style={{padding: 8, borderBottom: "1px solid #222", fontWeight: 600}}>
          Chats
        </div>

        {/* Lista de usuarios */}
        <div style={{flex: 1, overflowY: "auto"}}>
          {usuarios.filter(u => u.id !== usuarioActual?.id).map(u => {
            const estaConectado = usuariosConectados.includes(u.id);
            return (
              <div
                key={u.id}
                onClick={() => setUsuarioDestino(u)}
                style={{
                  cursor: "pointer",
                  padding: "12px 16px",
                  background: usuarioDestino?.id === u.id ? "#2a3942" : "transparent",
                  borderBottom: "1px solid #222",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <div style={{position: "relative"}}>
                  <Avatar name={u.nombre} />
                  {estaConectado && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      background: "#25d366",
                      borderRadius: "50%",
                      border: "2px solid #202c33"
                    }} />
                  )}
                </div>
                <div>
                  <div style={{fontWeight: 600}}>{u.nombre}</div>
                  <div style={{fontSize: 12, color: "#aebac1"}}>
                    {estaConectado ? "🟢 Conectado" : "Haz clic para chatear"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Área de mensajes */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#222e35"
      }}>
        {/* Header de la conversación */}
        <div style={{
          height: 60,
          background: "#202c33",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #222"
        }}>
          {conversacion && usuarioDestino ? (
            <div style={{display: "flex", alignItems: "center"}}>
              <Avatar name={usuarioDestino.nombre} />
              <span style={{marginLeft: 12, fontWeight: 600, fontSize: 18}}>
                {usuarioDestino.nombre}
              </span>
            </div>
          ) : (
            <span style={{fontSize: 18}}>Selecciona un chat</span>
          )}

          {/* Botones de acción */}
          <div style={{display: "flex", gap: 8}}>
            <Button
              theme="tertiary small"
              onClick={cargarEstadisticas}
              style={{color: "#aebac1"}}
            >
              📊 Estadísticas
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
          gap: 10
        }}>
          {conversacion && mensajes.map((m: any, i: number) => {
            const remitente = usuarios.find(u => u.id === Number(m.idRemitente));
            const esActual = Number(m.idRemitente) === usuarioActual?.id;
            const userColorIndex = (Number(m.idRemitente) % 5) + 1;

            return (
              <div
                key={`${m.id}-${i}`}
                style={{
                  display: "flex",
                  flexDirection: esActual ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8
                }}
              >
                <Avatar
                  name={remitente?.nombre || ""}
                  style={{
                    border: `2px solid var(--user-color-${userColorIndex}, #25d366)`
                  }}
                />
                <div
                  className={`mensaje ${esActual ? "actual current-user" : "otro"}`}
                >
                  <div>{m.contenido}</div>
                  <div style={{fontSize: 11, textAlign: "right", opacity: 0.7, marginTop: 4}}>
                    {new Date(m.fechaEnvio).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input para enviar mensajes */}
        {conversacion && (
          <div style={{
            padding: 16,
            background: "#202c33",
            borderTop: "1px solid #222"
          }}>
            <MessageInput
              onSubmit={enviarMensaje}
              style={{ width: "100%" }}
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