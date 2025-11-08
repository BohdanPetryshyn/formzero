export type Submission = {
  id: string
  form_id: string
  data: Record<string, any>
  created_at: number
}

export type SubmissionEmailData = {
  id: string
  formId: string
  formName: string
  data: Record<string, any>
  createdAt: number
}
