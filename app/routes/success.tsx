import type { Route } from "./+types/success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Submission Successful" },
    { name: "description", content: "Your form has been submitted successfully." },
  ];
}

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your submission. We've received your information and will get back to you soon.
          </p>
        </div>
      </div>
    </div>
  );
}
