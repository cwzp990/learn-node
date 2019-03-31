const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')

const { SuccessModule, ErrorModule } = require('../module/resModule')

const handleBlogRouter = (req, res) => {
  const id = req.query.id || ''

  // 获取博客列表
  if (req.method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const data = getList(author, keyword)

    return new SuccessModule(data)
  }

  // 获取博客详情
  if (req.method === 'GET' && req.path === '/api/blog/detail') {
    const data = getDetail(id)

    return new SuccessModule(data)
  }

  // 新建博客
  if (req.method === 'POST' && req.path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SuccessModule(data)
  }

  // 更新博客
  if (req.method === 'POST' && req.path === '/api/blog/update') {
    const data = updateBlog(id, req.body)
    if (data) {
      return new SuccessModule(data)
    }
  }

  // 删除博客
  if (req.method === 'POST' && req.path === '/api/blog/del') {
    const data = delBlog(id)
    if (data) {
      return new SuccessModule()
    }
  }
}

module.exports = handleBlogRouter
