import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { ChurchEventsApp } from './features/church-events/ChurchEventsApp';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ChurchEventsApp,
});

const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: ChurchEventsApp });
const serviceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/service-times-location', component: ChurchEventsApp });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ChurchEventsApp });
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events', component: ChurchEventsApp });
const portalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/portal', component: ChurchEventsApp });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: ChurchEventsApp });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: ChurchEventsApp });

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, serviceRoute, contactRoute, eventsRoute, portalRoute, profileRoute, adminRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
