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

module.exports = {
  getList,
  getDetail
}
