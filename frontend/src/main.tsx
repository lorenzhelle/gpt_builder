import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GPTEditor } from "./pages/GPTEditor.tsx";

if (document.cookie.indexOf("user_id") === -1) {
  document.cookie = `opengpts_user_id=${crypto.randomUUID()}`;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/editor",
    element: <GPTEditor />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
