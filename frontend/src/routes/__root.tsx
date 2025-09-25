import Container from '@/components/layout/container'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <>
    <Header/>
    <Container>
      <Outlet />
    </Container>
    <TanStackRouterDevtools />
    <Footer/>
  </>
)

export const Route = createRootRoute({ component: RootLayout })