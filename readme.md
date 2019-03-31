## HTTP请求概述
- DNS解析，建立TCP连接，发送HTTP请求
-- 有无缓存，有缓存从缓存拿，没有会向DNS服务器获取
-- 三次握手
- server接收到HTTP请求，处理，并返回
- 客户端接收到返回数据，处理数据（如渲染页面，执行JS）

## Node处理HTTP请求
```js
const http = require('http')
const server = http.createServer((req, res) => {
  res.end('hello wrold')
})
server.listen(3000)
```
**GET请求和querystring**
客户端要向server端获取数据，通过querystring来传递数据，如a.html?a=100?b=200
```js
const http = require('http')
const querystring = require('querystring)
const server = http.createServer((req, res) => {
  console.log(req.method) // GET
  const url = req.url // 获取请求的完整URL
  req.query = querystring.parse(url.split('?')[1]) // 解析querystring
  res.end('hello wrold')
})
server.listen(3000)
```
**POST请求和postdata**
客户端要向server端传递数据，通过postdata来传递数据
```js
const http = require('http')
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    // 数据格式
    console.log('content-type', req.headers['content-type'])
    // 接收数据
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      console.log(postData)
      res.end('hello world') // 在这里返回，因为是异步
    })
  }
})
server.listen(3000)
```
**路由**
```js
const http = require('http')
const server = http.createServer((req, res) => {
  const url = req.url
  const path = url.split('?')[0]
  res.end(path) // 返回路由
})
server.listen(3000)
```