const fs = require("fs");
const { Monitor } = require("node-screenshots");
console.log(876789)
async function getMonitors() {
  let monitors = Monitor.all();
  return monitors;
}

getMonitors().then(monitors => {
  console.log(JSON.stringify(monitors)); // 将 monitors 结果输出到标准输出
}).catch(err => {
  console.error('Error:', err);
  process.exit(1); // 发生错误时退出并返回非零状态码
});