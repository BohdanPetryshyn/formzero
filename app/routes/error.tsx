import type { Route } from "./+types/error";

const errorMessages = {
  form_not_found: {
    title: "Form Not Found",
    description: "The form you're trying to submit to doesn't exist. Please check the form URL and try again.",
  },
  internal_error: {
    title: "Something Went Wrong",
    description: "We encountered an error while processing your submission. Please try again later.",
  },
  unsupported_content_type: {
    title: "Unsupported Format",
    description: "The format of your submission is not supported. Please check your form configuration.",
  },
} as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Error - FormZero" },
    { name: "description", content: "An error occurred while processing your request." },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const errorType = url.searchParams.get("error") as keyof typeof errorMessages | null;

  const errorData = errorType && errorMessages[errorType]
    ? errorMessages[errorType]
    : errorMessages.internal_error;

  return { errorData };
}

export default function Error({ loaderData }: Route.ComponentProps) {
  const { errorData } = loaderData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorData.title}
          </h1>
          <p className="text-gray-600">
            {errorData.description}
          </p>
        </div>
      </div>
    </div>
  );
}
