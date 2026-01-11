export type CaseStudy = {
  id: string
  title: string
  serviceId: string
  intro: string
  story: string
  highlights: string[]
  results: string[]
  mediaType: 'video' | 'image'
  mediaLabel: string
}

export const cases: CaseStudy[] = [
  {
    id: 'case-content',
    title: '内容制作案例：品牌内容体系升级',
    serviceId: 'content-production',
    intro:
      '协助某新消费品牌完成内容体系重塑，统一视觉风格与叙事节奏。',
    story:
      '我们以品牌调性为核心，搭建内容关键词库，结合短视频与图文专题，形成持续输出的内容矩阵。',
    highlights: ['建立内容风格手册', '主理人出镜短视频系列', '月度主题策划机制'],
    results: ['内容完播率提升 62%', '3 个月增长粉丝 2.8 万', '品牌搜索热度提升'],
    mediaType: 'video',
    mediaLabel: '短视频样片占位',
  },
  {
    id: 'case-distribution',
    title: '投放案例：媒体矩阵精准触达',
    serviceId: 'media-distribution',
    intro:
      '为区域文旅项目搭建投放矩阵，覆盖核心新兴与权威媒体平台。',
    story:
      '结合人群画像与内容标签，我们在抖音、今日头条、新华网建立三段式投放节奏，实现声量与转化并进。',
    highlights: ['平台分层投放策略', 'KOL 协同传播', '官方号联动预热'],
    results: ['累计曝光 320 万+', '活动报名转化率提升 41%', '媒体转载 80+ 篇'],
    mediaType: 'image',
    mediaLabel: '投放报告可视化占位',
  },
  {
    id: 'case-ip',
    title: 'IP案例：权威背书与搜索提升',
    serviceId: 'ip-branding',
    intro:
      '为企业创始人打造权威叙事，建立百科词条与多平台背书。',
    story:
      '围绕行业贡献与核心观点，策划权威内容矩阵，提升搜索曝光并塑造专业形象。',
    highlights: ['百科词条梳理与审核', '权威媒体专访', '搜索关键词优化'],
    results: ['搜索首页信息覆盖率 92%', '行业背书引用增长', '客户咨询量提升'],
    mediaType: 'video',
    mediaLabel: '人物专访占位',
  },
]
