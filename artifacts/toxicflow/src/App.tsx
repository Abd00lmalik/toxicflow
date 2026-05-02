import { Switch, Route, Router as WouterRouter } from 'wouter'
import { Web3Providers } from '@/components/wallet/Web3Providers'
import { Nav } from '@/components/layout/Nav'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Passport from '@/pages/Passport'
import Swap from '@/pages/Swap'
import Records from '@/pages/Records'
import PoolDefense from '@/pages/PoolDefense'
import Developers from '@/pages/Developers'
import Demo from '@/pages/Demo'

function NotFound() {
  return (
    <div className="page-content" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="display-md" style={{ marginBottom: 12 }}>404</div>
        <div className="body">Page not found</div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Web3Providers>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <div className="bg-aurora" />
        <div className="bg-grid" />
        <div className="bg-noise" />
        <Nav />
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/passport" component={Passport} />
          <Route path="/swap" component={Swap} />
          <Route path="/records" component={Records} />
          <Route path="/pool-defense" component={PoolDefense} />
          <Route path="/developers" component={Developers} />
          <Route path="/demo" component={Demo} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
    </Web3Providers>
  )
}

export default App
