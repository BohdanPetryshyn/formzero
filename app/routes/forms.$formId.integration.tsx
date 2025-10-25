import { useParams } from "react-router"
import { Code } from "lucide-react"

export default function IntegrationPage() {
  const params = useParams()
  const formId = params.formId

  const formEndpoint = `https://your-worker.workers.dev/api/forms/${formId}/submissions`

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integration</h2>
        <p className="text-muted-foreground">
          Integrate {formId} with your website or application
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="h-5 w-5" />
          <h3 className="font-semibold">Form Endpoint</h3>
        </div>
        <div className="rounded-md bg-muted p-4 font-mono text-sm">
          {formEndpoint}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">HTML Example</h3>
        <pre className="rounded-md bg-muted p-4 text-sm overflow-x-auto">
          <code>{`<form action="${formEndpoint}" method="POST">
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message"></textarea>
  <button type="submit">Submit</button>
</form>`}</code>
        </pre>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">JavaScript Example</h3>
        <pre className="rounded-md bg-muted p-4 text-sm overflow-x-auto">
          <code>{`fetch('${formEndpoint}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})`}</code>
        </pre>
      </div>
    </div>
  )
}
