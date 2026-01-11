import { Link } from 'react-router-dom'
import { services } from '../data/services'

function Services() {
  return (
    <div className="page services-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">服务概览</p>
          <h1>聚焦内容与传播的三大业务模块</h1>
          <p className="page-intro">
            从内容生产、媒体投放到IP塑造，帮助品牌构建长期可复用的传播资产。
          </p>
        </div>
      </section>

      <section className="container services-grid">
        {services.map((service) => (
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
            <Link className="btn btn-ghost" to={`/cases/${service.caseId}`}>
              查看案例
            </Link>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Services
