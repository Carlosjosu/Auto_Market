import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Notification, Select } from '@vaadin/react-components';
import { CuentaService, UsuarioService } from 'Frontend/generated/endpoints';

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
    rol: '',
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Obtener lista de roles para el selector
    UsuarioService.listaRol().then(data => {
      setRoles((data ?? []).map(r => ({ label: r.label, value: r.value })));
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      // 1. Crear cuenta
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
        parseInt(form.rol)
      );

      Notification.show('Registro exitoso', { theme: 'success' });
      navigate('/login');
    } catch (error) {
      Notification.show('Error en el registro: ' + error.message, { theme: 'error' });
    }
  };

  return (
    <main className="flex flex-col gap-m p-m" style={{ maxWidth: 400 }}>
      <h2>Registro</h2>
      <TextField label="Correo electrónico" name="correo" value={form.correo} onChange={handleChange} />
      <TextField label="Clave" name="clave" type="password" value={form.clave} onChange={handleChange} />
      <TextField label="Nickname" name="nickname" value={form.nickname} onChange={handleChange} />
      <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
      <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} />
      <TextField label="Cédula" name="cedula" value={form.cedula} onChange={handleChange} />
      <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
      <Select
        label="Rol"
        name="rol"
        items={roles}
        value={form.rol}
        onValueChanged={e => setForm({ ...form, rol: e.detail.value })}
      />
      <Button theme="primary" onClick={handleRegister}>Registrar</Button>
    </main>
  );
}