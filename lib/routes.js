

FlowRouter.route('/', {
    action: function(params, queryParams) {
        Session.set('params',queryParams)
        BlazeLayout.render('mainLayout',{
            content:'contractVerifyer'
        });
    }
});
FlowRouter.route('/p/:template', {
    action: function(params, queryParams) {
        Session.set('params',queryParams)
        BlazeLayout.render('mainLayout',{
            content:params.template
        });
    }
});

FlowRouter.route('/verification', {
    action: function(params, queryParams) {
        Session.set('params',queryParams)
        BlazeLayout.render('publicLayout',{
            public:'verify'
        });
    }
});

