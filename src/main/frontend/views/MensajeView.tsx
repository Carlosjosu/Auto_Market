import React, { useState, useEffect, useRef } from "react";
import { MessageList, MessageInput, Avatar } from "@vaadin/react-components";
import "../themes/default/mensaje-view.css";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  img?: string;
}
interface Mensaje {
  id: number;
  idConversacion: number;
  remitente: number;
  contenido: string;
  fechaEnvio: string;
}
interface Conversacion {
  id: number;
  idEmisor: number;
  idReceptor: number;
  fechaInicio: string;
  estaActiva: boolean;
}

// Utilidades para simular archivos JSON usando localStorage
const STORAGE_KEYS = {
  usuarios: "Usuario.json",
  conversaciones: "Conversacion.json",
  mensajes: "Mensaje.json"
};

function loadJson<T>(key: string, defaultValue: T[]): T[] {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
}

function saveJson<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

const MensajeView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [usuarioDestino, setUsuarioDestino] = useState<Usuario | null>(null);
  const [conversacionActual, setConversacionActual] = useState<Conversacion | null>(null);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar datos de ejemplo si no existen
  useEffect(() => {
    // Usuarios de ejemplo
    let usuariosEjemplo: Usuario[] = [
      { id: 1, nombre: "Alice" },
      { id: 2, nombre: "Bob" }
    ];
    let usuariosData = loadJson<Usuario>(STORAGE_KEYS.usuarios, usuariosEjemplo);
    setUsuarios(usuariosData);
    setUsuarioActual(usuariosData[0]);
    setUsuarioDestino(usuariosData[1] || null);

    // Conversaciones y mensajes vacíos si no existen
    loadJson<Conversacion>(STORAGE_KEYS.conversaciones, []);
    loadJson<Mensaje>(STORAGE_KEYS.mensajes, []);
  }, []);

  // Cargar conversaciones del usuario actual
  useEffect(() => {
    if (usuarioActual) {
      const todas = loadJson<Conversacion>(STORAGE_KEYS.conversaciones, []);
      const convs = todas.filter(
        c => c.idEmisor === usuarioActual.id || c.idReceptor === usuarioActual.id
      );
      setConversaciones(convs);
    }
  }, [usuarioActual]);

  // Buscar o crear conversación entre usuarioActual y usuarioDestino
  useEffect(() => {
    if (usuarioActual && usuarioDestino) {
      let todas = loadJson<Conversacion>(STORAGE_KEYS.conversaciones, []);
      let conv = todas.find(
        c =>
          (c.idEmisor === usuarioActual.id && c.idReceptor === usuarioDestino.id) ||
          (c.idEmisor === usuarioDestino.id && c.idReceptor === usuarioActual.id)
      );
      if (conv) {
        setConversacionActual(conv);
      } else {
        // Crear nueva conversación
        const nuevaConv: Conversacion = {
          id: todas.length > 0 ? Math.max(...todas.map(c => c.id)) + 1 : 1,
          idEmisor: usuarioActual.id,
          idReceptor: usuarioDestino.id,
          fechaInicio: new Date().toISOString(),
          estaActiva: true
        };
        todas.push(nuevaConv);
        saveJson(STORAGE_KEYS.conversaciones, todas);
        setConversacionActual(nuevaConv);
        setConversaciones(prev => [...prev, nuevaConv]);
      }
    }
  }, [usuarioActual, usuarioDestino]);

  // Cargar mensajes de la conversación actual
  useEffect(() => {
    if (conversacionActual) {
      const todos = loadJson<Mensaje>(STORAGE_KEYS.mensajes, []);
      const ms = todos.filter(m => m.idConversacion === conversacionActual.id);
      setMensajes(ms);
    } else {
      setMensajes([]);
    }
  }, [conversacionActual]);

  // Scroll automático al final
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  // Enviar mensaje (guardar en "Mensaje.json")
  const enviarMensaje = (e: CustomEvent) => {
    const contenido = e.detail.value;
    if (
      contenido.trim() &&
      usuarioActual &&
      usuarioDestino &&
      conversacionActual
    ) {
      let todos = loadJson<Mensaje>(STORAGE_KEYS.mensajes, []);
      const nuevoMensaje: Mensaje = {
        id: todos.length > 0 ? Math.max(...todos.map(m => m.id)) + 1 : 1,
        idConversacion: conversacionActual.id,
        remitente: usuarioActual.id,
        contenido,
        fechaEnvio: new Date().toISOString()
      };
      todos.push(nuevoMensaje);
      saveJson(STORAGE_KEYS.mensajes, todos);
      setMensajes(prev => [...prev, nuevoMensaje]);
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
          {usuarios
            .filter(u => usuarioActual && u.id !== usuarioActual.id)
            .map(otro => (
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
            ))}
        </div>
        {/* Selector de usuario actual (opcional) */}
        <div style={{padding: 16, borderTop: "1px solid #222"}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Tú:</div>
          <select
            value={usuarioActual?.id || ""}
            onChange={e => {
              const nuevo = usuarios.find(u => u.id === Number(e.target.value));
              if (nuevo) setUsuarioActual(nuevo);
            }}
            style={{width: "100%", padding: 8, borderRadius: 4}}
          >
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Columna de chat */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
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
            items={mensajes.map(m => {
              const remitente = usuarios.find(u => u.id === m.remitente);
              return {
                text: m.contenido,
                time: new Date(m.fechaEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                userName: remitente?.nombre || "Desconocido",
                userAbbr: remitente?.nombre[0] || "?",
                userImg: remitente?.img,
                right: remitente?.id === usuarioActual?.id
              };
            })}
          />
          <div ref={mensajesEndRef} />
        </div>
        {/* Input fijo abajo */}
        {usuarioDestino && conversacionActual && usuarioDestino.id !== usuarioActual?.id && (
          <div style={{
            padding: 16,
            background: "#fff",
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