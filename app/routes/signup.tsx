import { Form, redirect, useActionData, useLoaderData, useNavigation } from "react-router";
import type { Route } from "./+types/signup";
import { getAuth, getUserCount, isGoogleEnabled, isMultiUserEnabled, isPasswordAuthEnabled } from "#/lib/auth.server";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth.client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Sign Up | FormZero" },
    { name: "description", content: "Create your FormZero account" },
  ];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const database = env.DB;
  const auth = getAuth({ database });

  // Redirect to app if already logged in
  const session = await auth.api.getSession({
      headers: request.headers
  });
  if (session?.user) {
    return redirect("/forms");
  }

  const userCount = await getUserCount({ database });
  const multiUserEnabled = isMultiUserEnabled(env);

  // Redirect to login if users already exist and multi-user is disabled
  if (userCount > 0 && !multiUserEnabled) {
    return redirect("/login");
  }

  return {
    googleEnabled: isGoogleEnabled(env),
    passwordAuthEnabled: isPasswordAuthEnabled(env),
    isFirstUser: userCount === 0,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "google") {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/forms"
      });
      return null;
    } catch (err) {
      return { error: "Failed to initiate Google sign in. Please try again." };
    }
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const name = formData.get("name") as string;

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/forms"
    });

    if (signUpError) {
      return { error: signUpError.message || "Failed to create account" };
    }

    // Success - redirect to forms
    return redirect("/forms");
  } catch (err) {
    return { error: "Failed to create account. Please try again." };
  }
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function Signup() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof clientAction>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const googleEnabled = loaderData?.googleEnabled ?? false;
  const passwordAuthEnabled = loaderData?.passwordAuthEnabled ?? true;
  const isFirstUser = loaderData?.isFirstUser ?? true;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to FormZero</h1>
          <p className="mt-2 text-muted-foreground">
            {isFirstUser
              ? "Create your account to get started"
              : "Create an account to join"
            }
          </p>
        </div>

        {googleEnabled && (
          <Form method="post">
            <input type="hidden" name="action" value="google" />
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              <GoogleIcon />
              <span className="ml-2">Continue with Google</span>
            </Button>
          </Form>
        )}

        {googleEnabled && passwordAuthEnabled && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        )}

        {passwordAuthEnabled && (
          <Form method="post" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  minLength={8}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  minLength={8}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <strong>Important:</strong> Please remember your password. Password recovery is not available yet.
            </div>

            {actionData?.error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {actionData.error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </Form>
        )}

        {!googleEnabled && !passwordAuthEnabled && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            No authentication methods are configured. Please contact the administrator.
          </div>
        )}
      </div>
    </div>
  );
}
