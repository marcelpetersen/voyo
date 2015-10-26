angular.module('Voyo.services').service('S3Upload', function ($window) {
    // upload later on form submit or something similar
    $window.AWS.config.update({accessKeyId: 'AWS_ACCESS_KEY', secretAccessKey: 'AWS_SECRET'});

    let dataURItoBlob = function (dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return {
        blob: new Blob([ia], { type:mimeString }),
        mimeType: mimeString
      }
    };

    let generateCanvasDataUrl = function (canvas) {
      return canvas.toDataURL("image/png");
    };


    return {
      // upload on file select or drop
      uploadVideo(url, postId) {
        return new Promise( (resolve, reject) => {
          window.resolveLocalFileSystemURL(`file://${url}`, (fileEntry) => {

           fileEntry.file((data) => {
             let reader = new FileReader();

             reader.onloadend = function (e) {
               console.log(e.target.result);
               let blobObj = dataURItoBlob(e.target.result),
                 blob = blobObj.blob,
                 mimeType = blobObj.mimeType;
               //Getting the base64 encoded string, then converting into byte stream
               let bucketName = "dev.voyo",
                amazonS3Client = new AWS.S3(),
                path = `post-media/${postId}/${new Date().getTime()}.${mimeType.split('/')[1]}`,
                fullPath = `https://s3.amazonaws.com/${bucketName}/${path}`;

               amazonS3Client.putObject({
                 Bucket: bucketName,
                 Key: path,
                 Body: blob,
                 ACL: 'public-read',
                 ContentType: mimeType
               }, function (response) {
                 resolve(fullPath);
               });
             }
             reader.readAsDataURL(data);
           });
          });
        })
      },
      uploadCanvas(canvas, postId) {
        return new Promise( (resolve, reject) => {
          let blobObj = dataURItoBlob(generateCanvasDataUrl(canvas)),
            blob = blobObj.blob,
            mimeType = blobObj.mimeType;
          //Getting the base64 encoded string, then converting into byte stream
          let bucketName = "dev.voyo",
           amazonS3Client = new AWS.S3(),
           path = `post-media/${postId}/${new Date().getTime()}.png`,
           fullPath = `https://s3.amazonaws.com/${bucketName}/${path}`;

          amazonS3Client.putObject({
            Bucket: bucketName,
            Key: path,
            Body: blob,
            ACL: 'public-read',
            ContentType: mimeType
          }, function (response) {
            resolve(fullPath);
          });
        })
      }
    }
});
