import { Link, useParams } from 'react-router-dom'
import { cases } from '../data/cases'

function CaseDetail() {
  const { caseId } = useParams()
  const caseItem = cases.find((item) => item.id === caseId)

  if (!caseItem) {
    return (
      <div className="page case-page">
        <section className="container case-not-found">
          <h1>案例未找到</h1>
          <p>该案例正在更新中，欢迎查看其他案例。</p>
          <Link className="btn" to="/services">
            返回服务概览
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page case-page">
      <section className="page-hero case-hero">
        <div className="container">
          <p className="eyebrow">服务案例</p>
          <h1>{caseItem.title}</h1>
          <p className="page-intro">{caseItem.intro}</p>
        </div>
      </section>

      <section className="container case-body">
        <div className="case-story">
          <h2>案例背景</h2>
          <p>{caseItem.story}</p>
          <div className="case-list">
            <h3>核心执行</h3>
            <ul>
              {caseItem.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="case-list">
            <h3>关键结果</h3>
            <ul>
              {caseItem.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="case-media">
          {caseItem.mediaType === 'video' ? (
            <div className="media-frame video-frame">
              <div className="media-label">{caseItem.mediaLabel}</div>
              <div className="media-placeholder">视频占位</div>
            </div>
          ) : (
            <div className="media-frame image-frame">
              <div className="media-label">{caseItem.mediaLabel}</div>
              <div className="media-placeholder">图像占位</div>
            </div>
          )}
          <Link className="btn btn-ghost" to="/contact">
            预约定制方案
          </Link>
        </div>
      </section>
    </div>
  )
}

export default CaseDetail
