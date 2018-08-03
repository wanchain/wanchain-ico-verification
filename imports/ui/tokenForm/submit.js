import { ICOTokens } from '../../api/collections/icotokens';
import swal from '../utils/swal';

export default function(event, template) {
  event.preventDefault();

  const address = Session.get('contractAddress');
  const fileName = `${address}.json`;
  const token = ICOTokens.findOne(address);

  if (! token || ! token.icon) {
    swal({
      title: 'Missing Icon',
      text: 'You must upload an icon',
    });

    return false;
  }

  const tokenDetails = {
    submittedOn: new Date(),
  };

  const formFields = $(event.target).serializeArray();
  formFields.forEach(field => {
    tokenDetails[field.name] = field.value || false;
  });

  tokenDetails.decimals = parseInt(tokenDetails.decimals || 0);

  Meteor.call('saveJson', tokenDetails, fileName, (err, res) => {
    console.log(err, res);
  });

  ICOTokens.update({ _id: address }, { $set: tokenDetails });

  $('#myTab a[href="#profile"]').tab('show');

  // swal({
  //   title: 'Token Info Saved',
  //   text: 'Lets add your contract code!',
  //   type: 'success',
  // });
};
