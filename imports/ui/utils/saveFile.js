import { Meteor } from 'meteor/meteor';

export function saveFile(blob, name, type, callback) {
  const fileReader = new FileReader();
  let method, encoding = 'binary';
  type = type || 'binary';

  switch (type) {
    case 'text':
      // TODO Is this needed? If we're uploading content from file, yes, but if
      // it's from an input/textarea I think not...
      method = 'readAsText';
      encoding = 'utf8';
      break;
    case 'binary':
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
    default:
      method = 'readAsBinaryString';
      encoding = 'binary';
      break;
  }

  fileReader.onload = function(file) {
    // console.log('result', file);
    Meteor.call('saveFileWithEncoding', file.target.result, name, encoding, callback);
  }

  fileReader[method](blob);
}
