import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/forms/:formId/submissions", "routes/api.forms.$formId.submissions.tsx"),
  route("/success", "routes/success.tsx"),
  route("/error", "routes/error.tsx"),
] satisfies RouteConfig;
