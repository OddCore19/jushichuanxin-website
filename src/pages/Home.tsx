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
          <p className="hero-slogan">企业全周期权威背书、信任加持服务者，为创新企业的征途构筑留足迹、加冠冕。</p>
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
                <span className="node-title">专家执笔深度报道</span>
                <span className="node-desc">资深记者访谈写作，深挖企业潜在优势</span>
              </span>
            </a>
            <a href="#service-media-distribution" className="overview-node overview-node-2">
              <span className="node-dot">02</span>
              <span className="node-meta">
                <span className="node-title">权威发布与百科背书</span>
                <span className="node-desc">官媒首发联动传播，打造全网可查电子名片</span>
              </span>
            </a>
            <a href="#service-ip-branding" className="overview-node overview-node-3 node-left">
              <span className="node-dot">03</span>
              <span className="node-meta">
                <span className="node-title">企业宣传片传播</span>
                <span className="node-desc">场景化脚本创意，覆盖多平台定向投放</span>
              </span>
            </a>
            <a href="#service-book-project" className="overview-node overview-node-4">
              <span className="node-dot">04</span>
              <span className="node-meta">
                <span className="node-title">量身采访与著书服务</span>
                <span className="node-desc">企业家自传与企业著书，主编与顶级作者联合执笔</span>
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
              <p>{service.panelLine}</p>
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
