import { useState } from "react"
import { useParams } from "react-router"
import { Copy, Check } from "lucide-react"
import { Highlight, themes } from "prism-react-renderer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"

export default function IntegrationPage() {
  const params = useParams()
  const formId = params.formId
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Use browser location to construct endpoint
  const formEndpoint = typeof window !== "undefined"
    ? `${window.location.origin}/api/forms/${formId}/submissions`
    : `/api/forms/${formId}/submissions`

  const handleCopyEndpoint = async () => {
    await navigator.clipboard.writeText(formEndpoint)
    setCopiedEndpoint(true)
    setTimeout(() => setCopiedEndpoint(false), 2000)
  }

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const htmlExample = `<form action="${formEndpoint}" method="POST">
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message"></textarea>
  <button type="submit">Submit</button>
</form>`

  const jsExample = `fetch('${formEndpoint}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error))`

  const reactExample = `import { useState } from 'react'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('${formEndpoint}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Submit'}
      </button>
      {status === 'success' && <p>Message sent successfully!</p>}
      {status === 'error' && <p>Error sending message. Please try again.</p>}
    </form>
  )
}`

  return (
    <div className="flex flex-1 flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Endpoint</CardTitle>
          <CardDescription>
            Use this as your HTML form <code className="rounded bg-muted px-1 py-0.5 text-xs">action</code> URL or just send JSON to it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <code className="flex-1 rounded-md bg-muted px-3 py-2 text-xs font-mono break-all">
              {formEndpoint}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEndpoint}
              className="shrink-0 w-full sm:w-auto sm:px-3"
            >
              {copiedEndpoint ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span className="sm:hidden ml-2">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sm:hidden ml-2">Copy Endpoint</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Choose your preferred method to submit data to your form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html" className="w-full">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="mt-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(htmlExample)}
                  className="absolute top-2 right-2 z-10 h-7 px-2 text-xs"
                >
                  {copiedCode ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Highlight
                  theme={themes.vsDark}
                  code={htmlExample}
                  language="markup"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={className}
                      style={{
                        ...style,
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        padding: "0.75rem",
                        overflowX: "auto",
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            </TabsContent>

            <TabsContent value="javascript" className="mt-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(jsExample)}
                  className="absolute top-2 right-2 z-10 h-7 px-2 text-xs"
                >
                  {copiedCode ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Highlight
                  theme={themes.vsDark}
                  code={jsExample}
                  language="javascript"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={className}
                      style={{
                        ...style,
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        padding: "0.75rem",
                        overflowX: "auto",
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            </TabsContent>

            <TabsContent value="react" className="mt-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(reactExample)}
                  className="absolute top-2 right-2 z-10 h-7 px-2 text-xs"
                >
                  {copiedCode ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Highlight
                  theme={themes.vsDark}
                  code={reactExample}
                  language="jsx"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={className}
                      style={{
                        ...style,
                        margin: 0,
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        padding: "0.75rem",
                        overflowX: "auto",
                      }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
