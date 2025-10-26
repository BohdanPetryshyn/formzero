import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/logout", "routes/logout.tsx"),

  index("routes/home.tsx"),
  route("setup", "routes/setup.tsx"),
  route("/forms", "routes/forms.tsx", [
    route(":formId", "routes/forms.$formId.tsx", [
      route("submissions", "routes/forms.$formId.submissions.tsx"),
      route("integration", "routes/forms.$formId.integration.tsx"),
    ]),
  ]),

  route("/api/auth/*", "routes/api.auth.$.tsx"),
  route("/api/forms/:formId/submissions", "routes/api.forms.$formId.submissions.tsx"),
  route("/success", "routes/success.tsx"),
  route("/error", "routes/error.tsx"),
] satisfies RouteConfig;
