import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceAdmin from './pages/ServiceAdmin'
import About from './pages/About'
import CaseDetail from './pages/CaseDetail'
import NotFound from './pages/NotFound'
import { cases } from './data/cases'
import { loadDynamicContent } from './data/dynamicContent'
import logoLockup from './assets/jscx-logo-lockup-white.png'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

function CaseDropdown() {
  const [caseLinks, setCaseLinks] = useState(cases)
  const [hasLoadedDynamicCases, setHasLoadedDynamicCases] = useState(false)

  const loadDynamicCases = () => {
    if (hasLoadedDynamicCases) return
    setHasLoadedDynamicCases(true)
    loadDynamicContent().then((content) => {
      if (content.cases.length) setCaseLinks([...cases, ...content.cases])
    })
  }

  return (
    <div className="nav-item has-dropdown" onMouseEnter={loadDynamicCases} onFocus={loadDynamicCases}>
      <span className="nav-link">案例</span>
      <div className="dropdown">
        {caseLinks.map((item) => (
          <NavLink key={item.id} to={`/cases/${item.id}`} className="dropdown-link">
            {item.title}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/services/admin')

  return (
    <div className={`app${isAdminRoute ? ' app-admin' : ''}`}>
      <ScrollToTop />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img className="brand-logo" src={logoLockup} alt="聚时传薪 JSCX" />
            <div className="brand-text">
              <span className="brand-name">聚时传薪</span>
              <span className="brand-subtitle">文化发展有限公司</span>
            </div>
          </Link>
          <nav className="nav">
            <NavLink to="/" className="nav-link">
              主页
            </NavLink>
            <NavLink to="/services" className="nav-link">
              服务概览
            </NavLink>
            <NavLink to="/about" className="nav-link">
              关于我们
            </NavLink>
            <CaseDropdown />
            <a href="/contact/" className="nav-link">
              业务咨询
            </a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/admin" element={<ServiceAdmin />} />
          <Route path="/about" element={<About />} />
          <Route path="/cases/:caseId" element={<CaseDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-brand">聚时传薪文化发展有限公司</p>
            <p className="footer-note">以内容与传播驱动品牌势能。</p>
          </div>
          <div className="footer-links">
            <Link to="/services">服务概览</Link>
            <Link to="/about">关于我们</Link>
            <a href="/contact/">咨询合作</a>
          </div>
        </div>
      </footer>
      <div className="bottom-bar">
        <div className="container bottom-bar-inner">
          <div>
            <span className="bottom-label">地址</span>
            <span>北京市 · 朝阳区</span>
          </div>
          <div>
            <span className="bottom-label">联系方式</span>
            <span>18611630797 · contact@chuanxin.com</span>
          </div>
          <div>
            <span className="bottom-label">ICP备案</span>
            <span>京ICP备2026015800号-1</span>
          </div>
          <div>
            <a
              className="police-record"
              href="https://beian.mps.gov.cn/#/query/webSearch?code=11010502061796"
              target="_blank"
              rel="noreferrer"
              aria-label="京公网安备11010502061796号"
            >
              <svg className="police-badge-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5 19 5v5.8c0 4.7-2.7 8.9-7 10.7-4.3-1.8-7-6-7-10.7V5l7-2.5Z" />
                <path d="m12 7.1 1.1 2.2 2.4.35-1.75 1.7.42 2.4L12 12.62l-2.16 1.14.41-2.4-1.74-1.7 2.4-.35L12 7.1Z" />
              </svg>
              <span>京公网安备11010502061796号</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
