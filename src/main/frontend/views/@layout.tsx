import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from 'Frontend/security/auth';
import {
  AppLayout,
  Avatar,
  Icon,
  MenuBar,
  MenuBarItem,
  MenuBarItemSelectedEvent,
  ProgressBar,
  Scroller,
  SideNav,
  SideNavItem,
} from '@vaadin/react-components';
import { Suspense } from 'react';
import { menuConfig } from 'Frontend/config/menu_config';
import { CuentaService } from 'Frontend/generated/endpoints';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useEffect } from 'react';
import { Notification } from '@vaadin/react-components/Notification';

function Header() {
  // TODO Replace with real application logo and name
  return (
    <div className="flex p-m gap-m items-center" slot="drawer">
      <Icon icon="vaadin:cubes" className="text-primary icon-l" />
      <span className="font-semibold text-l">Unl Sistema</span>
    </div>
  );
}

function MainMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  const roles = (state.user?.authorities ?? []).map(auth => auth ? (typeof auth === 'string' ? auth : auth.authority) : undefined).filter(Boolean);
  const menuItems = menuConfig.filter(item =>
    !item.roles || item.roles.some(role => roles.includes(role))
  );
  return (
    <SideNav className="mx-m" onNavigate={({ path }) => path != null && navigate(path)} location={location}>
      {menuItems.map(({ to, title, icon }) => (
        <SideNavItem path={to} key={to}>
          {icon && <Icon icon={icon} className="mr-s" />}
          {title}
        </SideNavItem>
      ))}
    </SideNav>
  );
}

type UserMenuItem = MenuBarItem<{ action?: () => void }>;

function UserMenu() {
  // TODO Replace with real user information and actions
  const { state, logout } = useAuth();
  const nickname = state.user?.name || 'ERROR';
  console.log('Auth state:', state);
  console.log('Usuario:', state.user);
  const items: Array<UserMenuItem> = [
    {
      component: (
        <>
          <Avatar theme="xsmall" name={nickname} colorIndex={5} className="mr-s" /> {nickname}
        </>
      ),
      children: [
        { text: 'Cerrar Sesion', action: () => 
          (async () => CuentaService.logout().then(async function(){
            await logout();
          }))() },
      ],
    },
  ];
  const onItemSelected = (event: MenuBarItemSelectedEvent<UserMenuItem>) => {
    event.detail.value.action?.();
  };
  return (
    <MenuBar theme="tertiary-inline" items={items} onItemSelected={onItemSelected} className="m-m" slot="drawer" />
  );
}

export const config: ViewConfig = {
  loginRequired: true
}

export default function MainLayout() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!state.user) return;
    const roles = (state.user?.authorities ?? []).map(auth => auth ? (typeof auth === 'string' ? auth : auth.authority) : undefined).filter(Boolean);
    const currentPath = location.pathname;
    const menuItem = menuConfig.find(item => item.to === currentPath);

    if (menuItem && menuItem.roles && !menuItem.roles.some(role => roles.includes(role))) {
      Notification.show('No tiene permisos para acceder a esta página', { theme: 'error' });
      navigate('/Auto', { replace: true });
    }
  }, [state.user, location.pathname, navigate]);
  return (
    <AppLayout primarySection="drawer">
      <Header />
      <Scroller slot="drawer">
        <MainMenu />
      </Scroller>
      <UserMenu />
      <Suspense fallback={<ProgressBar indeterminate={true} className="m-0" />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}