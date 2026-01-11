import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import arrowDown from '../assets/arrow.svg'

function Home() {
  const snapHandledRef = useRef(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-animate]')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.35 },
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleSnap = () => {
      if (snapHandledRef.current) return
      const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight
      if (window.scrollY > heroHeight * 0.1) return
      snapHandledRef.current = true
      document.getElementById('services-start')?.scrollIntoView({ behavior: 'smooth' })
    }

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 30) return
      event.preventDefault()
      handleSnap()
    }

    let touchStartY = 0
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0
      if (touchStartY - currentY < 40) return
      event.preventDefault()
      handleSnap()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="home">
      <section className="hero scroll-section" data-animate ref={heroRef}>
        <div className="hero-content">
          <p className="eyebrow">聚时传薪文化发展有限公司</p>
          <h1 className="hero-title">聚时传薪</h1>
          <p className="hero-slogan">为你的核心优势打造权威背书，助创新企业构筑信任基石。</p>
          <a href="#services-start" className="scroll-down" aria-label="向下滚动">
            <span />
          </a>
        </div>
      </section>

      <section className="overview scroll-section" data-animate>
        <div className="overview-header">
          <p className="overview-title">我们的服务</p>
          <span className="overview-divider" />
        </div>
        <div className="overview-card">
          <div className="overview-core">
            <span className="core-label">全域发布</span>
            <span className="core-label">强效增信</span>
          </div>
          <div className="overview-branches">
            <a
              href="#service-content-production"
              className="overview-node overview-node-1 node-left"
            >
              <span className="node-dot">01</span>
              <span className="node-meta">
                <span className="node-title">内容制作</span>
                <span className="node-desc">图文、文案、拍摄与剪辑一体化</span>
              </span>
            </a>
            <a href="#service-media-distribution" className="overview-node overview-node-2">
              <span className="node-dot">02</span>
              <span className="node-meta">
                <span className="node-title">媒体投放</span>
                <span className="node-desc">抖音、头条、新华网等矩阵</span>
              </span>
            </a>
            <a href="#service-ip-branding" className="overview-node overview-node-3 node-left">
              <span className="node-dot">03</span>
              <span className="node-meta">
                <span className="node-title">权威背书</span>
                <span className="node-desc">百科词条与搜索曝光提升</span>
              </span>
            </a>
          </div>
        </div>
        <a href="#service-content-production" className="scroll-next" aria-label="向下滚动">
          <img className="scroll-next-icon" src={arrowDown} alt="" aria-hidden="true" />
        </a>
      </section>

      {services.map((service, index) => (
        <section
          key={service.id}
          id={`service-${service.id}`}
          className={`scroll-section service-panel service-panel-${index + 1}`}
          data-animate
        >
          {index === 0 ? <span id="services-start" className="anchor" /> : null}
          <div className="panel-content">
            <p className="eyebrow">核心业务 0{index + 1}</p>
            <h2>{service.title}</h2>
            <p className="panel-summary">{service.summary}</p>
            <p className="panel-details">{service.details}</p>
            <div className="panel-tags">
              {service.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="btn btn-ghost" to={`/cases/${service.caseId}`}>
              查看相关案例
            </Link>
          </div>
          <div className="panel-visual">
            <div className="panel-card">
              <h3>{service.title}</h3>
              <p>整合内容策划与传播执行，打造更具转化的传播节奏。</p>
            </div>
          </div>
          {index < services.length - 1 ? (
            <a
              href={`#service-${services[index + 1].id}`}
              className="scroll-next"
              aria-label="向下滚动"
            >
              <img className="scroll-next-icon" src={arrowDown} alt="" aria-hidden="true" />
            </a>
          ) : null}
        </section>
      ))}
    </div>
  )
}

export default Home
