import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

import { ICOTokens } from '../api/collections/icotokens';
import getFilesPath from '../utils/filesPath';

export function createTar(address) {

  return new Promise((resolve, reject) => {

    const token = ICOTokens.findOne(address);
    const filesPath = getFilesPath();
    const addrPath = path.join(filesPath, address);

    const output = fs.createWriteStream(`${addrPath}.tar`);
    const archive = archiver('tar', {});

    output.on('error', function(err) {
      console.log('output error', err);
      reject(err);
    });

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
        console.log('archiver warning', err);
      } else {
        // reject(err);
      }
    });

    archive.on('error', function(err) {
      console.log('archiver error', err);
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
