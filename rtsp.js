require('dotenv').config()
const Recorder = require('node-rtsp-recorder').Recorder

const getCapture = new Recorder({
  url: process.env.RTSP,
  folder: 'cctv',
  name: 'cam1',
  type: 'image',
  fileNameFormat: 'YYYYMMDDhhmmss'
})

// const getCaptureFileName = () => {
//   getCapture.captureImage(() => {
//     const ffmpegCommand = getCapture.writeStream.spawnargs
//     const fileName = ffmpegCommand.slice(-1).toString()
//     console.log(fileName)
//     return fileName
//   })
// }

module.exports = {
  getCapture
}
