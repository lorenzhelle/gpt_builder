import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
    path: "/editor",
    element: <GPTEditor />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
