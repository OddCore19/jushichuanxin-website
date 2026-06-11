# 聚时传薪企业品牌诊断 H5 问卷系统

## 功能

- 手机端 H5 问卷，可在微信中打开填写。
- 提交结果自动进入后台。
- 后台查看原始记录、自动统计、图表可视化、CSV 导出。
- 每天定时读取 `data/submissions.json`，汇总新增问卷并发送邮件日报。
- 已替换为 `public/assets/logo.png` 中的聚时传薪 LOGO。

## 本地运行

```bash
npm install
cp .env.example .env
# 修改 .env 里的 ADMIN_PASSWORD、COOKIE_SECRET 和邮件配置
npm start
```

访问：

- 问卷页：http://localhost:3000/contact/
- 后台页：http://localhost:3000/contact/admin

如果要通过主站本地地址访问，需要同时启动两个服务：

```bash
# 终端 1：问卷 App
cd jscx_survey_app
npm run dev

# 终端 2：官网 Vite
cd ..
npm run dev
```

官网 Vite 已配置开发代理，因此也可以访问：

- 问卷页：http://localhost:5173/contact/

## 必须修改的配置

`.env` 中至少修改：

```bash
ADMIN_PASSWORD=你的后台登录密码
COOKIE_SECRET=一串足够长的随机字符
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=notice@example.com
SMTP_PASS=邮箱授权码或密码
MAIL_FROM=notice@example.com
MAIL_TO=owner@example.com
BASE_PATH=/contact
```

## 数据保存位置

默认保存在：

```bash
data/submissions.json
```

正式部署时必须保证 `data` 目录可持久化，否则重启后数据可能丢失。

日报发送成功后，脚本会给已发送的记录增加 `dailyReportSentAt` 字段，避免重复发送。后台和 CSV 导出仍可正常读取原始问卷字段。

## 每日邮件日报

手动执行一次：

```bash
cd /var/www/jscx_survey_app
npm run report:daily
```

默认行为：

- 读取 `DATA_DIR/submissions.json`。
- 统计过去 `REPORT_WINDOW_HOURS` 小时内尚未发送过日报的记录，默认 24 小时。
- 发送成功后标记这些记录的 `dailyReportSentAt`。
- 如果没有新增记录，默认仍发送一封空日报。可设置 `DAILY_REPORT_SEND_EMPTY=false` 关闭。

cron 示例，每天上午 9 点发送：

```cron
0 9 * * * cd /var/www/jscx_survey_app && /usr/bin/npm run report:daily >> /var/log/jscx-survey-report.log 2>&1
```

如果服务器上的 `npm` 不在 `/usr/bin/npm`，先运行 `which npm`，把 cron 里的路径替换成实际路径。

## 微信转发方式

微信不能直接转发本地 HTML 文件。必须先部署到公网 HTTPS 地址，例如：

```text
https://你的域名.com
```

然后把链接发到微信聊天、微信群、企业微信或公众号菜单中。

## 部署方案 A：云服务器 / 宝塔 / 腾讯云 / 阿里云 / 华为云

### 1. 准备服务器

- 系统建议：Ubuntu 22.04 或更新版本。
- 开放端口：80、443、3000。
- 准备主站域名，例如 `yourdomain.com`。问卷默认挂载在同域名 `/contact/`。

### 2. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

### 3. 上传代码

把整个项目目录上传到服务器，例如：

```bash
/var/www/jscx_survey_app
```

### 4. 安装依赖

```bash
cd /var/www/jscx_survey_app
npm install --omit=dev
cp .env.example .env
nano .env
```

修改：

```bash
ADMIN_PASSWORD=你的后台密码
COOKIE_SECRET=随机长字符
DATA_DIR=/var/www/jscx_survey_app/data
BASE_PATH=/contact
```

### 5. 用 PM2 常驻运行

```bash
sudo npm install -g pm2
pm2 start server.js --name jscx-survey
pm2 save
pm2 startup
```

配置每日邮件：

```bash
crontab -e
```

加入：

```cron
0 9 * * * cd /var/www/jscx_survey_app && /usr/bin/npm run report:daily >> /var/log/jscx-survey-report.log 2>&1
```

### 6. 配置 Nginx 反向代理

安装 Nginx：

```bash
sudo apt-get install -y nginx
```

新建配置：

```bash
sudo nano /etc/nginx/sites-available/jushichuanxin
```

写入：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/jushichuanxin-website/dist;
    index index.html;

    location = /contact {
        return 301 /contact/;
    }

    location /contact/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用：

```bash
sudo ln -s /etc/nginx/sites-available/jushichuanxin /etc/nginx/sites-enabled/jushichuanxin
sudo nginx -t
sudo systemctl reload nginx
```

### 7. 配置 HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

完成后，微信中使用：

```text
https://yourdomain.com/contact/
```

后台地址：

```text
https://yourdomain.com/contact/admin
```

## 部署方案 B：Docker 部署

### 1. 构建镜像

```bash
docker build -t jscx-survey .
```

### 2. 运行容器

```bash
docker run -d \
  --name jscx-survey \
  -p 3000:3000 \
  -e ADMIN_PASSWORD='你的后台密码' \
  -e COOKIE_SECRET='随机长字符' \
  -e DATA_DIR='/app/data' \
  -e BASE_PATH='/contact' \
  -v $(pwd)/data:/app/data \
  jscx-survey
```

然后继续用 Nginx + HTTPS 做公网访问。

## 部署方案 C：Render / Railway 等 Node 托管平台

这类平台适合快速上线，但要注意：

- 需要配置环境变量：`ADMIN_PASSWORD`、`COOKIE_SECRET`、`DATA_DIR`。
- 必须开启持久化磁盘，并把 `DATA_DIR` 指向持久化目录。
- 如果没有持久化磁盘，提交结果可能在重启或重新部署后丢失。

一般流程：

1. 把代码上传到 GitHub。
2. 在托管平台创建 Node Web Service。
3. Build Command：`npm install`
4. Start Command：`npm start`
5. 添加环境变量。
6. 绑定自定义域名。
7. 开启 HTTPS。

## 后台使用

- 后台地址：`/contact/admin`
- 输入 `.env` 中的 `ADMIN_PASSWORD` 登录。
- 可查看：提交总量、平均意向评分、高意向客户、今日新增、自动分析结论、图表与原始记录。
- 点击「导出 CSV」下载数据，可继续在 Excel / 飞书表格中二次分析。

## 后续升级建议

当前版本适合轻量调研和私域客户筛选。若后续数据量较大，建议升级为：

- 数据库：PostgreSQL / MySQL / Supabase
- 登录：企业微信或账号密码体系
- 通知：提交后自动微信/邮件提醒
- 分析：自动生成单个企业品牌诊断报告 PDF
