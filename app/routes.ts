import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/forms/:formId/submissions", "routes/api.forms.$formId.submissions.tsx"),
  route("/success", "routes/success.tsx"),
  route("/error", "routes/error.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),

  route("/forms/:formId", "routes/forms.$formId.tsx", [
    route("submissions", "routes/forms.$formId.submissions.tsx"),
    route("integration", "routes/forms.$formId.integration.tsx"),
  ]),
] satisfies RouteConfig;
