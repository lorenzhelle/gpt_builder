import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ConfigPage } from "./pages/Config.tsx";
import { GPTEditor } from "./pages/GPTEditor.tsx";

if (document.cookie.indexOf("user_id") === -1) {
  // set fake user id for now, single user for now
  const id = "7c682992-9d0c-4ec4-9f28-1bb546c0b228";
  document.cookie = `opengpts_user_id=${id}`;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create",
    element: <GPTEditor />,
  },
  {
    path: "/:id/edit",
    element: <GPTEditor />,
  },
  {
    path: "/config",
    element: <ConfigPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
