import React, { useState, useEffect, useRef } from "react";
import { MessageList, MessageInput, Avatar } from "@vaadin/react-components";
import "./mensaje-view.css";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  img?: string;
}
interface Mensaje {
  id: number;
  remitente: Usuario;
  contenido: string;
  fechaEnvio: string;
}

// Simulación de usuarios y mensajes
const USUARIOS: Usuario[] = [
  { id: 1, nombre: "Tayron", img: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, nombre: "Invitado", img: "https://randomuser.me/api/portraits/lego/1.jpg" }
];

// Simulación de conversaciones (en la práctica, esto viene de tu backend)
const CONVERSACIONES = [
  { id: 1, usuarios: [USUARIOS[0], USUARIOS[1]] }
];

const MensajeView: React.FC = () => {
  const [usuarioActual] = useState<Usuario>(USUARIOS[0]);
  const [conversaciones] = useState(CONVERSACIONES);
  const [usuarioDestino, setUsuarioDestino] = useState<Usuario | null>(USUARIOS[1]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Simula fetch de mensajes al cambiar de usuarioDestino
  useEffect(() => {
    if (usuarioDestino) {
      // Aquí deberías llamar a tu backend para obtener los mensajes
      setMensajes([
        {
          id: 1,
          remitente: usuarioDestino,
          contenido: "¡Hola! ¿En qué puedo ayudarte?",
          fechaEnvio: new Date().toISOString()
        }
      ]);
    }
  }, [usuarioDestino]);

  // Scroll automático al final
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const enviarMensaje = (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (contenido.trim() && usuarioDestino) {
      setMensajes(prev => [
        ...prev,
        {
          id: prev.length + 1,
          remitente: usuarioActual,
          contenido,
          fechaEnvio: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111b21" }}>
      {/* Columna de usuarios */}
      <div style={{
        width: 300,
        background: "#202c33",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #222"
      }}>
        <div style={{padding: 16, borderBottom: "1px solid #222", fontWeight: 600}}>
          Conversaciones
        </div>
        <div style={{flex: 1, overflowY: "auto"}}>
          {conversaciones.map(conv => {
            const otro = conv.usuarios.find(u => u.id !== usuarioActual.id)!;
            return (
              <div
                key={otro.id}
                onClick={() => setUsuarioDestino(otro)}
                style={{
                  cursor: "pointer",
                  padding: "12px 16px",
                  background: usuarioDestino?.id === otro.id ? "#2a3942" : "transparent",
                  borderBottom: "1px solid #222",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <Avatar name={otro.nombre} img={otro.img} />
                <div>
                  <div style={{fontWeight: 600}}>{otro.nombre}</div>
                  <div style={{fontSize: 12, color: "#aebac1"}}>Haz clic para chatear</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Columna de chat */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#fff", // Fondo blanco del chat
      }}>
        {/* Barra superior */}
        <div style={{
          height: 60,
          background: "#202c33",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid #222"
        }}>
          {usuarioDestino && (
            <>
              <Avatar name={usuarioDestino.nombre} img={usuarioDestino.img} />
              <span style={{marginLeft: 12, fontWeight: 600, fontSize: 18}}>
                {usuarioDestino.nombre}
              </span>
            </>
          )}
        </div>
        {/* Lista de mensajes */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          <MessageList
            items={mensajes.map(m => ({
              text: m.contenido,
              time: new Date(m.fechaEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              userName: m.remitente.nombre,
              userAbbr: m.remitente.nombre[0],
              userImg: m.remitente.img,
              // Alinea a la derecha si es el usuario actual
              right: m.remitente.id === usuarioActual.id
            }))}
          />
          <div ref={mensajesEndRef} />
        </div>
        {/* Input fijo abajo */}
        {usuarioDestino && (
          <div style={{
            padding: 16,
            background: "#fff", // Barra de enviar mensajes blanca
            borderTop: "1px solid #eee"
          }}>
            <MessageInput
              onSubmit={enviarMensaje}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MensajeView;