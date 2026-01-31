import { betterAuth, type BetterAuthOptions } from "better-auth"
import { D1Dialect } from 'kysely-d1';

export interface AuthConfig {
    database: D1Database
    googleClientId?: string
    googleClientSecret?: string
    allowedEmailDomain?: string
    multiUserEnabled?: boolean
    passwordAuthEnabled?: boolean
}

export function getAuth({ database, googleClientId, googleClientSecret, allowedEmailDomain, multiUserEnabled, passwordAuthEnabled = true }: AuthConfig) {
    const socialProviders: BetterAuthOptions["socialProviders"] = {}

    // Only add Google provider if credentials are configured
    if (googleClientId && googleClientSecret) {
        socialProviders.google = {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        }
    }

    return betterAuth({
        database: {
           type: "sqlite",
           dialect: new D1Dialect({ database }),
        },
        emailAndPassword: {
            enabled: passwordAuthEnabled
        },
        socialProviders,
        account: {
            accountLinking: {
                enabled: true,
                trustedProviders: ["google"]
            }
        },
        databaseHooks: {
            user: {
                create: {
                    before: async (user) => {
                        // Enforce single-user mode: block new users if one already exists
                        if (!multiUserEnabled) {
                            const result = await database
                                .prepare("SELECT COUNT(*) as count FROM user")
                                .first<{ count: number }>();

                            if (result && result.count > 0) {
                                throw new Error("Registration is disabled. Only one user is allowed.")
                            }
                        }

                        // Validate email domain if restriction is configured
                        if (allowedEmailDomain) {
                            const emailDomain = user.email.split('@')[1]?.toLowerCase()
                            if (emailDomain !== allowedEmailDomain.toLowerCase()) {
                                throw new Error(`Only emails from @${allowedEmailDomain} are allowed`)
                            }
                        }

                        return { data: user }
                    }
                }
            }
        }
    })
}

// Helper to get env var from Cloudflare Env (which may include secrets not in the type)
function getEnvVar(env: Env, key: string): string | undefined {
    return (env as unknown as Record<string, string | undefined>)[key]
}

export function isGoogleEnabled(env: Env): boolean {
    return Boolean(getEnvVar(env, 'GOOGLE_CLIENT_ID') && getEnvVar(env, 'GOOGLE_CLIENT_SECRET'))
}

export function isMultiUserEnabled(env: Env): boolean {
    const value = getEnvVar(env, 'MULTI_USER_ENABLED')
    return value?.toLowerCase() === 'true'
}

export function isPasswordAuthEnabled(env: Env): boolean {
    const value = getEnvVar(env, 'PASSWORD_AUTH_ENABLED')
    // Default to true if not set
    return value?.toLowerCase() !== 'false'
}

export function getAllowedEmailDomain(env: Env): string | undefined {
    const value = getEnvVar(env, 'ALLOWED_EMAIL_DOMAIN')
    return value || undefined
}

export function getGoogleClientId(env: Env): string | undefined {
    return getEnvVar(env, 'GOOGLE_CLIENT_ID')
}

export function getGoogleClientSecret(env: Env): string | undefined {
    return getEnvVar(env, 'GOOGLE_CLIENT_SECRET')
}

export async function getUserCount({ database }: { database: D1Database }): Promise<number> {
    const result = await database
        .prepare("SELECT COUNT(*) as count FROM user")
        .first<{ count: number }>();

    if (!result) {
        throw new Error("Failed to retrieve user count");
    }

    return result.count;
}
