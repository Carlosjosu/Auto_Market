import React, { useState, useEffect, useRef } from "react";
import { MessageInput } from "@vaadin/react-components/MessageInput";
import { Avatar } from "@vaadin/react-components/Avatar";
import { Notification } from "@vaadin/react-components/Notification";
import "../themes/default/mensaje-view.css";

// Interfaces
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
  estaActiva: boolean;
}
interface Mensaje {
  id: number;
  idConversacion: number;
  idRemitente: number;
  contenido: string;
  fechaEnvio: string;
}

const API_URL = "http://localhost:4000/api";

// Fetch usuarios reales
const fetchUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) return [];
  return await res.json();
};

// Buscar o crear conversación
const fetchConversacion = async (idEmisor: number, idReceptor: number): Promise<Conversacion | null> => {
  const res = await fetch(`${API_URL}/conversaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idEmisor, idReceptor }),
  });
  if (!res.ok) return null;
  return await res.json();
};

// Obtener mensajes de una conversación
const fetchMensajes = async (idConversacion: number): Promise<Mensaje[]> => {
  const res = await fetch(`${API_URL}/mensajes?conversacionId=${idConversacion}`);
  if (!res.ok) return [];
  return await res.json();
};

// Enviar mensaje
const enviarMensajeApi = async (
  idConversacion: number,
  idRemitente: number,
  contenido: string
): Promise<void> => {
  await fetch(`${API_URL}/mensajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idConversacion, idRemitente, contenido }),
  });
};

const MensajesView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [usuarioDestino, setUsuarioDestino] = useState<Usuario | null>(null);
  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Cargar usuarios al inicio
  useEffect(() => {
    fetchUsuarios().then(us => {
      setUsuarios(us);
      setUsuarioActual(us[0] || null);
    });
  }, []);

  // Cambia de usuario o conversación
  useEffect(() => {
    if (usuarioActual && usuarioDestino) {
      fetchConversacion(usuarioActual.id, usuarioDestino.id).then(conv => {
        setConversacion(conv);
        if (conv) fetchMensajes(conv.id).then(setMensajes);
        else setMensajes([]);
      });
    } else {
      setConversacion(null);
      setMensajes([]);
    }
  }, [usuarioDestino, usuarioActual]);

  // Polling para mensajes en tiempo real (cada 1.5 segundos)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (conversacion) {
      fetchMensajes(conversacion.id).then(setMensajes);
      interval = setInterval(() => {
        fetchMensajes(conversacion.id).then(setMensajes);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [conversacion]);

  // Scroll automático al final
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = async (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (conversacion && usuarioActual && contenido.trim()) {
      await enviarMensajeApi(conversacion.id, usuarioActual.id, contenido);
      setNotificacion("Mensaje enviado");
      // El polling traerá el mensaje nuevo automáticamente
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#111b21"
    }}>
      {/* Sidebar de usuarios */}
      <div style={{
        width: 320,
        background: "#202c33",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #222"
      }}>
        <div style={{padding: 16, borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 8}}>
          <Avatar name={usuarioActual?.nombre || ""} />
          <select
            value={usuarioActual?.id || ""}
            onChange={e => {
              const nuevo = usuarios.find(u => u.id === Number(e.target.value));
              setUsuarioActual(nuevo || null);
              setUsuarioDestino(null); // Reinicia el chat al cambiar de usuario
            }}
            style={{background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: 4}}
          >
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
        <div style={{padding: 8, borderBottom: "1px solid #222", fontWeight: 600}}>
          Chats
        </div>
        <div style={{flex: 1, overflowY: "auto"}}>
          {usuarios.filter(u => u.id !== usuarioActual?.id).map(u => (
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
              <Avatar name={u.nombre} />
              <div>
                <div style={{fontWeight: 600}}>{u.nombre}</div>
                <div style={{fontSize: 12, color: "#aebac1"}}>Haz clic para chatear</div>
              </div>
            </div>
          ))}
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
          padding: "0 24px",
          borderBottom: "1px solid #222"
        }}>
          {conversacion && usuarioDestino ? (
            <>
              <Avatar name={usuarioDestino.nombre} />
              <span style={{marginLeft: 12, fontWeight: 600, fontSize: 18}}>
                {usuarioDestino.nombre}
              </span>
            </>
          ) : (
            <span style={{fontSize: 18}}>Selecciona un chat</span>
          )}
        </div>
        {/* Mensajes tipo MessageList */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          {conversacion && mensajes.map((m, i) => {
            const remitente = usuarios.find(u => u.id === m.idRemitente);
            const esActual = m.idRemitente === usuarioActual?.id;
            const userColorIndex = (m.idRemitente % 5) + 1;
            return (
              <div
                key={m.id}
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
        {/* Input */}
        {conversacion && (
          <div style={{
            padding: 16,
            background: "#202c33",
            borderTop: "1px solid #222"
          }}>
            <MessageInput
              label=" "
              onSubmit={enviarMensaje}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
      <Notification
        opened={!!notificacion}
        duration={2000}
        onOpenedChanged={e => !e.detail.value && setNotificacion(null)}
      >
        {notificacion}
      </Notification>
    </div>
  );
};

export default MensajesView;