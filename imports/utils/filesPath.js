import { Meteor } from 'meteor/meteor';

export default getFilesPath = function() {
  const filesPath = process.env.FILES_PATH;
  const meteorBase = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0];
  const defaultPath = `${meteorBase}/.uploads`;

  return filesPath || defaultPath;
};
