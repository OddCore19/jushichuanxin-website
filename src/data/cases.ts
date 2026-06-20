export type CaseStudy = {
  id: string
  title: string
  serviceId: string
  intro: string
  story: string
  highlights: string[]
  results: string[]
  mediaType?: 'video' | 'image'
  mediaLabel?: string
  materialUrl?: string
  materialName?: string
  materialType?: string
}

export const cases: CaseStudy[] = [
  {
    id: 'case-content',
    title: '深度报道案例：科技企业核心价值挖掘',
    serviceId: 'content-production',
    intro:
      '为某科技企业完成创始团队深度访谈与行业视角报道，形成可对外传播的核心叙事。',
    story:
      '围绕企业技术路径、产业位置与未来规划，记者团队进行多轮访谈和事实核验，最终沉淀出一篇兼具专业性与传播性的深度稿件。',
    highlights: ['财经媒体专家深访', '竞争态势与趋势分析', '潜在优势结构化表达'],
    results: ['投资人沟通效率提升', '合作方对业务认知更清晰', '对外传播口径统一'],
    mediaType: 'video',
    mediaLabel: '深度访谈内容占位',
  },
  {
    id: 'case-distribution',
    title: '发布案例：权威首发与百科收录闭环',
    serviceId: 'media-distribution',
    intro:
      '围绕企业阶段性里程碑，完成官媒首发、行业 IP 转发与百度百科词条收录。',
    story:
      '我们将发布内容拆解为权威信源、社交扩散与搜索沉淀三段，确保报道可见、可信、可追溯，持续支撑企业品牌增信。',
    highlights: ['权威媒体首发对接', '视频号与微博协同扩散', '百科词条资料梳理与提交'],
    results: ['形成全网可查证据链', '品牌公信力表达更完整', '重要信息沉淀为长期资产'],
    mediaType: 'image',
    mediaLabel: '发布与收录报告占位',
  },
  {
    id: 'case-ip',
    title: '宣传片案例：场景化脚本与定向传播',
    serviceId: 'ip-branding',
    intro:
      '从创业初心与核心能力出发，为企业制作宣传片并制定多平台投放策略。',
    story:
      '项目按 toB 与 toC 两条叙事线完成脚本创作和拍摄执行，随后在视频号为主阵地并联动抖音、快手、B 站等平台定向扩散。',
    highlights: ['场景化分镜脚本', '精良拍摄与后期制作', '多平台定向投放组合'],
    results: ['品牌故事表达更完整', '不同客群触达效率提升', '视频素材可复用到多场景'],
    mediaType: 'video',
    mediaLabel: '企业宣传片样片占位',
  },
  {
    id: 'case-book',
    title: '著书案例：企业家口述史与企业发展方法论成书',
    serviceId: 'book-project',
    intro:
      '围绕企业家经历与企业成长路径，开展量身采访并完成商业传记型图书策划与写作。',
    story:
      '项目由资深主编统筹，联合专业财经作者完成深度访谈、结构搭建与成稿打磨。根据受众定位分别强化人物叙事、管理方法与行业洞察，形成可出版、可传播、可长期沉淀的内容资产。',
    highlights: ['定制采访提纲与多轮访谈', '主编与作者联合执笔', '从选题到成书全流程把控'],
    results: ['企业家品牌形象更立体', '企业发展经验形成系统表达', '可用于外宣、内训与品牌传播'],
    mediaType: 'image',
    mediaLabel: '图书策划与成稿展示占位',
  },
]
