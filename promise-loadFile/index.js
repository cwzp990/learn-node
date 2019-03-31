const fs = require('fs')
const path = require('path')

// const fullFileName = path.resolve(__dirname, 'files', 'a.json')
// fs.readFile(fullFileName, (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(data.toString())
// })

// 回调方式获取文件内容
// function getFileContent(fileName, cb) {
//   const fullFileName = path.resolve(__dirname, 'files', fileName)
//   fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//       console.log(err)
//       return
//     }
//     cb(JSON.parse(data.toString()))
//   })
// }

// getFileContent('a.json', aData => {
//   console.log('a data is:', aData)
//   getFileContent(aData.next, bData => {
//     console.log('b data is:', bData)
//     getFileContent(bData.next, cData => {
//       console.log('c data is:', cData)
//     })
//   })
// })

// promise
function getFileContent(filename) {
  return new Promise((resolve, reject) => {
    const fullFileName = path.resolve(__dirname, 'files', filename)
    fs.readFile(fullFileName, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(JSON.parse(data.toString()))
    })
  })
}

getFileContent('a.json')
  .then(aData => {
    console.log('a data', aData)
    return getFileContent(aData.next)
  })
  .then(bData => {
    console.log('b data is:', bData)
    return getFileContent(bData.next)
  })
  .then(cData => {
    console.log('c data is:', cData)
  })
