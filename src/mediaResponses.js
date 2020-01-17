const fs = require('fs');
const path = require('path');

const createFileStream = (file, start, end, res) => {
  // make the stream
  const stream = fs.createReadStream(file, { start, end });
  // pipe it
  stream.on('open', () => {
    stream.pipe(res);
  });
  // guess not
  stream.on('error', (streamErr) => {
    res.end(streamErr);
  });
};

const handleENOENT = (err, res) => {
  // we got a problem here
  if (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404);
    }
    return true;
  }
  return false;
};

const loadFile = (req, res, filePathName, mediaType) => {
  // grab the file
  const file = path.resolve(__dirname, filePathName);
  // looking for stats
  fs.stat(file, (err, stats) => {
    if (handleENOENT(err, res)) {
      return res.end(err);
    }
    // range data
    const { range } = (!req.headers) ? 'bytes=0-' : req.headers;
    // processing all the info
    const positions = range.replace(/bytes=/, '').split('-');
    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10)
      : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;
    // write it out
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mediaType,
    });
    // send back the stream
    return createFileStream(file, start, end, res);
  });
};
// three lovely cmaller function
const getParty = (req, res) => {
  loadFile(req, res, '../client/party.mp4', 'video/mp4');
};

const getBling = (req, res) => {
  loadFile(req, res, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (req, res) => {
  loadFile(req, res, '../client/bird.mp4', 'video/mp4');
};

module.exports = { getParty, getBling, getBird };
