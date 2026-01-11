export type Service = {
  id: string
  title: string
  summary: string
  details: string
  tags: string[]
  caseId: string
}

export const services: Service[] = [
  {
    id: 'content-production',
    title: '自媒体内容制作',
    summary: '图文、文案、视频拍摄与短视频剪辑一体化。',
    details:
      '从选题策划到脚本落地，整合拍摄与后期剪辑，打造高转化内容资产。',
    tags: ['图文', '文案', '视频拍摄', '剪辑'],
    caseId: 'case-content',
  },
  {
    id: 'media-distribution',
    title: '媒体平台内容投放',
    summary: '覆盖抖音、今日头条、新华网等新兴与传统媒体矩阵。',
    details: '定制投放策略，建立内容扩散路径，持续提升触达与曝光效率。',
    tags: ['抖音', '今日头条', '新华网', '矩阵投放'],
    caseId: 'case-distribution',
  },
  {
    id: 'ip-branding',
    title: '企业与个人IP塑造',
    summary: '百科词条、权威背书、搜索曝光度提升的系统工程。',
    details:
      '梳理品牌话语体系，形成权威背书内容闭环，提升搜索与行业声量。',
    tags: ['百科词条', '权威背书', '搜索曝光'],
    caseId: 'case-ip',
  },
]
