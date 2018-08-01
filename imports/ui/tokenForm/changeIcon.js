import { ICOTokens } from '../../startup/lib/collections';
import getSwal from '../swal';

const ValidImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const getBase64 = function(address, file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function() {
    ICOTokens.update({ _id: address }, {
      $set: {
        icon: reader.result
      }
    });
  };

  reader.onerror = function (error) {
    console.log('Error:', error);
  };
};

export default function(ev) {
  const address = $('.contractAddress').val();

  Array.from(ev.target.files).forEach(file => {

    const iconExtension = file.name.split('.').pop().toLowerCase();
    const fileName = `${address}.${iconExtension}`;

    file.name = fileName;

    if ($.inArray(file.type, ValidImageTypes) < 0) {
      swal(getSwal(
        'Invalid Icon Format',
        `We only accept jpeg, png, jpg. Your file is ${iconExtension}`,
      ));

      return;
    }
    else if ((file.size / 1000) >= 301) {
      swal(getSwal(
        'Icon Too Big',
        `The max image size for icons is 300k. Your image is ${parseInt(file.size / 1000)}k`,
      ));

      return;
    }

    Meteor.saveFile(file, fileName);

    swal(getSwal(
      'Icon Saved',
      'Your icon has been saved!',
      'success',
    ));

    getBase64(address, file);

    ICOTokens.update({ _id: address }, {
      $set: { iconExtension }
    });

  });
};
