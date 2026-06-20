import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cases } from '../data/cases'
import { loadDynamicContent } from '../data/dynamicContent'

function CaseDetail() {
  const { caseId } = useParams()
  const [caseItems, setCaseItems] = useState(cases)
  const [loadedDynamicContent, setLoadedDynamicContent] = useState(false)
  const caseItem = caseItems.find((item) => item.id === caseId)

  useEffect(() => {
    let mounted = true

    loadDynamicContent().then((content) => {
      if (mounted) {
        setCaseItems([...cases, ...content.cases])
        setLoadedDynamicContent(true)
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  if (!caseItem && !loadedDynamicContent) {
    return (
      <div className="page case-page">
        <section className="container case-not-found">
          <h1>案例加载中</h1>
          <p>正在读取案例内容。</p>
        </section>
      </div>
    )
  }

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
          ) : caseItem.mediaType === 'image' ? (
            <div className="media-frame image-frame">
              <div className="media-label">{caseItem.mediaLabel}</div>
              <div className="media-placeholder">图像占位</div>
            </div>
          ) : null}
          {caseItem.materialUrl ? (
            <div className="media-frame material-frame">
              <div className="media-label">案例物料</div>
              <a href={caseItem.materialUrl} target="_blank" rel="noreferrer">
                {caseItem.materialName || '查看案例物料'}
              </a>
            </div>
          ) : (
            !caseItem.mediaType && (
              <div className="media-frame image-frame">
                <div className="media-label">案例物料</div>
                <div className="media-placeholder">暂无上传物料</div>
              </div>
            )
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
