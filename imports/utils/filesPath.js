import { Meteor } from 'meteor/meteor';

const getFilesPath = function() {
  const filesPath = process.env.FILES_PATH;
  const meteorBase = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0];
  const defaultPath = `${meteorBase}/.uploads`;

  return filesPath || defaultPath;
};

export {
  getFilesPath
};
