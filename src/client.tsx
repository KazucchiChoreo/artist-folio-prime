import { createRouter } from "@tanstack/react-router";
import { StartClient } from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const router = createRouter({ routeTree, context: { queryClient } });

hydrateRoot(document, <StartClient router={router} />);
