import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { AdminLayout } from '../layouts/admin-layout';
import { NotFoundPage } from '../../components/shared/not-found-page';
import { DashboardPage } from '../../features/dashboard/pages/dashboard-page';

const rootRoute = createRootRoute({
  component: AdminLayout,
  notFoundComponent: NotFoundPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([dashboardRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
