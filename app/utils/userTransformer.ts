interface User {
  id: number
  name: string
  email: string
  password: string
  phoneNumber: string
}

export const userTransformer = (user: User): Record<string, any> => {
  return {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber
  }
}
