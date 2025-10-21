// Simple Welcome Component for testing demonstration

interface WelcomeProps {
  name: string
  title?: string
}

export function Welcome({ name, title = 'Welcome' }: WelcomeProps) {
  return (
    <div className="welcome-container">
      <h1>{title}, {name}!</h1>
      <p>This is your first tested component.</p>
      <p>Happy learning about testing!</p>
    </div>
  )
}
