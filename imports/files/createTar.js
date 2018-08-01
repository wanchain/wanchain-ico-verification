import fs from 'fs';
import path from 'path';
import tar from 'tar';
import archiver from 'archiver';

import { getFilesPath } from '../utils/filesPath';

const createTar = function(address) {

  return new Promise((resolve, reject) => {

    const token = ICOTokens.findOne(address);
    const filesPath = getFilesPath();
    const addrPath = path.join(filesPath, address);

    const output = fs.createWriteStream(`${addrPath}.tar`);
    const archive = archiver('tar', {});

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed');
      resolve();
    });

    output.on('end', function() {
      console.log('Data has been drained');
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
        console.log(err);
      } else {
        reject(err);
      }
    });

    archive.on('error', function(err) {
      reject(err);
    });

    archive.pipe(output);

    const ext = token.iconExtension.toLowerCase();

    archive.append(fs.createReadStream(addrPath + '.json'), { name: address + '.json' });
    archive.append(fs.createReadStream(addrPath + '.abi'), { name: address + '.abi' });
    archive.append(fs.createReadStream(addrPath + '.byte'), { name: address + '.byte' });
    archive.append(fs.createReadStream(addrPath + '.sol'), { name: address + '.sol' });
    archive.append(fs.createReadStream(addrPath + '.' + ext), { name: address + '.' + ext });

    archive.finalize();
  });
};

export {
  createTar,
};
