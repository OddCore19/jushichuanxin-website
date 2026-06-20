require('dotenv').config();

const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
const REPORT_WINDOW_HOURS = Number(process.env.REPORT_WINDOW_HOURS || 24);
const SEND_EMPTY = String(process.env.DAILY_REPORT_SEND_EMPTY || 'true') !== 'false';

function readSubmissions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
  } catch (error) {
    throw new Error(`Failed to read ${DATA_FILE}: ${error.message}`);
  }
}

function writeSubmissions(items) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(items, null, 2), 'utf8');
  fs.renameSync(tempFile, DATA_FILE);
}

function recipients() {
  return (process.env.MAIL_TO || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function value(input) {
  if (Array.isArray(input)) return input.join('；');
  return input || '-';
}

function renderSubmission(item, index) {
  const answers = item.answers || {};
  return [
    `${index}. ${value(answers['企业名称'])}`,
    `   提交时间：${item.createdAt || '-'}`,
    `   意向评分：${item.score ?? '-'}`,
    `   联系人：${value(answers['联系人姓名'])}`,
    `   职务：${value(answers['职务'])}`,
    `   电话微信：${value(answers['电话微信'])}`,
    `   邮箱：${value(answers['邮箱'])}`,
    `   行业：${value(answers['所属行业'])}`,
    `   年营收：${value(answers['企业年营收规模'])}`,
    `   预算：${value(answers['年度品牌传播投入'])}`,
    `   合作模式：${value(answers['合作模式'])}`,
    `   感兴趣服务：${value(answers['感兴趣服务方向'])}`,
    `   最大品牌问题：${value(answers['最大品牌问题'])}`,
    `   优先沟通内容：${value(answers['优先沟通内容'])}`,
    '',
  ].join('\n');
}

function renderReport(items, windowStart, windowEnd) {
  const hotItems = items.filter((item) => Number(item.score || 0) >= 70);
  const lines = [
    '聚时传薪企业品牌诊断问卷日报',
    '',
    `统计窗口：${windowStart.toISOString()} 至 ${windowEnd.toISOString()}`,
    `新增提交：${items.length}`,
    `高意向客户（>=70分）：${hotItems.length}`,
    '',
  ];

  if (!items.length) {
    lines.push('过去统计窗口内暂无新问卷提交。');
    return lines.join('\n');
  }

  lines.push('提交明细：', '');
  items.forEach((item, index) => lines.push(renderSubmission(item, index + 1)));
  return lines.join('\n');
}

async function sendEmail(subject, body) {
  const to = recipients();
  if (!to.length) throw new Error('Missing required env var: MAIL_TO');

  const transporter = nodemailer.createTransport({
    host: requiredEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
    auth: {
      user: requiredEnv('SMTP_USER'),
      pass: requiredEnv('SMTP_PASS'),
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text: body,
  });
}

async function main() {
  const allItems = readSubmissions();
  const now = new Date();
  const windowStart = new Date(now.getTime() - REPORT_WINDOW_HOURS * 60 * 60 * 1000);

  const pendingItems = allItems.filter((item) => {
    if (item.dailyReportSentAt) return false;
    const createdAt = new Date(item.createdAt || 0);
    return createdAt >= windowStart && createdAt <= now;
  });

  if (!pendingItems.length && !SEND_EMPTY) {
    console.log('No new submissions. Empty report disabled.');
    return;
  }

  const body = renderReport(pendingItems, windowStart, now);
  await sendEmail(`聚时传薪问卷日报：新增 ${pendingItems.length} 份`, body);

  if (pendingItems.length) {
    const sentAt = now.toISOString();
    const pendingIds = new Set(pendingItems.map((item) => item.id));
    const nextItems = allItems.map((item) => (
      pendingIds.has(item.id) ? { ...item, dailyReportSentAt: sentAt } : item
    ));
    writeSubmissions(nextItems);
  }

  console.log(`Daily report sent. submissions=${pendingItems.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
