const path = require('path');
const qiniu = require('qiniu');
const rd = require('rd');
const co = require('co');
const folderName = require('./package.json').name;
const accessKey = 'yH-26a9NAohR_QegJR1uGU5I5Dw595l6n_tXHwPB';
const secretKey = 'EcLCXW7hZiaY48qbFP1yU9okc17a12mmQqF9Ipth';

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2; // 华南

const options = { scope: 'leroy20317', expires: 7200 };
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

// 异步遍历目录下的所有文件
rd.each(
  path.join(__dirname, '/static'),
  function (f, s, next) {
    putExtra.mimeType = null;
    if (s.isFile()) {
      co(function* () {
        try {
          const result = yield upload(
            f.replace(path.join(__dirname, '/static'), `${folderName}/static`),
            f
          );
          return result;
        } catch (error) {
          console.log(error);
        }
      }).then(function () {
        console.log(
          `上传文件至https://cdn.leroy.net.cn${f.replace(
            path.join(__dirname, '/static'),
            `${folderName}/static`
          )}成功`
        );
      });
    }
    next();
  },
  function (err) {
    if (err) throw err;
  }
);

const upload = function (key, localFile) {
  return new Promise((resolve, reject) => {
    // 文件上传
    formUploader.putFile(
      uploadToken,
      key,
      localFile,
      putExtra,
      function (respErr, respBody, respInfo) {
        putExtra.mimeType = null; // 重置MIME类型
        if (respErr) {
          reject(respErr);
          throw respErr;
        }
        resolve(respBody);
        if (respInfo.statusCode === 200) {
          // console.log(respBody);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
      }
    );
  });
};
