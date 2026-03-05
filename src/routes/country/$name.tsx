import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/country/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/country/$name"!</div>
}
