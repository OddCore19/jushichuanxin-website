export type Service = {
  id: string
  title: string
  summary: string
  details: string
  panelLine: string
  tags: string[]
  caseId: string
}

export const services: Service[] = [
  {
    id: 'content-production',
    title: '专家执笔深度报道',
    summary: '主流媒体资深记者亲笔，拒绝平庸通稿或 AI 软文。',
    details:
      '长期客户可由财经媒体专家深入实体访谈，结合全球全行业视角梳理竞争态势与潜在优势，用一篇报道让投资者、政策制定者与潜在合作伙伴读懂你的未来。',
    panelLine: '深度访谈与专业写作并行，把企业价值讲深、讲透、讲可信。',
    tags: ['专家执笔', '深度访谈', '降维打击', '结果导向'],
    caseId: 'case-content',
  },
  {
    id: 'media-distribution',
    title: '权威发布与百科背书',
    summary: '官媒首发资源 + 行业 IP 联动，形成立体覆盖。',
    details:
      '以权威发布为起点，联动视频号、微博等渠道精准触达目标人群，并推动百度百科收录，让流动报道沉淀为长期可查的企业公信力名片。',
    panelLine: '从权威首发到百科沉淀，构建可验证、可追溯的品牌背书链路。',
    tags: ['权威发布', '官媒首发', '百度百科', '全网可查'],
    caseId: 'case-distribution',
  },
  {
    id: 'ip-branding',
    title: '企业宣传片与场景化传播',
    summary: '以镜头语言讲述创业初心与核心能力，打造高性价比精良作品。',
    details:
      '依据覆盖目标与投放平台，定制 toB、toG、toC 的长短视频组合，并依托丰富 IP 资源库在视频号、抖音、快手、B 站及 YouTube 等平台进行定向传播。',
    panelLine: '用场景化影像表达品牌内核，让内容在多平台持续放大影响。',
    tags: ['企业宣传片', '创意脚本', '定向传播', '全平台覆盖'],
    caseId: 'case-ip',
  },
  {
    id: 'book-project',
    title: '量身打造采访与著书服务',
    summary: '为企业家写自传、为企业写书，匹配顶级作者与主编执笔团队。',
    details:
      '可对接专业代笔作者与财经作家资源，也可由公司业内资深主编直接执笔。公司主编在百度任职期间曾参与《李彦宏的百度世界》《人生可以走直线》《相信中国》《壹佰度》等热销书采访编撰；可对接作家包括程东升（《华为真相》《任正非管理日志》）与陈思进（《华尔街金融真相》）等数十位知名作者。支持从选题定位、深度采访到成书出版的全流程服务。',
    panelLine: '量身采访与名家执笔结合，把企业家经验沉淀成可长期流传的作品。',
    tags: ['企业家自传', '企业著书', '顶级作者对接', '热销书经验'],
    caseId: 'case-book',
  },
]
