const { getList, getDetail } = require('../controller/blog')
const { SuccessModule, ErrorModule } = require('../module/resModule')

const handleBlogRouter = (req, res) => {
  // 获取博客列表
  if (req.method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const data = getList(author, keyword)

    return new SuccessModule(data)
  }

  // 获取博客详情
  if (req.method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id || ''
    const data = getDetail(id)

    return new SuccessModule(data)
  }

  // 新建博客
  if (req.method === 'POST' && req.path === '/api/blog/new') {
    return {
      msg: '这是新建博客的接口'
    }
  }

  // 更新博客
  if (req.method === 'POST' && req.path === '/api/blog/update') {
    return {
      msg: '这是更新博客的接口'
    }
  }

  // 删除博客
  if (req.method === 'POST' && req.path === '/api/blog/del') {
    return {
      msg: '这是删除博客的接口'
    }
  }
}

module.exports = handleBlogRouter