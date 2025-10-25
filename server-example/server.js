// 简单的测试服务器示例
// 使用方法: node server.js
// 或安装依赖后使用: npm install express && node server.js

const express = require('express');
const app = express();
const port = 3000;

// 解析 JSON 请求体
app.use(express.json({ limit: '10mb' }));

// 记录所有请求
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 接收设备信息的端点
app.post('/api/device-info', (req, res) => {
  console.log('\n==================== 收到设备信息 ====================');
  console.log('时间:', new Date().toLocaleString('zh-CN'));
  
  const data = req.body;
  
  console.log('\n📱 基本信息:');
  console.log('  设备名称:', data.computer_name);
  console.log('  运行时间:', formatUptime(data.uptime));
  
  if (data.cpu_usage && data.cpu_usage.length > 0) {
    const avgCpu = data.cpu_usage.reduce((a, b) => a + b, 0) / data.cpu_usage.length;
    console.log('\n💻 CPU:');
    console.log('  核心数:', data.cpu_usage.length);
    console.log('  平均使用率:', avgCpu.toFixed(2) + '%');
  }
  
  if (data.memory_usage) {
    console.log('\n🧠 内存:');
    console.log('  总内存:', formatBytes(data.memory_usage.total));
    console.log('  已使用:', formatBytes(data.memory_usage.used));
    console.log('  使用率:', data.memory_usage.percent.toFixed(2) + '%');
  }
  
  if (data.battery) {
    console.log('\n🔋 电池:');
    console.log('  电量:', data.battery.level.toFixed(0) + '%');
    console.log('  充电状态:', data.battery.is_charging ? '充电中' : '未充电');
  }
  
  if (data.disks && data.disks.length > 0) {
    console.log('\n💾 磁盘 (' + data.disks.length + ' 个):');
    data.disks.slice(0, 3).forEach(disk => {
      const usedPercent = ((disk.total_space - disk.available_space) / disk.total_space * 100).toFixed(1);
      console.log(`  ${disk.mount_point} - 总容量: ${formatBytes(disk.total_space)}, 使用率: ${usedPercent}%`);
    });
  }
  
  if (data.network && data.network.length > 0) {
    console.log('\n🌐 网络 (' + data.network.length + ' 个):');
    data.network.slice(0, 3).forEach(net => {
      console.log(`  ${net.name}`);
      console.log(`    接收: ${formatBytes(net.received)}, 发送: ${formatBytes(net.transmitted)}`);
    });
  }
  
  if (data.processes && data.processes.length > 0) {
    console.log('\n⚙️  进程 (前5个):');
    data.processes.slice(0, 5).forEach((proc, index) => {
      console.log(`  ${index + 1}. ${proc.executable_name} (PID: ${proc.pid})`);
      console.log(`     内存: ${formatBytes(proc.memory)}, CPU: ${proc.cpu_usage.toFixed(1)}%`);
    });
  }
  
  console.log('\n====================================================\n');
  
  // 返回成功响应
  res.json({
    success: true,
    message: '设备信息已接收',
    timestamp: new Date().toISOString()
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路径
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Device Monitor Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0; }
          code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🖥️ Device Monitor Server</h1>
        <div class="info">
          <p><strong>状态:</strong> 运行中 ✅</p>
          <p><strong>端口:</strong> ${port}</p>
          <p><strong>API 端点:</strong> <code>POST /api/device-info</code></p>
          <p><strong>健康检查:</strong> <code>GET /health</code></p>
        </div>
        <h2>使用方法</h2>
        <ol>
          <li>在 Device Monitor 应用中设置服务器地址为: <code>http://localhost:${port}/api/device-info</code></li>
          <li>点击"启动监控"开始发送设备信息</li>
          <li>查看控制台输出查看接收到的数据</li>
        </ol>
      </body>
    </html>
  `);
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 启动服务器
app.listen(port, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Device Monitor 测试服务器已启动          ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 服务器地址: http://localhost:${port}`);
  console.log(`📡 API 端点: http://localhost:${port}/api/device-info`);
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
  console.log('');
});

// 辅助函数
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}小时 ${minutes}分钟`;
}

