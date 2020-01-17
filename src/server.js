const http = require('http');
const htmlHandler = require('./htmlResponses');
const mediaHandler = require('./mediaResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  console.log(req.url);

  switch (req.url) {
    case '/':
      htmlHandler.getIndex(req, res);
      break;
    case '/party.mp4':
      mediaHandler.getParty(req, res);
      break;
    case '/page2':
      htmlHandler.getPage2(req, res);
      break;
    case '/bling.mp3':
      mediaHandler.getBling(req, res);
      break;
    case '/page3':
      htmlHandler.getPage3(req, res);
      break;
    case '/bird.mp4':
      mediaHandler.getBird(req, res);
      break;
    default:
      htmlHandler.getIndex(req, res);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
