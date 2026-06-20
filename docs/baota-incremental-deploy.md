# 宝塔迭代部署步骤

本文档用于把已经部署过的旧目录 `jscx_survey_app` 平滑迁移到新目录 `backend`。公网 URL 不变：官网仍是 `/`，问卷仍是 `/contact/`，内容 API 仍是 `/api/`，内容管理页仍是 `/services/admin`。

## 1. 部署前确认

在服务器上确认当前目录：

```bash
cd /www/wwwroot/jushichuanxin-website
pwd
git status --short
```

如果服务器上有手工改过的文件，先备份。不要用整包覆盖上传的方式更新，否则容易覆盖 `.env`、`data/` 和上传物料。

## 2. 备份旧后端运行时数据

如果旧目录还在：

```bash
cd /www/wwwroot/jushichuanxin-website
BACKUP_DIR=/www/backup/jscx-backend-$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"
cp -a jscx_survey_app/.env "$BACKUP_DIR"/ 2>/dev/null || true
cp -a jscx_survey_app/data "$BACKUP_DIR"/ 2>/dev/null || true
cp -a jscx_survey_app/public/uploads "$BACKUP_DIR"/ 2>/dev/null || true
echo "backup: $BACKUP_DIR"
```

如果想保留一个固定备份目录，执行：

```bash
cd /www/wwwroot/jushichuanxin-website
mkdir -p /www/backup/jscx-backend-latest
cp -a jscx_survey_app/.env /www/backup/jscx-backend-latest/ 2>/dev/null || true
cp -a jscx_survey_app/data /www/backup/jscx-backend-latest/ 2>/dev/null || true
cp -a jscx_survey_app/public/uploads /www/backup/jscx-backend-latest/ 2>/dev/null || true
```

## 3. 拉取代码并构建主站

```bash
cd /www/wwwroot/jushichuanxin-website
git pull
npm install
npm run build
```

确认主站产物存在：

```bash
test -f dist/index.html && echo "dist ok"
```

## 4. 迁移后端运行时数据

首次迁移到 `backend` 时执行：

```bash
cd /www/wwwroot/jushichuanxin-website

if [ -f jscx_survey_app/.env ] && [ ! -f backend/.env ]; then
  cp -a jscx_survey_app/.env backend/.env
fi

if [ -d jscx_survey_app/data ] && [ ! -d backend/data ]; then
  cp -a jscx_survey_app/data backend/data
fi

mkdir -p backend/public
if [ -d jscx_survey_app/public/uploads ] && [ ! -d backend/public/uploads ]; then
  cp -a jscx_survey_app/public/uploads backend/public/uploads
fi
```

确认关键文件：

```bash
ls -la backend/.env
ls -la backend/data
ls -la backend/public/uploads 2>/dev/null || true
```

如果没有旧 `.env`，创建新配置：

```bash
cd /www/wwwroot/jushichuanxin-website/backend
cp .env.example .env
```

至少确认：

```env
PORT=3000
HOST=127.0.0.1
BASE_PATH=/contact
DATA_DIR=/www/wwwroot/jushichuanxin-website/backend/data
ADMIN_PASSWORD=你的后台密码
COOKIE_SECRET=一串足够长的随机字符
```

## 5. 安装后端依赖

```bash
cd /www/wwwroot/jushichuanxin-website/backend
npm install --omit=dev
node --check server.js
node --check scripts/send_daily_report.js
```

## 6. 修改宝塔 Node 项目

宝塔面板：

```text
网站 -> Node项目 -> 找到原 jscx-survey 项目 -> 设置
```

修改为：

```text
项目目录：/www/wwwroot/jushichuanxin-website/backend
项目名称：jscx-backend
启动选项：start
Node版本：20.x 或 18+
包管理器：npm
端口：3000
```

保存后重启 Node 项目。旧项目名不改也能跑，但建议改成 `jscx-backend`，避免后续维护误解。

## 7. 检查 Nginx 配置

宝塔网站配置文件里，`server { ... }` 内需要有：

```nginx
location = /contact {
    return 301 /contact/;
}

location ^~ /contact/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/ {
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
```

`/contact/` 和 `/api/` 必须放在 `location /` 前面。

## 8. 验证

服务器本机检查：

```bash
curl -I http://127.0.0.1:3000/contact/
curl -s http://127.0.0.1:3000/api/content
```

公网浏览器检查：

```text
https://www.torchmotive.com/
https://www.torchmotive.com/contact/
https://www.torchmotive.com/contact/admin
https://www.torchmotive.com/services
https://www.torchmotive.com/services/admin
https://www.torchmotive.com/api/content
```

功能检查：

- 提交一份问卷，确认 `/contact/admin` 能看到记录。
- 登录 `/services/admin`，新增一张服务卡片，不添加案例，确认 `/services` 出现卡片。
- 再新增一张服务卡片并勾选添加案例，上传一份小文件，确认 `/cases/<caseId>` 能打开并看到物料链接。
- 重启宝塔 Node 项目后再次访问 `/api/content`，确认新增卡片还在。

## 9. 回滚

如果新后端启动失败：

1. 宝塔 Node 项目目录临时改回：

```text
/www/wwwroot/jushichuanxin-website/jscx_survey_app
```

2. 重启 Node 项目。
3. Nginx 不需要改，因为公网路径没有变。
4. 用备份恢复 `.env`、`data/`、uploads。

迁移稳定后，可以保留旧目录一段时间；确认无问题后再手动归档或删除旧目录。
