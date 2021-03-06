(function(dynCore, hashNav) {
    $.when(hashNav.getPending('dynform'),
        dynCore.require('hub.hubAuth')
    ).done(function(rpWindow) {
        hashNav.appInit(init(rpWindow, dynCore.modules()), 'dynform');
    });

    function init(rpWindow, modules) {
        var core = rpWindow.rp.core;
        var centralAuth = modules.lib.centralAuth;

        if (centralAuth.google.info) {
            core.auth = centralAuth.google.info;
        } else if (core.auth) {
            centralAuth.google.info = core.auth;
        }

        var signIn = function(info) {
            core.auth = info;
            core.cancel();
            rpWindow.$('.g-signin2').hide();
            rpWindow.$('#signOut').show().find('span').first().text(info.name);
        };

        rpWindow.signIn = core.signIn = function(googleUser) {
            centralAuth.google.signIn(googleUser).done(function(info) {
                signIn(info);
            });
        };

        centralAuth.google.on('signIn', function(info) {
            signIn(info);
        });

        var signOut = function() {
            delete core.auth;
            rpWindow.$('#signOut').hide();
            rpWindow.$('.g-signin2').show();
        };

        core.signOut = function() {
            centralAuth.google.signOut().then(function() {
                signOut();
            })
        };

        centralAuth.google.on('signOut', function() {
            signOut();
        });

        rpWindow.$('#signOut a').off('click').on('click', core.signOut);
        
        return rpWindow;
    }
})(window.dynCore, window.hashNav);