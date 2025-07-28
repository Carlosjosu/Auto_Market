export const menuConfig = [
  { to: '/Auto', title: 'Inicio', icon: 'vaadin:home' },
  { to: '/favorito-list', title: 'Favoritos', icon: 'vaadin:heart' },
  { to: '/MensajeView', title: 'Mensajes', icon: 'vaadin:envelope' },
  { to: '/cuenta-list', title: 'Cuentas', icon: 'vaadin:user', roles: ['ROLE_admin'] },
  { to: '/Imagen', title: 'Imagenes', icon: 'vaadin:picture', roles: ['ROLE_admin'] },
  { to: '/Marca', title: 'Marcas', icon: 'vaadin:flag', roles: ['ROLE_admin'] },
  { to: '/usuario-list', title: 'Usuarios', icon: 'vaadin:users', roles: ['ROLE_admin'] },
  { to: '/valoracion-list', title: 'Mis Valoraciones', icon: 'vaadin:star', roles: ['ROLE_user'] },
  { to: '/venta-list', title: 'Mis Ventas', icon: 'vaadin:dollar', roles: ['ROLE_user'] },
];