

Meteor.methods({
    saveFile: function(blob, name, path, encoding,contractAddr) {

        function cleanPath(str) {
            if (str) {
                return str.replace(/\.\./g,'').replace(/\/+/g,'').
                replace(/^\/+/,'').replace(/\/+$/,'');
            }
        }
        function cleanName(str) {
            return str.replace(/\.\./g,'').replace(/\//g,'');
        }

        var path = cleanPath(path);


        console.log('path',path)
        // var name = cleanName(name || 'file');
        var encoding = encoding || 'binary';
        var chroot = Meteor.chroot || 'private';


        path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/.uploads/';

        console.log(chroot,path);



        // TODO Add file existance checks, etc...

        //
        fs.writeFile(path + name, blob, encoding, function(err,resp) {

            if (err) {
                throw (new Meteor.Error(500, 'Failed to save file.', err));
            } else {
                console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
            }
        });


    },
    'saveJson':function(jsonObj,name){


        path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/.uploads/';


        writeJsonFile(path+name, jsonObj).then(function(e){
            console.log('done')
        });


        // var fs = require('fs');
        // path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/private/';
        //
        // console.log(blob)
        //
        // fs.writeFile(path + name, blob.srcElement.result, function(err,resp) {
        //
        //     if (err) {
        //         throw (new Meteor.Error(500, 'Failed to save file.', err));
        //     } else {
        //         console.log('The file ' + name + ' (' + name + ') was saved to ' + path);
        //     }
        // });
    },
    'saveF':function(jsonObj,name){
        path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/.uploads/';

        fs.writeFile(path+name, jsonObj, function(err,resp) {

            if (err) {
                throw (new Meteor.Error(500, 'Failed to save file.', err));
            } else {
                console.log('The file ' + name + ' was saved to ' + path);
            }
        });
    },
    'createTar':function(contractAddress){

        var contractObj = ICOTokens.findOne(contractAddress);
        tar = require('tar');
        var path = __meteor_bootstrap__.serverDir.split(/(\\|\/).meteor/)[0] + '/.uploads/';
        var adr = path + contractAddress;
        var archiver = require('archiver');


        var output = fs.createWriteStream(path +contractAddress+'.tar');
        var archive = archiver('tar', {
        });

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

    }
});