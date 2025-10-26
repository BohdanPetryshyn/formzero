import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/signup";
import { getAuth, getUserCount } from "#/lib/auth.server";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth.client";

export async function loader({ request, context }: Route.LoaderArgs) {
  const database = context.cloudflare.env.DB;
  const auth = getAuth({ database });

  // Redirect to app if already logged in
  const session = await auth.api.getSession({
      headers: request.headers
  });
  if (session?.user) {
    return redirect("/forms");
  }

  // Redirect to login if users already exist
  const userCount = await getUserCount({ database });
  if (userCount > 0) {
    return redirect("/login");
  }

  return {};
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
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

export default function Signup() {
  const actionData = useActionData<typeof clientAction>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to FormZero</h1>
          <p className="mt-2 text-muted-foreground">
            Create your account to get started
          </p>
        </div>

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
      </div>
    </div>
  );
}
