Meteor.saveFile = function(blob, name, path, type, callback) {
    var fileReader = new FileReader(),
        method, encoding = 'binary', type = type || 'binary';
    switch (type) {
        case 'text':
            // TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
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
        console.log('result',file.srcElement.result)

        Meteor.call('saveFile', file.srcElement.result, name, path, encoding, callback);
    }
    fileReader[method](blob);
}