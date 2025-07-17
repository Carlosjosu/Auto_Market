export const menuConfig = [
  { to: '/', title: 'Inicio' },
  { to: '/favorito-list', title: 'Favoritos' },
  { to: '/MensajeView', title: 'Mensajes' },
  { to: '/cuenta-list', title: 'Cuentas', roles: ['ROLE_admin'] },
  { to: '/Imagen', title: 'Imagenes', roles: ['ROLE_admin'] },
  { to: '/Marca', title: 'Marcas', roles: ['ROLE_admin'] },
  { to: '/usuario-list', title: 'Usuarios', roles: ['ROLE_admin'] },
  { to: '/Auto', title: 'Mis Autos', roles: ['ROLE_user'] },
  { to: '/valoracion-list', title: 'Mis Valoraciones', roles: ['ROLE_user'] },
  { to: '/venta-list', title: 'Mis Ventas', roles: ['ROLE_user'] },
];