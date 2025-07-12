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
import { createMenuItems } from '@vaadin/hilla-file-router/runtime.js';
import { CuentaService } from 'Frontend/generated/endpoints';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

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

  return (
    <SideNav className="mx-m" onNavigate={({ path }) => path != null && navigate(path)} location={location}>
      {createMenuItems().map(({ to, icon, title }) => (
        <SideNavItem path={to} key={to}>
          {icon && <Icon icon={icon} slot="prefix" />}
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
  const items: Array<UserMenuItem> = [
    {
      component: (
        <>
          <Avatar theme="xsmall" name={nickname} colorIndex={5} className="mr-s" /> {nickname}
        </>
      ),
      children: [
        { text: 'View Profile', action: () => console.log('View Profile') },
        { text: 'Manage Settings', action: () => console.log('Manage Settings') },
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
