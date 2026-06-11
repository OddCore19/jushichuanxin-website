require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const BASE_PATH = (process.env.BASE_PATH || '/contact').replace(/\/+$/, '') || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-now';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'replace-this-secret';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json({ limit: '1mb' }));
app.use(BASE_PATH || '/', express.static(path.join(__dirname, 'public')));

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]'); }
  catch { return []; }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
function signToken(value) {
  return crypto.createHmac('sha256', COOKIE_SECRET).update(value).digest('hex');
}
function isAdmin(req) {
  const token = req.cookies.jscx_admin;
  if (!token) return false;
  const [value, sig] = token.split('.');
  return value === 'ok' && sig === signToken(value);
}
function requireAdmin(req, res, next) {
  if (!isAdmin(req)) return res.status(401).json({ error: '未登录或登录已过期' });
  next();
}
function arr(v) {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}
function countBy(items, field, multiple=false) {
  const m = {};
  for (const it of items) {
    const v = it.answers?.[field];
    const values = multiple ? arr(v) : (v ? [String(v)] : []);
    for (const x of values) m[x] = (m[x] || 0) + 1;
  }
  return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
}
function avgScore(items) {
  if (!items.length) return 0;
  return Math.round(items.reduce((s,it)=>s+(it.score||0),0)/items.length);
}
function calcScore(a) {
  let score = 0;
  const addIf = (cond, pts) => { if (cond) score += pts; };
  addIf(['20–50 万','50–100 万','100 万以上'].includes(a['年度品牌传播投入']), 20);
  addIf(['年度品牌顾问','长期战略合作'].includes(a['合作模式']), 20);
  addIf(['非常重视','正在尝试'].includes(a['长期品牌资产意向']), 15);
  addIf(['非常希望','有兴趣但没有方向'].includes(a['是否打造创始人IP']), 15);
  addIf(arr(a['感兴趣服务方向']).some(x=>['企业深度采访','财经报道','企业家 IP 打造','图书出版','长期品牌顾问服务','企业宣传片'].includes(x)), 15);
  addIf(['2000 万元～4 亿元','＞4 亿元'].includes(a['企业年营收规模']), 15);
  return Math.min(score, 100);
}
function conclusions(items) {
  const top = (field, multiple=false) => countBy(items, field, multiple).slice(0,3).map(x=>x.name).join('、') || '暂无数据';
  const n = items.length;
  if (!n) return ['暂无提交数据。'];
  const c = [];
  c.push(`当前已收集 ${n} 份问卷，平均客户意向评分为 ${avgScore(items)} 分。`);
  c.push(`客户最集中的品牌问题是：${top('最大品牌问题', true)}。`);
  c.push(`客户最缺少的核心能力集中在：${top('目前最缺少')}。`);
  c.push(`最受关注的服务方向是：${top('感兴趣服务方向', true)}。`);
  c.push(`合作模式偏好集中在：${top('合作模式')}。`);
  return c;
}
function toCsv(items) {
  const headers = ['提交时间','IP','意向评分','企业名称','所属行业','企业当前发展阶段','企业规模','企业年营收规模','最大品牌问题','目前最缺少','品牌团队配置','品牌传播依赖','是否打造创始人IP','企业家公开输出','创始人最大问题','企业家IP目标','感兴趣服务方向','偏好内容形式','优先解决问题','年度品牌传播投入','合作模式','品牌建设最大困难','长期品牌资产意向','期待合作方能力','优先沟通内容','联系人姓名','职务','电话微信','邮箱'];
  const esc = v => '"' + String(Array.isArray(v)?v.join('；'):(v ?? '')).replace(/"/g,'""') + '"';
  const rows = [headers.map(esc).join(',')];
  for (const it of items) rows.push(headers.map(h => esc(h==='提交时间'?it.createdAt:h==='IP'?it.ip:h==='意向评分'?it.score:it.answers?.[h])).join(','));
  return '\ufeff' + rows.join('\n');
}

app.post(`${BASE_PATH}/api/submit`, (req, res) => {
  const answers = req.body || {};
  if (!answers['企业名称'] || !answers['联系人姓名'] || !answers['电话微信']) {
    return res.status(400).json({ error: '请至少填写企业名称、联系人姓名、电话/微信。' });
  }
  const data = readData();
  const item = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0],
    userAgent: req.headers['user-agent'] || '',
    score: calcScore(answers),
    answers
  };
  data.push(item);
  writeData(data);
  res.json({ ok: true, id: item.id, score: item.score });
});

app.post(`${BASE_PATH}/api/admin/login`, (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: '密码错误' });
  const value = 'ok';
  res.cookie('jscx_admin', value + '.' + signToken(value), { httpOnly: true, sameSite: 'lax', maxAge: 7*24*3600*1000 });
  res.json({ ok: true });
});
app.post(`${BASE_PATH}/api/admin/logout`, (req,res)=>{ res.clearCookie('jscx_admin'); res.json({ok:true}); });
app.get(`${BASE_PATH}/api/admin/submissions`, requireAdmin, (req, res) => res.json(readData().sort((a,b)=>b.createdAt.localeCompare(a.createdAt))));
app.get(`${BASE_PATH}/api/admin/stats`, requireAdmin, (req, res) => {
  const items = readData();
  res.json({
    total: items.length,
    averageScore: avgScore(items),
    conclusions: conclusions(items),
    charts: {
      industry: countBy(items, '所属行业'),
      revenue: countBy(items, '企业年营收规模'),
      budget: countBy(items, '年度品牌传播投入'),
      cooperation: countBy(items, '合作模式'),
      missing: countBy(items, '目前最缺少'),
      problems: countBy(items, '最大品牌问题', true),
      services: countBy(items, '感兴趣服务方向', true),
      contentTypes: countBy(items, '偏好内容形式', true),
      founderIp: countBy(items, '是否打造创始人IP')
    }
  });
});
app.get(`${BASE_PATH}/api/admin/export.csv`, requireAdmin, (req, res) => {
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="jscx-survey-submissions.csv"');
  res.send(toCsv(readData()));
});

if (BASE_PATH) {
  app.get(BASE_PATH, (req, res) => res.redirect(301, `${BASE_PATH}/`));
}
app.get(`${BASE_PATH}/admin`, (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get(`${BASE_PATH}/*`, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, HOST, () => console.log(`JSCX survey app running on http://${HOST}:${PORT}${BASE_PATH || ''}`));
