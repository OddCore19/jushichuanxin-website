function Contact() {
  return (
    <div className="page contact-page">
      <section className="page-hero" id="contact-start">
        <div className="container">
          <p className="eyebrow">业务咨询</p>
          <h1>让我们了解你的需求</h1>
          <p className="page-intro">
            填写信息后我们会尽快联系你，提供定制化的内容与传播解决方案。
          </p>
        </div>
      </section>

      <section className="container contact-form">
        <form className="form-card">
          <div className="form-grid">
            <label>
              <span>咨询主体</span>
              <select name="identity">
                <option value="personal">个人</option>
                <option value="company">企业</option>
              </select>
            </label>
            <label>
              <span>姓名或公司名称 *</span>
              <input name="name" placeholder="请填写姓名或公司名称" required />
            </label>
            <label>
              <span>手机 *</span>
              <input name="phone" placeholder="请填写手机号" required />
            </label>
            <label>
              <span>微信</span>
              <input name="wechat" placeholder="建议填写微信号" />
            </label>
            <label>
              <span>联系邮箱 *</span>
              <input name="email" type="email" placeholder="name@example.com" required />
            </label>
            <label>
              <span>咨询服务</span>
              <select name="service">
                <option value="content">自媒体内容制作</option>
                <option value="distribution">媒体平台内容投放</option>
                <option value="ip">企业及个人IP塑造</option>
                <option value="other">其他</option>
              </select>
            </label>
          </div>
          <label className="textarea">
            <span>咨询内容 *</span>
            <textarea
              name="message"
              rows={6}
              maxLength={300}
              placeholder="请描述你的需求（不超过300字）"
              required
            />
            <span className="hint">最多 300 字</span>
          </label>
          <button type="submit" className="btn">
            提交咨询
          </button>
          <p className="form-note">
            当前为演示版本，提交后不会真实发送。后续可接入邮件和数据库。
          </p>
        </form>
      </section>
    </div>
  )
}

export default Contact
