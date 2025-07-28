import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Notification, EmailField } from '@vaadin/react-components';
import { CuentaService, UsuarioService } from 'Frontend/generated/endpoints';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
  skipLayouts: true,
  menu: { exclude: true },
  loginRequired: false
};

export default function RegisterView() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    correo: '',
    clave: '',
    nickname: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await CuentaService.create(form.correo, form.clave);
      const cuentas = await CuentaService.listCuenta();
      const cuenta = cuentas.find(c => c.correo === form.correo);
      if (!cuenta) throw new Error('No se pudo obtener la cuenta creada');

      await UsuarioService.create(
        form.nickname,
        form.nombre,
        form.apellido,
        form.cedula,
        form.telefono,
        cuenta.id,
        2
      );

      Notification.show('Registro exitoso', { theme: 'success' });
      navigate('/login');
    } catch (error) {
      Notification.show('Error en el registro: ' + error.message, { theme: 'error' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
      }}
    >
      <main
        className="flex flex-col gap-m p-m"
        style={{
          maxWidth: 400,
          width: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '2rem',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Registro</h2>
        <EmailField
          label="Correo electrónico"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          minLength={8}
          maxLength={50}
          type="email"
        />
        <TextField
          label="Clave"
          name="clave"
          type="password"
          value={form.clave}
          onChange={handleChange}
          minLength={8}
          maxLength={8}
        />
        <TextField
          label="Nickname"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          minLength={4}
          maxLength={10}
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          minLength={2}
          maxLength={30}
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          minLength={2}
          maxLength={30}
        />
        <TextField
          label="Cédula"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          minLength={10}
          maxLength={10}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          minLength={10}
          maxLength={10}
        />
        <Button theme="primary" onClick={handleRegister} style={{ marginTop: '1rem' }}>
          Registrar
        </Button>
      </main>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button theme="tertiary" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </div>
    </div>
  );
}