import { Session } from 'meteor/session';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  action(params, queryParams) {
    Session.set('params',queryParams);
    BlazeLayout.render('mainLayout', {
      content: 'contractVerifier',
    });
  }
});

FlowRouter.route('/p/:template', {
  action(params, queryParams) {
    Session.set('params',queryParams);
    BlazeLayout.render('mainLayout', {
      content: params.template,
    });
  }
});

FlowRouter.route('/verification', {
  action(params, queryParams) {
    Session.set('params',queryParams);
    BlazeLayout.render('publicLayout', {
      public: 'verify',
    });
  }
});
