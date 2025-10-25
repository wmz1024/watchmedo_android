# Device Monitor 测试服务器

这是一个简单的测试服务器，用于接收和显示 Device Monitor 应用发送的设备信息。

## 快速开始

### 1. 安装依赖

```bash
cd server-example
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 上运行。

### 3. 配置应用

在 Device Monitor 应用中：
1. 设置服务器地址为: `http://localhost:3000/api/device-info`
2. 点击"启动监控"

## API 端点

### POST /api/device-info

接收设备信息的主要端点。

**请求体示例:**

```json
{
  "computer_name": "My-Device",
  "uptime": 123456,
  "cpu_usage": [45.2, 50.1, 48.3, 52.7],
  "memory_usage": {
    "total": 8589934592,
    "used": 4294967296,
    "percent": 50.0
  },
  "processes": [...],
  "disks": [...],
  "network": [...],
  "battery": {
    "level": 85.0,
    "is_charging": true
  }
}
```

**响应示例:**

```json
{
  "success": true,
  "message": "设备信息已接收",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /health

健康检查端点。

**响应:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 查看数据

启动服务器后，在浏览器中访问 `http://localhost:3000` 查看服务器状态。

接收到的设备信息会实时打印在控制台中，包括：
- 设备名称和运行时间
- CPU 使用率
- 内存使用情况
- 电池状态
- 磁盘信息
- 网络流量
- 进程列表

## 部署到生产环境

这只是一个简单的示例服务器。在生产环境中，建议：

1. 使用数据库存储数据
2. 添加身份验证和授权
3. 使用 HTTPS
4. 添加日志系统
5. 实现数据分析和可视化

## 示例：存储到数据库

可以修改 `server.js` 来将数据存储到数据库：

```javascript
// 使用 MongoDB
const mongoose = require('mongoose');

const DeviceInfoSchema = new mongoose.Schema({
  computer_name: String,
  uptime: Number,
  cpu_usage: [Number],
  memory_usage: Object,
  timestamp: { type: Date, default: Date.now }
});

const DeviceInfo = mongoose.model('DeviceInfo', DeviceInfoSchema);

app.post('/api/device-info', async (req, res) => {
  const deviceInfo = new DeviceInfo(req.body);
  await deviceInfo.save();
  res.json({ success: true });
});
```

## 许可证

MIT

