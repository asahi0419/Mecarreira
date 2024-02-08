interface RequestParams {
  email?: string
  old_password?: string
  password?: string
  confirm_password?: string
  otp?: string
  user_secret?: string
  confirm_secret?: string
  location?: string|number
}

export type { RequestParams }
