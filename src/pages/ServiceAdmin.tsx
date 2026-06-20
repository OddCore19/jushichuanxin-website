import { useState } from 'react'
import type { FormEvent } from 'react'

type ServiceContent = {
  id: string
  title: string
  summary: string
  details: string
  tags: string[]
  caseId?: string
}

type ContentResponse = {
  services: ServiceContent[]
}

type ApiResult<T> = {
  ok: boolean
  status: number
  data?: T
  error?: string
}

const API_BASES = import.meta.env.DEV ? ['/api'] : ['/api', '/contact/api']

async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  let lastError = '内容服务暂不可用。'

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init?.headers || {}),
        },
      })
      const contentType = response.headers.get('content-type') || ''

      if (!contentType.includes('application/json')) {
        lastError = '内容服务未接入，请确认 Node 项目和 Nginx 反向代理。'
        continue
      }

      const data = (await response.json()) as T & { error?: string }
      return {
        ok: response.ok,
        status: response.status,
        data,
        error: response.ok ? undefined : data.error || '请求失败',
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
    }
  }

  return { ok: false, status: 0, error: lastError }
}

function readMaterial(file: File | null) {
  if (!file) return Promise.resolve(null)
  if (file.size > 6 * 1024 * 1024) {
    return Promise.reject(new Error('案例物料不能超过 6MB'))
  }

  return new Promise<{ fileName: string; mimeType: string; data: string }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({
        fileName: file.name,
        mimeType: file.type,
        data: String(reader.result || ''),
      })
    reader.onerror = () => reject(new Error('物料读取失败'))
    reader.readAsDataURL(file)
  })
}

function ServiceAdmin() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [services, setServices] = useState<ServiceContent[]>([])
  const [createCase, setCreateCase] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadContent = async () => {
    const result = await apiRequest<ContentResponse>('/admin/content')

    if (result.status === 401) {
      setIsAuthed(false)
      return
    }

    if (!result.ok) {
      setIsError(true)
      setMessage(result.error || '内容服务暂不可用。')
      return
    }

    setServices(result.data?.services || [])
    setIsAuthed(true)
    setIsError(false)
    setMessage('')
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')

    const result = await apiRequest<{ ok: boolean }>('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!result.ok) {
      setIsError(true)
      setMessage(result.error || '密码错误或内容服务暂不可用。')
      return
    }

    await loadContent()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const materialInput = form.elements.namedItem('material') as HTMLInputElement | null

    setIsSaving(true)
    setIsError(false)
    setMessage('正在保存...')

    try {
      const payload = {
        service: {
          title: data.get('title'),
          summary: data.get('summary'),
          details: data.get('details'),
          tags: data.get('tags'),
          panelLine: data.get('panelLine'),
        },
        createCase,
        caseStudy: {
          title: data.get('caseTitle'),
          intro: data.get('caseIntro'),
          story: data.get('caseStory'),
          highlights: data.get('caseHighlights'),
          results: data.get('caseResults'),
        },
        material: createCase ? await readMaterial(materialInput?.files?.[0] || null) : null,
      }

      const result = await apiRequest<{ ok: boolean }>('/admin/content/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!result.ok) throw new Error(result.error || '保存失败')

      form.reset()
      setCreateCase(false)
      setIsError(false)
      setMessage('已保存。')
      await loadContent()
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await apiRequest('/admin/logout', { method: 'POST' })
    setIsAuthed(false)
    setServices([])
  }

  return (
    <div className="page service-admin-page">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">内容管理</p>
          <h1>服务概览管理员入口</h1>
          <p className="page-intro">新增服务卡片只会出现在服务概览页；主页核心业务模块保持人工维护。</p>
        </div>
      </section>

      <section className="container service-admin-layout">
        {!isAuthed ? (
          <form className="admin-card admin-login-card" onSubmit={handleLogin}>
            <h2>登录</h2>
            <p>使用问卷后台同一个 ADMIN_PASSWORD。</p>
            <label>
              后台密码
              <input name="password" type="password" placeholder="ADMIN_PASSWORD" required />
            </label>
            <button className="btn" type="submit">
              登录
            </button>
            {message ? <p className={isError ? 'admin-message error' : 'admin-message'}>{message}</p> : null}
          </form>
        ) : (
          <>
            <form className="admin-card admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-head">
                <div>
                  <h2>新增服务卡片</h2>
                  <p>填写主标题、副标题、介绍和标签；如需生成案例页，再勾选添加案例。</p>
                </div>
                <button className="btn btn-ghost" type="button" onClick={handleLogout}>
                  退出
                </button>
              </div>

              <div className="admin-fields">
                <label>
                  主标题
                  <input name="title" maxLength={120} placeholder="例如：创始人 IP 系统打造" required />
                </label>
                <label>
                  副标题
                  <input name="summary" maxLength={180} placeholder="一句话说明服务价值" required />
                </label>
                <label className="full">
                  介绍
                  <textarea name="details" maxLength={1200} placeholder="说明服务内容、适用场景和交付方式" required />
                </label>
                <label className="full">
                  标签
                  <input name="tags" placeholder="用逗号或顿号分隔，例如：创始人IP，深度访谈，长期顾问" />
                </label>
                <label className="full">
                  卡片补充语
                  <input name="panelLine" maxLength={180} placeholder="可选，不填则使用副标题" />
                </label>
              </div>

              <label className="admin-toggle">
                <input type="checkbox" checked={createCase} onChange={(event) => setCreateCase(event.target.checked)} />
                同时添加可查看案例
              </label>

              {createCase ? (
                <div className="admin-fields case-admin-fields">
                  <label>
                    案例标题
                    <input name="caseTitle" maxLength={160} />
                  </label>
                  <label>
                    案例简介
                    <input name="caseIntro" maxLength={400} />
                  </label>
                  <label className="full">
                    案例背景
                    <textarea name="caseStory" maxLength={2000} />
                  </label>
                  <label>
                    核心执行
                    <textarea name="caseHighlights" placeholder="每行一条，或用逗号分隔" />
                  </label>
                  <label>
                    关键结果
                    <textarea name="caseResults" placeholder="每行一条，或用逗号分隔" />
                  </label>
                  <label className="full">
                    案例物料
                    <input name="material" type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip" />
                  </label>
                </div>
              ) : null}

              <div className="admin-actions">
                <button className="btn" type="submit" disabled={isSaving}>
                  {isSaving ? '保存中' : '保存内容'}
                </button>
                <button className="btn btn-ghost" type="reset" onClick={() => setCreateCase(false)}>
                  清空
                </button>
              </div>
              {message ? <p className={isError ? 'admin-message error' : 'admin-message'}>{message}</p> : null}
            </form>

            <aside className="admin-card admin-list">
              <h2>已添加服务卡片</h2>
              {services.length ? (
                <div className="admin-items">
                  {services.map((service) => (
                    <article key={service.id} className="admin-item">
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                      <div className="service-card-tags">
                        {service.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      {service.caseId ? <a href={`/cases/${service.caseId}`}>查看关联案例</a> : <span>未添加案例</span>}
                    </article>
                  ))}
                </div>
              ) : (
                <p>还没有新增服务卡片。</p>
              )}
            </aside>
          </>
        )}
      </section>
    </div>
  )
}

export default ServiceAdmin
