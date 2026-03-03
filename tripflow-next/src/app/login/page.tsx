import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

export default function LoginPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Log in to access your trips</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
