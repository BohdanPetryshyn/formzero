import { useState, useEffect } from "react"
import { useLoaderData, useFetcher } from "react-router"
import type { Route } from "./+types/forms.$formId.settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { ResultButton } from "#/components/result-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/components/ui/tooltip"
import { Mail, Lock, Server } from "lucide-react"

export const meta: Route.MetaFunction = () => {
  return [
    { title: `Settings | FormZero` },
    { name: "description", content: "Configure form settings and notifications" },
  ];
};

type FormSettings = {
  id: string
  form_id: string
  notification_email: string | null
  notification_email_password: string | null
  smtp_host: string | null
  smtp_port: number | null
  smtp_secure: number
}

// SMTP configurations for common email providers
const SMTP_CONFIGS: Record<string, { host: string; port: number; secure: boolean; hint: string }> = {
  "gmail.com": {
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    hint: "For Gmail, use an App Password instead of your regular password. Go to Google Account → Security → 2-Step Verification → App passwords."
  },
  "outlook.com": {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: true,
    hint: "For Outlook, use your regular Microsoft account password or an App Password if you have 2FA enabled."
  },
  "hotmail.com": {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: true,
    hint: "For Hotmail, use your regular Microsoft account password or an App Password if you have 2FA enabled."
  },
  "yahoo.com": {
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: true,
    hint: "For Yahoo, generate an App Password at: Account Info → Account Security → Generate app password."
  },
  "icloud.com": {
    host: "smtp.mail.me.com",
    port: 587,
    secure: true,
    hint: "For iCloud, use an App-Specific Password. Go to appleid.apple.com → Sign-In and Security → App-Specific Passwords."
  },
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const { formId } = params
  const db = context.cloudflare.env.DB

  // Fetch existing settings
  const settings = await db
    .prepare("SELECT * FROM form_settings WHERE form_id = ?")
    .bind(formId)
    .first()

  return {
    settings: settings as FormSettings | null,
    formId
  }
}

function getEmailDomain(email: string): string | null {
  const match = email.match(/@(.+)$/)
  return match ? match[1].toLowerCase() : null
}

export default function SettingsPage() {
  const { settings, formId } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const testFetcher = useFetcher()

  const [email, setEmail] = useState(settings?.notification_email || "")
  const [password, setPassword] = useState(settings?.notification_email_password || "")
  const [smtpHost, setSmtpHost] = useState(settings?.smtp_host || "")
  const [smtpPort, setSmtpPort] = useState(settings?.smtp_port?.toString() || "")

  // Initialize emailDomain and smtpConfig from settings on mount
  const initialEmail = settings?.notification_email || ""
  const initialDomain = getEmailDomain(initialEmail)
  const initialConfig = initialDomain && SMTP_CONFIGS[initialDomain] ? SMTP_CONFIGS[initialDomain] : null

  const [emailDomain, setEmailDomain] = useState<string | null>(initialDomain)
  const [smtpConfig, setSmtpConfig] = useState<typeof SMTP_CONFIGS[string] | null>(initialConfig)
  const [testPassed, setTestPassed] = useState(false)
  const [testResultValid, setTestResultValid] = useState(true)

  // Auto-detect SMTP settings based on email (debounced)
  useEffect(() => {
    const domain = getEmailDomain(email)

    // Only detect if there's content after @
    if (!domain) {
      setEmailDomain(null)
      setSmtpConfig(null)
      return
    }

    // Debounce provider detection
    const timer = setTimeout(() => {
      setEmailDomain(domain)

      if (SMTP_CONFIGS[domain]) {
        const config = SMTP_CONFIGS[domain]
        setSmtpConfig(config)
        setSmtpHost(config.host)
        setSmtpPort(config.port.toString())
      } else {
        // Unknown domain - show advanced settings
        setSmtpConfig(null)
        // Keep existing values or clear them
        if (!settings?.smtp_host) {
          setSmtpHost("")
          setSmtpPort("")
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [email, settings?.smtp_host])

  const isSaving = fetcher.state === "submitting"
  const isSaved = fetcher.state === "idle" && fetcher.data?.success

  const isTesting = testFetcher.state === "submitting"
  const testSuccess = testFetcher.state === "idle" && testFetcher.data?.success && testResultValid

  // Track when test succeeds
  useEffect(() => {
    if (testSuccess) {
      setTestPassed(true)
    }
  }, [testSuccess])

  // Reset test status and invalidate test result when form fields change
  useEffect(() => {
    setTestPassed(false)
    setTestResultValid(false)
  }, [email, password, smtpHost, smtpPort])

  const handleTestEmail = () => {
    setTestResultValid(true)

    const formData = new FormData()
    formData.append("notification_email", email)
    formData.append("notification_email_password", password)
    formData.append("smtp_host", smtpHost)
    formData.append("smtp_port", smtpPort)

    testFetcher.submit(formData, {
      method: "post",
      action: `/forms/${formId}/settings/notifications/test`
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-3 min-w-0">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Receive email notifications when someone submits this form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <fetcher.Form method="post" action={`/forms/${formId}/settings/notifications`}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Your Email
                </Label>
                <Input
                  id="email"
                  name="notification_email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This email will be used to send and receive notifications
                </p>
              </div>

              {emailDomain && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      SMTP Password
                    </Label>
                    <Input
                      id="password"
                      name="notification_email_password"
                      type="password"
                      placeholder="Enter your SMTP password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      {smtpConfig ? smtpConfig.hint : "Use your email password or app-specific password"}
                    </p>
                  </div>

                  {!smtpConfig && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host" className="flex items-center gap-2">
                          <Server className="h-4 w-4" />
                          SMTP Host
                        </Label>
                        <Input
                          id="smtp-host"
                          name="smtp_host"
                          type="text"
                          placeholder="smtp.example.com"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          The SMTP server address for your email provider
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input
                          id="smtp-port"
                          name="smtp_port"
                          type="number"
                          placeholder="587"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Common ports: 587 (TLS), 465 (SSL), 25 (Plain)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hidden inputs for SMTP config when auto-detected */}
                  {smtpConfig && (
                    <>
                      <input type="hidden" name="smtp_host" value={smtpHost} />
                      <input type="hidden" name="smtp_port" value={smtpPort} />
                    </>
                  )}

                  <div className="pt-4 space-y-3">
                    {testFetcher.data?.error && testResultValid && (
                      <p className="text-sm text-destructive">
                        {testFetcher.data.error}
                      </p>
                    )}
                    <TooltipProvider>
                      <div className="flex gap-2">
                        <ResultButton
                          type="button"
                          variant="outline"
                          isSubmitting={isTesting}
                          isSuccess={testSuccess}
                          loadingText="Sending..."
                          successText="Test email sent!"
                          disabled={!email || !password || !smtpHost || !smtpPort}
                          onClick={handleTestEmail}
                        >
                          Send test email
                        </ResultButton>
                        <Tooltip open={!testPassed ? undefined : false}>
                          <TooltipTrigger asChild>
                            <span>
                              <ResultButton
                                type="submit"
                                isSubmitting={isSaving}
                                isSuccess={isSaved}
                                loadingText="Saving..."
                                successText="Saved!"
                                disabled={!testPassed}
                              >
                                Save Settings
                              </ResultButton>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send a test email first to verify your settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </>
              )}
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  )
}
