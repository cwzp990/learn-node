const getList = (author, keyword) => {
  // 先返回假数据，格式是正确的
  return [
    {
      id: 1,
      title: '这是我第一篇博客',
      content: '这是我第一篇博客',
      createTime: 1554012774718,
      author: '桔子'
    },
    {
      id: 2,
      title: '这是我第二篇博客',
      content: '这是我第二篇博客',
      createTime: 1554012774820,
      author: '桔子'
    }
  ]
}

const getDetail = id => {
  return {
    id: 2,
    title: '这是我第二篇博客',
    content: '这是我第二篇博客',
    createTime: 1554012774820,
    author: '桔子'
  }
}

const newBlog = (blog = {}) => {
  // blog是一个博客对象 包含title content等属性
  console.log('博客数据是:', blog)

  return {
    id: 3 // 每次新建博客，插入到数据表里的id
  }
}

const updateBlog = (id, blog = {}) => {
  console.log('博客数据是:', id, blog)
  return true
}

const delBlog = id => {
  console.log('id is', id)
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
