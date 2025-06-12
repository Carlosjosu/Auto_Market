import React, { useState, useEffect, useRef } from "react";
import { MessageInput } from "@vaadin/react-components/MessageInput";
import { Avatar } from "@vaadin/react-components/Avatar";
import { Notification } from "@vaadin/react-components/Notification";
import "./mensaje-view.css";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  img?: string;
}
interface Conversacion {
  id: number;
  idEmisor: number;
  idReceptor: number;
  idAuto: number;
}
interface Mensaje {
  id: number;
  remitente: Usuario;
  contenido: string;
  fechaEnvio: string;
}

// Usuarios simulados con imagen por defecto
const USUARIOS: Usuario[] = [
  { id: 1, nombre: "Tayron", img: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, nombre: "Invitado", img: "https://randomuser.me/api/portraits/lego/1.jpg" }
];

// API adaptada al backend local
const API_URL = "http://localhost:4000/api";

const fetchConversacion = async (idEmisor: number, idReceptor: number): Promise<Conversacion | null> => {
  const res = await fetch(`${API_URL}/conversaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idEmisor, idReceptor }),
  });
  if (!res.ok) return null;
  return await res.json();
};
const fetchMensajes = async (conversacionId: number): Promise<Mensaje[]> => {
  const res = await fetch(`${API_URL}/mensajes?conversacionId=${conversacionId}`);
  if (!res.ok) return [];
  return await res.json();
};
const enviarMensajeApi = async (
  conversacionId: number,
  remitenteId: number,
  contenido: string
): Promise<void> => {
  await fetch(`${API_URL}/mensajes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversacionId, remitenteId, contenido }),
  });
};

const MensajeView: React.FC = () => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario>(USUARIOS[0]);
  const [usuarioDestino, setUsuarioDestino] = useState<Usuario | null>(USUARIOS[1]);
  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

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

  // Cambia de usuario o conversación
  useEffect(() => {
    if (usuarioDestino) {
      setCargando(true);
      fetchConversacion(usuarioActual.id, usuarioDestino.id).then(conv => {
        setConversacion(conv);
        if (conv) {
          fetchMensajes(conv.id).then(msjs => {
            setMensajes(msjs);
            setCargando(false);
          });
        } else {
          setMensajes([]);
          setCargando(false);
        }
      });
    } else {
      setConversacion(null);
      setMensajes([]);
    }
  }, [usuarioDestino, usuarioActual]);

  const enviarMensaje = async (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (conversacion && contenido.trim()) {
      await enviarMensajeApi(conversacion.id, usuarioActual.id, contenido);
      setNotificacion("Mensaje enviado");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111b21" }}>
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
          <Avatar name={usuarioActual.nombre} img={usuarioActual.img} />
          <select
            value={usuarioActual.id}
            onChange={e => {
              setUsuarioActual(USUARIOS.find(u => u.id === Number(e.target.value))!);
              setUsuarioDestino(USUARIOS.find(u => u.id !== Number(e.target.value))!);
            }}
            style={{background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: 4}}
          >
            {USUARIOS.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
        <div style={{padding: 8, borderBottom: "1px solid #222", fontWeight: 600}}>
          Chats
        </div>
        <div style={{flex: 1, overflowY: "auto"}}>
          {USUARIOS.filter(u => u.id !== usuarioActual.id).map(u => (
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
              <Avatar name={u.nombre} img={u.img} />
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
        background: "#222e35 url(\"data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='%23222e35'/><circle cx='20' cy='20' r='2' fill='%23343f46'/><circle cx='80' cy='80' r='2' fill='%23343f46'/><circle cx='60' cy='40' r='1.5' fill='%23343f46'/><circle cx='40' cy='70' r='1.5' fill='%23343f46'/></svg>\")",
        backgroundSize: "400px 400px"
      }}>
        {/* Barra superior tipo WhatsApp */}
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
              <Avatar name={usuarioDestino.nombre} img={usuarioDestino.img} />
              <span style={{marginLeft: 12, fontWeight: 600, fontSize: 18}}>
                {usuarioDestino.nombre}
              </span>
            </>
          ) : null}
        </div>
        {/* Mensajes tipo WhatsApp */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          {cargando ? (
            <div style={{ color: "#aebac1", textAlign: "center", marginTop: 40, fontSize: 18 }}>
              Cargando...
            </div>
          ) : (
            conversacion && mensajes.map((m, i) => {
              const esActual = m.remitente.id === usuarioActual.id;
              const userColorIndex = (m.remitente.id % 5) + 1;
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
                    name={m.remitente.nombre}
                    img={m.remitente.img}
                    style={{
                      border: `2px solid var(--user-color-${userColorIndex}, #25d366)`,
                      width: 36, height: 36
                    }}
                  />
                  <div
                    className={`mensaje ${esActual ? "actual current-user" : "otro"}`}
                    style={{
                      background: esActual ? "#005c4b" : "#202c33",
                      color: "#fff",
                      borderRadius: esActual ? "12px 12px 0 12px" : "12px 12px 12px 0",
                      padding: "10px 16px",
                      maxWidth: 350,
                      wordBreak: "break-word",
                      boxShadow: "0 1px 2px #0002",
                      marginLeft: esActual ? 0 : 8,
                      marginRight: esActual ? 8 : 0,
                      alignSelf: esActual ? "flex-end" : "flex-start",
                      position: "relative"
                    }}
                  >
                    <div style={{fontSize: 15, marginTop: 2}}>{m.contenido}</div>
                    <div style={{
                      fontSize: 11,
                      textAlign: "right",
                      opacity: 0.7,
                      marginTop: 4,
                      position: "absolute",
                      right: 10,
                      bottom: 4
                    }}>
                      {new Date(m.fechaEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={mensajesEndRef} />
        </div>
        {/* Input fijo abajo */}
        {conversacion && !cargando && (
          <div style={{
            padding: 16,
            background: "#202c33",
            borderTop: "1px solid #222"
          }}>
            <MessageInput
              label=""
              placeholder="Escribe un mensaje..."
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

export default MensajeView;