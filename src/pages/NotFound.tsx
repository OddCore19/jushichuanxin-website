import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page not-found">
      <section className="container not-found-card">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <p>你访问的页面暂时不可用，请返回首页。</p>
        <Link className="btn" to="/">
          返回主页
        </Link>
      </section>
    </div>
  )
}

export default NotFound
