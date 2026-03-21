import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import type { RouterContext } from "../entry";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
