const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8080;
const app = express();
const indexPage = fs.readFileSync('./index.html');
const uploadPage = fs.readFileSync('./upload.html');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

AWS.config.region = "ap-northeast-2";
const BUCKET_NAME = "yjd-image-novemberde"

const uploadS3 = ({
  buffer, path, mimetype
}) => {
  const params = {
    Bucket: BUCKET_NAME,// s3 버킷 이름
    Key: path,// s3 경로
    Body: buffer,// 파일 내용
    ContentLength: buffer.length,// 파일 크기
    ContentType: mimetype // mimetype
  };

  return new Promise((resolve, reject) => {
    return s3.putObject(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    })
  });
}

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.get('/', (req, res, next) => {
  return res.status(200).send(indexPage.toString());
});
app.get('/upload', (req, res, next) => {
  return res.status(200).send(uploadPage.toString());
});
app.post('/upload', (req, res, next) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let image = req.files.image;

  return uploadS3({
    buffer: image.data,
    path: image.name,
    mimetype: image.mimetype
  }).then(result => {
    console.log(result);

    return res.status(200).send("Success");
  }).catch((err) => {
    next(err);
  });
});
app.use((req, res, next) => {
  return res.status(404).send('Not found');
});
app.use((req, res, next) => {
  return res.status(500).send('Internal server error');
});

app.listen(port, () => console.log(`Server is running at ${port}`));