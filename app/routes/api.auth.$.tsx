import { data, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { getAuth, getUserCount } from '#/lib/auth.server'

async function handleAuthRequest(request: Request, context: any) {
    const auth = getAuth({ database: context.cloudflare.env.DB })
    const url = new URL(request.url)

    // Intercept signup requests to enforce single-user constraint
    if (url.pathname.includes('/sign-up/email') && request.method === 'POST') {
        const userCount = await getUserCount({ database: context.cloudflare.env.DB })

        if (userCount > 0) {
            // Return error response - only one user allowed
            return data({
                success: false,
                message: "An account already exists. Please login instead.",
                error: "SIGNUP_DISABLED"
            }, { status: 403 })
        }
    }

    return auth.handler(request)
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    return handleAuthRequest(request, context)
}

export async function action({ request, context }: ActionFunctionArgs) {
    return handleAuthRequest(request, context)
}
