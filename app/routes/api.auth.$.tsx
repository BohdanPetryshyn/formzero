import { type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { getAuth, isMultiUserEnabled, isPasswordAuthEnabled, getAllowedEmailDomain, getGoogleClientId, getGoogleClientSecret } from '#/lib/auth.server'

async function handleAuthRequest(request: Request, context: any) {
    const env = context.cloudflare.env as Env
    const auth = getAuth({
        database: env.DB,
        googleClientId: getGoogleClientId(env),
        googleClientSecret: getGoogleClientSecret(env),
        allowedEmailDomain: getAllowedEmailDomain(env),
        multiUserEnabled: isMultiUserEnabled(env),
        passwordAuthEnabled: isPasswordAuthEnabled(env),
    })

    return auth.handler(request)
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    return handleAuthRequest(request, context)
}

export async function action({ request, context }: ActionFunctionArgs) {
    return handleAuthRequest(request, context)
}
