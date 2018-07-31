import fs from 'fs';
import tar from 'tar';
import archiver from 'archiver';

import { getFilesPath } from '../utils/filesPath';
// import { ICOTokens } from '

const createTar = function(contractAddress) {

  const contractObj = ICOTokens.findOne(contractAddress);
  const filesPath = getFilesPath();
  const adr = filesPath + contractAddress;

  const output = fs.createWriteStream(filesPath +contractAddress+'.tar');
  const archive = archiver('tar', {});

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  output.on('end', function() {
    console.log('Data has been drained');
  });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);

  archive.append(fs.createReadStream(adr+'.json'), { name: contractAddress+'.json' });
  archive.append(fs.createReadStream(adr+'.abi'), { name: contractAddress+'.abi' });
  archive.append(fs.createReadStream(adr+'.byte'), { name: contractAddress+'.byte' });
  archive.append(fs.createReadStream(adr+'.sol'), { name: contractAddress+'.sol' });
  archive.append(fs.createReadStream(adr+'.'+contractObj.iconExtension), { name: contractAddress+'.'+contractObj.iconExtension.toLowerCase() });
  archive.finalize();

};

export {
  createTar,
};
