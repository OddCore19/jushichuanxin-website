import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import { loadDynamicContent } from '../data/dynamicContent'

function Services() {
  const [serviceCards, setServiceCards] = useState(services)

  useEffect(() => {
    let mounted = true

    loadDynamicContent().then((content) => {
      if (mounted) setServiceCards([...services, ...content.services])
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="page services-page">
      <section className="page-hero">
        <div className="container services-hero-inner">
          <div>
            <p className="eyebrow">服务概览</p>
            <h1>聚焦增信与传播的业务模块</h1>
            <p className="page-intro">
              从专家深度报道、权威发布背书到企业宣传片传播，帮助创新企业构建长期可复用的公信力资产。
            </p>
            <p className="page-intro">以上报价皆为 2026 年税前价格，支持全年框架合作与单项服务组合。</p>
          </div>
          <Link className="admin-entry" to="/services/admin">
            管理员入口
          </Link>
        </div>
      </section>

      <section className="container services-grid">
        {serviceCards.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-card-header">
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
            </div>
            <p className="service-card-details">{service.details}</p>
            <div className="service-card-tags">
              {service.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {service.caseId ? (
              <Link className="btn btn-ghost" to={`/cases/${service.caseId}`}>
                查看案例
              </Link>
            ) : (
              <span className="service-card-note">暂无关联案例</span>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

export default Services
