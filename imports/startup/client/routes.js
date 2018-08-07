import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  action(params, queryParams) {
    Session.set('params', queryParams);
    BlazeLayout.render('mainLayout', {
      content: 'contractVerifier',
    });
  }
});

FlowRouter.route('/config', {
  action(params, queryParams) {
    Session.set('params', queryParams);
    BlazeLayout.render('mainLayout', {
      content: 'config',
    });
  }
});

FlowRouter.route('/verification', {
  action(params, queryParams) {
    Session.set('params', queryParams);
    BlazeLayout.render('publicLayout', {
      public: 'verify',
    });
  }
});
