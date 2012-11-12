(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, Chaplin, HeaderController, Layout, SessionController, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  SessionController = require('controllers/session_controller');

  HeaderController = require('controllers/header_controller');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Mobile Gaming News';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      Parse.initialize("HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3", "3PL8aI0r5dGMhb6K1QYt4afN5hyO98yLPCBBJXha");
      this.initDispatcher();
      this.initLayout();
      this.initMediator();
      this.initControllers();
      this.initRouter(routes);
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      new SessionController();
      return new HeaderController();
    };

    Application.prototype.initMediator = function() {
      mediator.user = Parse.User.current();
      mediator.parseApplicationId = 'HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3';
      mediator.parseApiKey = '7buOMQUxUWg2kEA0nQZtpvU3kOs9yLW0Jl4YJCfy';
      return mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
}});

window.require.define({"controllers/base/controller": function(exports, require, module) {
  var Chaplin, Controller,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(Chaplin.Controller);
  
}});

window.require.define({"controllers/header_controller": function(exports, require, module) {
  var Controller, Header, HeaderController, HeaderView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  mediator = require('mediator');

  module.exports = HeaderController = (function(_super) {

    __extends(HeaderController, _super);

    function HeaderController() {
      return HeaderController.__super__.constructor.apply(this, arguments);
    }

    HeaderController.prototype.initialize = function() {
      HeaderController.__super__.initialize.apply(this, arguments);
      this.model = new Header();
      return this.view = new HeaderView({
        model: this.model
      });
    };

    return HeaderController;

  })(Controller);
  
}});

window.require.define({"controllers/home_controller": function(exports, require, module) {
  var Controller, HomeController, HomePageView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home_page_view');

  module.exports = HomeController = (function(_super) {

    __extends(HomeController, _super);

    function HomeController() {
      return HomeController.__super__.constructor.apply(this, arguments);
    }

    HomeController.prototype.historyURL = 'home';

    HomeController.prototype.index = function() {};

    return HomeController;

  })(Controller);

  this.view = HomePageView["new"];
  
}});

window.require.define({"controllers/news_controller": function(exports, require, module) {
  var Category, Controller, Language, Model, News, NewsController, NewsCreateView, NewsView, Priority, Section, Source, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Section = require('models/section');

  News = require('models/news');

  NewsView = require('views/news_view');

  NewsCreateView = require('views/news_create_view');

  Source = require('models/source');

  Category = require('models/category');

  Priority = require('models/priority');

  Language = require('models/language');

  Model = require('models/base/model');

  mediator = require('mediator');

  module.exports = NewsController = (function(_super) {

    __extends(NewsController, _super);

    function NewsController() {
      return NewsController.__super__.constructor.apply(this, arguments);
    }

    NewsController.prototype.historyURL = function(params) {
      if (params.id) {
        return "news/" + params.id;
      } else {
        return 'news';
      }
    };

    NewsController.prototype.index = function() {
      if (!mediator.user) {
        return this.redirectTo('portal');
      }
      return this.view = new NewsView();
    };

    NewsController.prototype.show = function(params) {
      var _this = this;
      if (!mediator.user) {
        return this.redirectTo('portal');
      }
      return new Parse.Query(Section).find({
        success: function(sections) {
          return new Parse.Query(Source).find({
            success: function(sources) {
              return new Parse.Query(News).include(['applicationIcon', 'image']).get(params.id, {
                success: function(news) {
                  return _this.view = new NewsCreateView({
                    model: new Model({
                      title: 'Edit a news',
                      news: news,
                      sections: sections,
                      sources: sources,
                      categories: new Category(),
                      languages: new Language(),
                      priorities: new Priority()
                    })
                  });
                },
                error: function(news, error) {
                  return alert(':(');
                }
              });
            }
          });
        }
      });
    };

    NewsController.prototype["new"] = function() {
      var _this = this;
      if (!mediator.user) {
        return this.redirectTo('portal');
      }
      return new Parse.Query(Section).find({
        success: function(sections) {
          return new Parse.Query(Source).find({
            success: function(sources) {
              return _this.view = new NewsCreateView({
                model: new Model({
                  title: 'Create a news',
                  sections: sections,
                  sources: sources,
                  news: new News(),
                  categories: new Category(),
                  languages: new Language(),
                  priorities: new Priority()
                })
              });
            }
          });
        }
      });
    };

    return NewsController;

  })(Controller);
  
}});

window.require.define({"controllers/portal_controller": function(exports, require, module) {
  var Controller, PortalController, PortalView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  PortalView = require('views/portal_view');

  mediator = require('mediator');

  module.exports = PortalController = (function(_super) {

    __extends(PortalController, _super);

    function PortalController() {
      return PortalController.__super__.constructor.apply(this, arguments);
    }

    PortalController.prototype.initialize = function() {
      return this.subscribeEvent('login', this.login);
    };

    PortalController.prototype.index = function() {
      if (mediator.user) {
        return this.loginSuccess(mediator.user);
      }
      return this.view = new PortalView();
    };

    PortalController.prototype.login = function() {
      var _this = this;
      this.publishEvent('loginStarted');
      return Parse.User.logIn(this.view.getEmail(), this.view.getPassword(), {
        success: function(user) {
          return _this.loginSuccess(user);
        },
        error: function(user, error) {
          return _this.loginFail(error);
        }
      });
    };

    PortalController.prototype.loginSuccess = function(user) {
      this.publishEvent('loginEnded');
      mediator.user = user;
      return this.redirectTo('news');
    };

    PortalController.prototype.loginFail = function(error) {
      this.publishEvent('loginEnded');
      return alert(error.message);
    };

    return PortalController;

  })(Controller);
  
}});

window.require.define({"controllers/session_controller": function(exports, require, module) {
  var Controller, LoginView, SessionController, User, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Controller = require('controllers/base/controller');

  User = require('models/user');

  LoginView = require('views/login_view');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      this.logout = __bind(this.logout, this);

      this.serviceProviderSession = __bind(this.serviceProviderSession, this);

      this.triggerLogin = __bind(this.triggerLogin, this);
      return SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {};

    SessionController.prototype.loginStatusDetermined = false;

    SessionController.prototype.loginView = null;

    SessionController.prototype.serviceProviderName = null;

    SessionController.prototype.initialize = function() {
      this.subscribeEvent('serviceProviderSession', this.serviceProviderSession);
      this.subscribeEvent('logout', this.logout);
      this.subscribeEvent('userData', this.userData);
      this.subscribeEvent('!showLogin', this.showLoginView);
      this.subscribeEvent('!login', this.triggerLogin);
      this.subscribeEvent('!logout', this.triggerLogout);
      return this.getSession();
    };

    SessionController.prototype.loadServiceProviders = function() {
      var name, serviceProvider, _ref, _results;
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.load());
      }
      return _results;
    };

    SessionController.prototype.createUser = function(userData) {
      return mediator.user = new User(userData);
    };

    SessionController.prototype.getSession = function() {
      var name, serviceProvider, _ref, _results;
      this.loadServiceProviders();
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.done(serviceProvider.getLoginStatus));
      }
      return _results;
    };

    SessionController.prototype.showLoginView = function() {
      if (this.loginView) {
        return;
      }
      this.loadServiceProviders();
      return this.loginView = new LoginView({
        serviceProviders: SessionController.serviceProviders
      });
    };

    SessionController.prototype.triggerLogin = function(serviceProviderName) {
      var serviceProvider;
      serviceProvider = SessionController.serviceProviders[serviceProviderName];
      if (!serviceProvider.isLoaded()) {
        this.publishEvent('serviceProviderMissing', serviceProviderName);
        return;
      }
      this.publishEvent('loginAttempt', serviceProviderName);
      return serviceProvider.triggerLogin();
    };

    SessionController.prototype.serviceProviderSession = function(session) {
      this.serviceProviderName = session.provider.name;
      this.disposeLoginView();
      session.id = session.userId;
      delete session.userId;
      this.createUser(session);
      return this.publishLogin();
    };

    SessionController.prototype.publishLogin = function() {
      this.loginStatusDetermined = true;
      this.publishEvent('login', mediator.user);
      return this.publishEvent('loginStatus', true);
    };

    SessionController.prototype.triggerLogout = function() {
      return this.publishEvent('logout');
    };

    SessionController.prototype.logout = function() {
      this.loginStatusDetermined = true;
      this.disposeUser();
      this.serviceProviderName = null;
      this.showLoginView();
      return this.publishEvent('loginStatus', false);
    };

    SessionController.prototype.userData = function(data) {
      return mediator.user.set(data);
    };

    SessionController.prototype.disposeLoginView = function() {
      if (!this.loginView) {
        return;
      }
      this.loginView.dispose();
      return this.loginView = null;
    };

    SessionController.prototype.disposeUser = function() {
      if (!mediator.user) {
        return;
      }
      Parse.User.logOut();
      mediator.user = null;
      return this.redirectTo('portal');
    };

    return SessionController;

  })(Controller);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(document).on('ready', function() {
    var app;
    app = new Application();
    return app.initialize();
  });
  
}});

window.require.define({"lib/services/service_provider": function(exports, require, module) {
  var Chaplin, ServiceProvider, utils;

  utils = require('lib/utils');

  Chaplin = require('chaplin');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).extend(Chaplin.EventBroker);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.load
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*

    Standard methods and their signatures:

    load: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

    loadHandler: =>
      # Init the library, then resolve
      ServiceProviderLibrary.init(foo: 'bar')
      @resolve()

    isLoaded: ->
      # Return a Boolean
      Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, loginContext)
      ServiceProviderLibrary.login callback

    # Callback for the login popup
    loginHandler: (loginContext, response) =>

      eventPayload = {provider: this, loginContext}
      if response
        # Publish successful login
        @publishEvent 'loginSuccessful', eventPayload

        # Publish the session
        @publishEvent 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.

      else
        @publishEvent 'loginFail', eventPayload

    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      ServiceProviderLibrary.getLoginStatus callback, force

    loginStatusHandler: (response) =>
      return unless response
      @publishEvent 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

  
}});

window.require.define({"lib/support": function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  var Chaplin, utils,
    __hasProp = {}.hasOwnProperty;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    /*
      Wrap methods so they can be called before a deferred is resolved.
      The actual methods are called once the deferred is resolved.
    
      Parameters:
    
      Expects an options hash with the following properties:
    
      deferred
        The Deferred object to wait for.
    
      methods
        Either:
        - A string with a method name e.g. 'method'
        - An array of strings e.g. ['method1', 'method2']
        - An object with methods e.g. {method: -> alert('resolved!')}
    
      host (optional)
        If you pass an array of strings in the `methods` parameter the methods
        are fetched from this object. Defaults to `deferred`.
    
      target (optional)
        The target object the new wrapper methods are created at.
        Defaults to host if host is given, otherwise it defaults to deferred.
    
      onDeferral (optional)
        An additional callback function which is invoked when the method is called
        and the Deferred isn't resolved yet.
        After the method is registered as a done handler on the Deferred,
        this callback is invoked. This can be used to trigger the resolving
        of the Deferred.
    
      Examples:
    
      deferMethods(deferred: def, methods: 'foo')
        Wrap the method named foo of the given deferred def and
        postpone all calls until the deferred is resolved.
    
      deferMethods(deferred: def, methods: def.specialMethods)
        Read all methods from the hash def.specialMethods and
        create wrapped methods with the same names at def.
    
      deferMethods(
        deferred: def, methods: def.specialMethods, target: def.specialMethods
      )
        Read all methods from the object def.specialMethods and
        create wrapped methods at def.specialMethods,
        overwriting the existing ones.
    
      deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
        Wrap the methods obj.foo and obj.bar so all calls to them are postponed
        until def is resolved. obj.foo and obj.bar are overwritten
        with their wrappers.
    */

    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') {
          continue;
        }
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) {
        context = deferred;
      }
      return function() {
        var args;
        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') {
            return onDeferral.apply(context);
          }
        }
      };
    }
  });

  module.exports = utils;
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context;
    context = mediator.user || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });
  
}});

window.require.define({"mediator": function(exports, require, module) {
  
  module.exports = require('chaplin').mediator;
  
}});

window.require.define({"models/base/collection": function(exports, require, module) {
  var Chaplin, Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Chaplin.Collection);
  
}});

window.require.define({"models/base/model": function(exports, require, module) {
  var Chaplin, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Chaplin.Model);
  
}});

window.require.define({"models/category": function(exports, require, module) {
  var Category, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Category = (function(_super) {

    __extends(Category, _super);

    function Category() {
      return Category.__super__.constructor.apply(this, arguments);
    }

    Category.prototype.defaults = {
      items: [
        {
          value: '',
          name: 'Selectionner'
        }, {
          value: '1',
          name: 'Test'
        }, {
          value: '2',
          name: 'News'
        }, {
          value: '3',
          name: 'Dossier'
        }, {
          value: '4',
          name: 'Business'
        }, {
          value: '5',
          name: 'Rumeur'
        }
      ]
    };

    return Category;

  })(Model);
  
}});

window.require.define({"models/file": function(exports, require, module) {
  var File, Model, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  mediator = require('mediator');

  module.exports = File = (function(_super) {

    __extends(File, _super);

    function File() {
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.className = 'File';

    File.prototype.serialize = function() {
      return this;
    };

    File.prototype.upload = function(callbacks) {
      var _this = this;
      if (!this.data) {
        return;
      }
      return $.ajax({
        type: 'POST',
        url: "https://api.parse.com/1/files/" + this.data.name,
        data: this.data,
        processData: false,
        contentType: false,
        beforeSend: function(request) {
          request.setRequestHeader('X-Parse-Application-Id', mediator.parseApplicationId);
          request.setRequestHeader('X-Parse-REST-API-Key', mediator.parseApiKey);
          return request.setRequestHeader('Content-Type', this.data.type);
        },
        success: function(data) {
          _this.name = data.name;
          _this.url = data.url;
          return _this.bind(callbacks);
        },
        error: function(data) {
          if (callbacks.error) {
            return callbacks.error($.parseJSON(data)).error;
          }
        }
      });
    };

    File.prototype.bind = function(callbacks) {
      var _this = this;
      if (!(this.name && this.url)) {
        return;
      }
      return $.ajax({
        type: 'POST',
        url: "https://api.parse.com/1/classes/" + this.className,
        data: JSON.stringify({
          image: {
            name: this.name,
            __type: 'File'
          }
        }),
        beforeSend: function(request) {
          request.setRequestHeader('X-Parse-Application-Id', mediator.parseApplicationId);
          request.setRequestHeader('X-Parse-REST-API-Key', mediator.parseApiKey);
          return request.setRequestHeader('Content-Type', 'application/json');
        },
        success: function(data) {
          _this.id = data.objectId;
          if (callbacks.success) {
            return callbacks.success();
          }
        },
        error: function(data) {
          console.log('err');
          if (callbacks.error) {
            return callbacks.error($.parseJSON(data)).error;
          }
        }
      });
    };

    return File;

  })(Parse.Object);
  
}});

window.require.define({"models/header": function(exports, require, module) {
  var Header, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Header = (function(_super) {

    __extends(Header, _super);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.defaults = {
      items: [
        {
          href: './test/',
          title: 'App Tests'
        }, {
          href: 'http://brunch.readthedocs.org/',
          title: 'Docs'
        }, {
          href: 'https://github.com/brunch/brunch/issues',
          title: 'Github Issues'
        }, {
          href: 'https://github.com/paulmillr/ostio',
          title: 'Ost.io Example App'
        }
      ]
    };

    return Header;

  })(Model);
  
}});

window.require.define({"models/language": function(exports, require, module) {
  var Language, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Language = (function(_super) {

    __extends(Language, _super);

    function Language() {
      return Language.__super__.constructor.apply(this, arguments);
    }

    Language.prototype.defaults = {
      items: [
        {
          value: '',
          name: 'Selectionner'
        }, {
          value: 'fr',
          name: 'Francais'
        }, {
          value: 'en',
          name: 'Anglais'
        }
      ]
    };

    return Language;

  })(Model);
  
}});

window.require.define({"models/news": function(exports, require, module) {
  var Model, News,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = News = (function(_super) {

    __extends(News, _super);

    function News() {
      return News.__super__.constructor.apply(this, arguments);
    }

    News.prototype.className = 'News';

    News.prototype.serialize = function() {
      return this;
    };

    return News;

  })(Parse.Object);
  
}});

window.require.define({"models/priority": function(exports, require, module) {
  var Model, Priority,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Priority = (function(_super) {

    __extends(Priority, _super);

    function Priority() {
      return Priority.__super__.constructor.apply(this, arguments);
    }

    Priority.prototype.defaults = {
      items: [
        {
          value: '',
          name: 'Selectionner'
        }, {
          value: '1',
          name: 'Mineur'
        }, {
          value: '2',
          name: 'Medium'
        }, {
          value: '3',
          name: 'Majeur'
        }
      ]
    };

    return Priority;

  })(Model);
  
}});

window.require.define({"models/section": function(exports, require, module) {
  var Model, Section,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Section = (function(_super) {

    __extends(Section, _super);

    function Section() {
      return Section.__super__.constructor.apply(this, arguments);
    }

    Section.prototype.className = 'Section';

    Section.prototype.serialize = function() {
      return this;
    };

    return Section;

  })(Parse.Object);
  
}});

window.require.define({"models/source": function(exports, require, module) {
  var Model, Source,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Source = (function(_super) {

    __extends(Source, _super);

    function Source() {
      return Source.__super__.constructor.apply(this, arguments);
    }

    Source.prototype.className = 'Source';

    Source.prototype.serialize = function() {
      return this;
    };

    return Source;

  })(Parse.Object);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  var Model, User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Model);
  
}});

window.require.define({"routes": function(exports, require, module) {
  
  module.exports = function(match) {
    match('', 'portal#index');
    match('portal', 'portal#index');
    match('news', 'news#index');
    match('news/new', 'news#new');
    return match('news/:id', 'news#show');
  };
  
}});

window.require.define({"views/base/collection_view": function(exports, require, module) {
  var Chaplin, CollectionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
}});

window.require.define({"views/base/page_view": function(exports, require, module) {
  var PageView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  module.exports = PageView = (function(_super) {

    __extends(PageView, _super);

    function PageView() {
      return PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.container = '#page-container';

    PageView.prototype.autoRender = true;

    PageView.prototype.renderedSubviews = false;

    PageView.prototype.initialize = function() {
      var rendered,
        _this = this;
      PageView.__super__.initialize.apply(this, arguments);
      if (this.model || this.collection) {
        rendered = false;
        return this.modelBind('change', function() {
          if (!rendered) {
            _this.render();
          }
          return rendered = true;
        });
      }
    };

    PageView.prototype.renderSubviews = function() {};

    PageView.prototype.render = function() {
      PageView.__super__.render.apply(this, arguments);
      if (!this.renderedSubviews) {
        this.renderSubviews();
        return this.renderedSubviews = true;
      }
    };

    return PageView;

  })(View);
  
}});

window.require.define({"views/base/view": function(exports, require, module) {
  var Chaplin, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
}});

window.require.define({"views/header_view": function(exports, require, module) {
  var HeaderView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/header');

  mediator = require('mediator');

  module.exports = HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.template = template;

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.container = '#header-container';

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.events = function() {
      return {
        "click #logout": "logout"
      };
    };

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.render);
      this.subscribeEvent('startupController', this.render);
      return Handlebars.registerHelper('isLoggedIn', function(block) {
        if (mediator.user) {
          return block();
        }
      });
    };

    HeaderView.prototype.logout = function() {
      return this.publishEvent('logout');
    };

    return HeaderView;

  })(View);
  
}});

window.require.define({"views/home_page_view": function(exports, require, module) {
  var HomePageView, PageView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  PageView = require('views/base/page_view');

  module.exports = HomePageView = (function(_super) {

    __extends(HomePageView, _super);

    function HomePageView() {
      return HomePageView.__super__.constructor.apply(this, arguments);
    }

    HomePageView.prototype.template = template;

    HomePageView.prototype.className = 'home-page';

    return HomePageView;

  })(PageView);
  
}});

window.require.define({"views/layout": function(exports, require, module) {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      return Layout.__super__.initialize.apply(this, arguments);
    };

    return Layout;

  })(Chaplin.Layout);
  
}});

window.require.define({"views/login_view": function(exports, require, module) {
  var LoginView, View, template, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  View = require('views/base/view');

  template = require('views/templates/login');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = template;

    LoginView.prototype.id = 'login';

    LoginView.prototype.container = '#content-container';

    LoginView.prototype.autoRender = true;

    LoginView.prototype.initialize = function(options) {
      LoginView.__super__.initialize.apply(this, arguments);
      return this.initButtons(options.serviceProviders);
    };

    LoginView.prototype.initButtons = function(serviceProviders) {
      var buttonSelector, failed, loaded, loginHandler, serviceProvider, serviceProviderName, _results;
      _results = [];
      for (serviceProviderName in serviceProviders) {
        serviceProvider = serviceProviders[serviceProviderName];
        buttonSelector = "." + serviceProviderName;
        this.$(buttonSelector).addClass('service-loading');
        loginHandler = _(this.loginWith).bind(this, serviceProviderName, serviceProvider);
        this.delegate('click', buttonSelector, loginHandler);
        loaded = _(this.serviceProviderLoaded).bind(this, serviceProviderName, serviceProvider);
        serviceProvider.done(loaded);
        failed = _(this.serviceProviderFailed).bind(this, serviceProviderName, serviceProvider);
        _results.push(serviceProvider.fail(failed));
      }
      return _results;
    };

    LoginView.prototype.loginWith = function(serviceProviderName, serviceProvider, event) {
      event.preventDefault();
      if (!serviceProvider.isLoaded()) {
        return;
      }
      this.publishEvent('login:pickService', serviceProviderName);
      return this.publishEvent('!login', serviceProviderName);
    };

    LoginView.prototype.serviceProviderLoaded = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading');
    };

    LoginView.prototype.serviceProviderFailed = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading').addClass('service-unavailable').attr('disabled', true).attr('title', "Error connecting. Please check whether you areblocking " + (utils.upcase(serviceProviderName)) + ".");
    };

    return LoginView;

  })(View);
  
}});

window.require.define({"views/news_create_view": function(exports, require, module) {
  var File, News, NewsCreateView, Section, Source, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/news_details');

  File = require('models/file');

  News = require('models/news');

  Section = require('models/section');

  Source = require('models/source');

  mediator = require('mediator');

  module.exports = NewsCreateView = (function(_super) {

    __extends(NewsCreateView, _super);

    function NewsCreateView() {
      return NewsCreateView.__super__.constructor.apply(this, arguments);
    }

    NewsCreateView.prototype.template = template;

    NewsCreateView.prototype.autoRender = true;

    NewsCreateView.prototype.container = '#page-container';

    NewsCreateView.prototype.initialize = function() {
      var _this = this;
      NewsCreateView.__super__.initialize.apply(this, arguments);
      Handlebars.registerHelper('applicationIconUrl', function(block) {
        if (!_this.model.get('news').get('applicationIcon')) {
          return '#';
        }
        return _this.model.get('news').get('applicationIcon').get('image').url;
      });
      Handlebars.registerHelper('newsImage', function(block) {
        if (!_this.model.get('news').get('image')) {
          return '#';
        }
        return _this.model.get('news').get('image').get('image').url;
      });
      Handlebars.registerHelper('isSelectedSection', function(section, block) {
        if (_this.model.get('news').get('section') && section.id === _this.model.get('news').get('section').id) {
          return block(section);
        } else {
          return block.inverse(section);
        }
      });
      Handlebars.registerHelper('isSelectedSource', function(source, block) {
        if (_this.model.get('news').get('source') && source.id === _this.model.get('news').get('source').id) {
          return block(source);
        } else {
          return block.inverse(source);
        }
      });
      Handlebars.registerHelper('isSelectedCategory', function(category, block) {
        if (_this.model.get('news').get('category') === category.value) {
          return block(category);
        } else {
          return block.inverse(category);
        }
      });
      Handlebars.registerHelper('isSelectedPriority', function(priority, block) {
        if (_this.model.get('news').get('priority') === priority.value) {
          return block(priority);
        } else {
          return block.inverse(priority);
        }
      });
      return Handlebars.registerHelper('isSelectedLanguage', function(language, block) {
        if (_this.model.get('news').get('lang') === language.value) {
          return block(language);
        } else {
          return block.inverse(language);
        }
      });
    };

    NewsCreateView.prototype.events = function() {
      return {
        'change #input-news-image, #input-application-icon': 'showImagePreview',
        'change input[name=input-section]:checked': 'sectionChanged',
        'change input#input-origin-url': 'originUrlChanged',
        'change input#input-tags': 'tagsChanged',
        'change input#input-title': 'titleChanged',
        'change input#input-application-name': 'applicationNameChanged',
        'change input#input-application-appstore-id': 'applicationAppStoreIdChanged',
        'change input#input-application-type': 'applicationTypeChanged',
        'change input#input-application-version': 'applicationVersionChanged',
        'change input#input-application-price': 'applicationPriceChanged',
        'change input#input-application-ranking': 'applicationRankingChanged',
        'change select#input-category': 'categoryChanged',
        'change select#input-priority': 'priorityChanged',
        'change select#input-lang': 'langChanged',
        'change select#input-source': 'sourceChanged',
        'click #submit-button': 'submit'
      };
    };

    NewsCreateView.prototype.showImagePreview = function(event) {
      var data, fileReader;
      data = (event.target.files || event.target.dataTransfer.files)[0];
      this.model.set("" + event.target.id + "-data", data);
      fileReader = new FileReader();
      fileReader.onload = function() {
        return $("#" + event.target.id + "-preview").attr('src', fileReader.result);
      };
      return fileReader.readAsDataURL(data);
    };

    NewsCreateView.prototype.sectionChanged = function(event) {
      return this.model.get('news').set('section', event.target.value === '0' ? null : new Section({
        id: event.target.value
      }));
    };

    NewsCreateView.prototype.originUrlChanged = function(event) {
      return this.model.get('news').set('originUrl', event.target.value);
    };

    NewsCreateView.prototype.tagsChanged = function(event) {
      return this.model.get('news').set('tags', event.target.value);
    };

    NewsCreateView.prototype.titleChanged = function(event) {
      return this.model.get('news').set('title', event.target.value);
    };

    NewsCreateView.prototype.categoryChanged = function(event) {
      return this.model.get('news').set('category', event.target.value);
    };

    NewsCreateView.prototype.priorityChanged = function(event) {
      return this.model.get('news').set('priority', event.target.value);
    };

    NewsCreateView.prototype.langChanged = function(event) {
      return this.model.get('news').set('lang', event.target.value);
    };

    NewsCreateView.prototype.sourceChanged = function(event) {
      return this.model.get('news').set('source', event.target.value === '0' ? null : new Source({
        id: event.target.value
      }));
    };

    NewsCreateView.prototype.applicationNameChanged = function(event) {
      return this.model.get('news').set('applicationName', event.target.value);
    };

    NewsCreateView.prototype.applicationAppStoreIdChanged = function(event) {
      alert(event.target.value);
      return this.model.get('news').set('applicationAppStoreId', event.target.value);
    };

    NewsCreateView.prototype.applicationTypeChanged = function(event) {
      return this.model.get('news').set('applicationType', event.target.value);
    };

    NewsCreateView.prototype.applicationVersionChanged = function(event) {
      return this.model.get('news').set('applicationVersion', event.target.value);
    };

    NewsCreateView.prototype.applicationPriceChanged = function(event) {
      return this.model.get('news').set('applicationPrice', event.target.value);
    };

    NewsCreateView.prototype.applicationRankingChanged = function(event) {
      return this.model.get('news').set('applicationRanking', event.target.value);
    };

    NewsCreateView.prototype.getNewsImage = function() {
      return this.model.get("input-news-image-data");
    };

    NewsCreateView.prototype.getApplicationIcon = function() {
      return this.model.get("input-application-icon-data");
    };

    NewsCreateView.prototype.submit = function() {
      var newsPtr,
        _this = this;
      newsPtr = this.model.get('news');
      newsPtr.set('description', $('#input-description').html());
      return newsPtr.save(null, {
        success: function(news) {
          var applicationIconFile, newsImageFile;
          if (_this.getNewsImage()) {
            newsImageFile = new File();
            newsImageFile.data = _this.getNewsImage();
            newsImageFile.upload({
              success: function() {
                newsPtr.set('image', newsImageFile);
                return newsPtr.save(null);
              }
            });
          }
          if (_this.getApplicationIcon()) {
            applicationIconFile = new File();
            applicationIconFile.data = _this.getApplicationIcon();
            applicationIconFile.upload({
              success: function() {
                newsPtr.set('applicationIcon', applicationIconFile);
                return newsPtr.save(null);
              }
            });
          }
          return _this.publishEvent('!startupController', 'news', 'index');
        },
        error: function(news, error) {
          return alert(error.message);
        }
      });
    };

    NewsCreateView.prototype.afterRender = function() {
      NewsCreateView.__super__.afterRender.apply(this, arguments);
      return $('#input-description').tinymce({
        script_url: '/tiny_mce/tiny_mce.js',
        theme: "advanced",
        plugins: "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
        theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "left",
        theme_advanced_statusbar_location: "bottom",
        theme_advanced_resizing: true
      });
    };

    return NewsCreateView;

  })(View);
  
}});

window.require.define({"views/news_list_item_view": function(exports, require, module) {
  var NewsListItemView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/news_list_item');

  mediator = require('mediator');

  module.exports = NewsListItemView = (function(_super) {

    __extends(NewsListItemView, _super);

    function NewsListItemView() {
      return NewsListItemView.__super__.constructor.apply(this, arguments);
    }

    NewsListItemView.prototype.template = template;

    NewsListItemView.prototype.autoRender = true;

    NewsListItemView.prototype.tagName = 'tr';

    NewsListItemView.prototype.events = function() {
      return {
        "click .news-actions-destroy": "clickDestroy",
        "click .news-actions-edit": "clickEdit",
        "click .news-actions-status-toggle": "toggleStatus"
      };
    };

    NewsListItemView.prototype.clickEdit = function(event) {
      return mediator.publish('!startupController', 'news', 'show', {
        id: this.model.id
      });
    };

    NewsListItemView.prototype.clickDestroy = function(event) {
      if (confirm('Vraiment?! :O')) {
        $(this.el).remove();
        return this.model.destroy();
      }
    };

    NewsListItemView.prototype.toggleStatus = function(event) {
      this.model.set('active', !this.model.get('active'));
      this.model.save(null);
      if (this.model.get('active')) {
        $(event.target).removeClass('btn-danger');
        $(event.target).addClass('btn-success');
        return $(event.target).val('Active');
      } else {
        $(event.target).removeClass('btn-success');
        $(event.target).addClass('btn-danger');
        return $(event.target).val('Inactive');
      }
    };

    NewsListItemView.prototype.render = function() {
      NewsListItemView.__super__.render.apply(this, arguments);
      switch (false) {
        case this.model.get('priority') !== 1:
          return $(this.el).find('.priority-label').addClass('label-info');
        case this.model.get('priority') !== 2:
          return $(this.el).find('.priority-label').addClass('label-warning');
        case this.model.get('priority') !== 3:
          return $(this.el).find('.priority-label').addClass('label-important');
      }
    };

    NewsListItemView.prototype.initialize = function() {
      var _this = this;
      NewsListItemView.__super__.initialize.apply(this, arguments);
      Handlebars.registerHelper('newsImage', function(block) {
        if (!_this.model.get('image')) {
          return '#';
        }
        return _this.model.get('image').get('image').url;
      });
      Handlebars.registerHelper('formatedCreationDate', function(block) {
        return _this.model.createdAt.substring(0, 10);
      });
      Handlebars.registerHelper('formatedPriority', function(block) {
        switch (false) {
          case _this.model.get('priority') !== 1:
            return 'Low';
          case _this.model.get('priority') !== 2:
            return 'Medium';
          case _this.model.get('priority') !== 3:
            return 'High';
        }
      });
      return Handlebars.registerHelper('isActive', function(block) {
        if (_this.model.get('active')) {
          return block(_this);
        } else {
          return block.inverse(_this);
        }
      });
    };

    return NewsListItemView;

  })(View);
  
}});

window.require.define({"views/news_view": function(exports, require, module) {
  var Collection, Model, News, NewsListItemView, NewsView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/news');

  News = require('models/news');

  Model = require('models/base/model');

  Collection = require('models/base/collection');

  NewsListItemView = require('views/news_list_item_view');

  module.exports = NewsView = (function(_super) {

    __extends(NewsView, _super);

    function NewsView() {
      return NewsView.__super__.constructor.apply(this, arguments);
    }

    NewsView.prototype.template = template;

    NewsView.prototype.container = '#page-container';

    NewsView.prototype.autoRender = true;

    NewsView.prototype.initialize = function() {
      return NewsView.__super__.initialize.apply(this, arguments);
    };

    NewsView.prototype.add_news_item = function(news) {
      var row;
      row = new NewsListItemView({
        model: news
      });
      return $("#news_list").append(row.render().el);
    };

    NewsView.prototype.reload_data = function() {
      var news, _i, _len, _ref;
      $("#news_list > tbody").empty();
      _ref = this.model.get('news');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        news = _ref[_i];
        this.add_news_item(news);
      }
      return $('.status-toggle').switchify();
    };

    NewsView.prototype.afterRender = function() {
      NewsView.__super__.afterRender.apply(this, arguments);
      return this.refresh();
    };

    NewsView.prototype.refresh = function() {
      var _this = this;
      return new Parse.Query(News).include(['image', 'section', 'source']).find({
        success: function(news) {
          _this.model = new Model({
            news: news
          });
          return _this.reload_data();
        }
      });
    };

    return NewsView;

  })(View);
  
}});

window.require.define({"views/portal_view": function(exports, require, module) {
  var PortalView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/portal');

  module.exports = PortalView = (function(_super) {

    __extends(PortalView, _super);

    function PortalView() {
      return PortalView.__super__.constructor.apply(this, arguments);
    }

    PortalView.prototype.template = template;

    PortalView.prototype.container = '#page-container';

    PortalView.prototype.autoRender = true;

    PortalView.prototype.id = 'portal';

    PortalView.prototype.initialize = function() {
      PortalView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStarted', function() {
        return $('#sign-in-button').attr('disabled', 'disabled');
      });
      return this.subscribeEvent('loginEnded', function() {
        return $('#sign-in-button').attr('disabled', null);
      });
    };

    PortalView.prototype.events = function() {
      return {
        "click #sign-in-button": "login"
      };
    };

    PortalView.prototype.login = function(event) {
      return this.publishEvent('login');
    };

    PortalView.prototype.getEmail = function() {
      return $('#inputEmail').attr('value');
    };

    PortalView.prototype.getPassword = function() {
      return $('#inputPassword').attr('value');
    };

    return PortalView;

  })(View);
  
}});

window.require.define({"views/templates/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    
    return "\n             <li class=\"active\">\n               <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">News <span class=\"caret\"></span></a>\n               <ul class=\"dropdown-menu\">\n                 <li><a href=\"/news\">All news</a></li>\n                 <li><a href=\"javascript: window.location.href='/news/new'\">Create a news</a></li>\n               </ul>\n             </li>\n             <li><a href=\"#\" id=\"logout\">Logout</a></li>\n          ";}

    buffer += "<div class=\"navbar navbar-inverse navbar-fixed-top\">\n  <div class=\"navbar-inner\">\n    <div class=\"container\">\n      <a class=\"btn btn-navbar\" data-toggle=\"collapse\" data-target=\".nav-collapse\">\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </a>\n      <a class=\"brand\" href=\"/news\">Mobile Gaming News</a>\n      <div class=\"nav-collapse collapse\">\n        <ul class=\"nav\">\n          ";
    foundHelper = helpers.isLoggedIn;
    stack1 = foundHelper || depth0.isLoggedIn;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        </ul>\n      </div><!--/.nav-collapse -->\n    </div>\n  </div>\n</div>\n ";
    return buffer;});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/login": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/news": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<legend>News List</legend>\n<table id=\"news_list\" class=\"table table-hover\">\n	<thead>\n		<tr>\n			<th>Image</th>\n			<th>Date</th>\n			<th>Priority</th>\n			<th>Titre</th>\n			<th>Source</th>\n			<th>Category</th>\n			<th>Language</th>\n			<th>Status</th>\n			<th></th>\n		</tr>\n	</thead>\n</table>\n<legend>Actions</legend>\n<a class=\"btn btn-large btn-block btn-primary\" href=\"/news/new\">Create a News</a>\n\n";});
}});

window.require.define({"views/templates/news_details": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	  <label class=\"radio inline\">\n      ";
    stack1 = depth0;
    foundHelper = helpers.isSelectedSection;
    stack2 = foundHelper || depth0.isSelectedSection;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	  </label>\n  ";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n        <input type=\"radio\" name=\"input-section\" value=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" checked> ";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n      ";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		  	<input type=\"radio\" name=\"input-section\" value=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> ";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n      ";
    return buffer;}

  function program6(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n          ";
    stack1 = depth0;
    foundHelper = helpers.isSelectedCategory;
    stack2 = foundHelper || depth0.isSelectedCategory;
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(9, program9, data);
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        ";
    return buffer;}
  function program7(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" selected>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program9(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program11(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n          ";
    stack1 = depth0;
    foundHelper = helpers.isSelectedPriority;
    stack2 = foundHelper || depth0.isSelectedPriority;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(14, program14, data);
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        ";
    return buffer;}
  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" selected>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program16(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n          ";
    stack1 = depth0;
    foundHelper = helpers.isSelectedLanguage;
    stack2 = foundHelper || depth0.isSelectedLanguage;
    tmp1 = self.program(17, program17, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(19, program19, data);
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n        ";
    return buffer;}
  function program17(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" selected>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program19(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "value", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program21(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n          ";
    stack1 = depth0;
    foundHelper = helpers.isSelectedSource;
    stack2 = foundHelper || depth0.isSelectedSource;
    tmp1 = self.program(22, program22, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(24, program24, data);
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  			";
    return buffer;}
  function program22(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" selected>";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program24(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            <option value=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>      \n          ";
    return buffer;}

  function program26(depth0,data) {
    
    
    return "\n        <button type=\"button\" class=\"btn btn-large btn-block btn-primary\" id=\"submit-button\">Edit News!</button>\n      ";}

  function program28(depth0,data) {
    
    
    return "\n        <button type=\"button\" class=\"btn btn-large btn-block btn-primary\" id=\"submit-button\">Create News!</button>\n      ";}

    buffer += "\n<!-- Shall we move this somewhere more appropriate? -->\n<script src=\"/tiny_mce/jquery.tinymce.js\"></script>\n\n<form class=\"form-horizontal\">\n  <legend>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</legend>\n  <label>Rubrique</label>\n  ";
    foundHelper = helpers.sections;
    stack1 = foundHelper || depth0.sections;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  <br />\n  <br />\n	<label>URL origine</label>\n	<input class=\"input-xxlarge\" type=\"text\" id=\"input-origin-url\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.originUrl);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.originUrl", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  <br />\n  <br />\n  <label>Tag</label>\n  <input class=\"input-xxlarge\" type=\"text\" id=\"input-tags\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.tags);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.tags", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  <br />\n  <br />\n  <div class=\"row\">\n  	<div class=\"span2\">\n  		<label>Categorie</label>\n  		<select class=\"span2\" id=\"input-category\">\n        ";
    foundHelper = helpers.categories;
    stack1 = foundHelper || depth0.categories;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.items);
    stack2 = helpers.each;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  		</select>\n  	</div>\n  	<div class=\"span2\">\n  		<label>Importance</label>\n  		<select class=\"span2\" id=\"input-priority\">\n        ";
    foundHelper = helpers.priorities;
    stack1 = foundHelper || depth0.priorities;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.items);
    stack2 = helpers.each;
    tmp1 = self.program(11, program11, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  		</select>\n  	</div>\n  	<div class=\"span2\">\n  		<label>Langue</label>\n  		<select class=\"span2\" id=\"input-lang\">\n        ";
    foundHelper = helpers.languages;
    stack1 = foundHelper || depth0.languages;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.items);
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  		</select>\n  	</div>\n  	<div class=\"span2\">\n  		<label>Source</label>\n  		<select class=\"span2\" id=\"input-source\">\n        <option value=\"\">Selectioner</option>\n  			";
    foundHelper = helpers.sources;
    stack1 = foundHelper || depth0.sources;
    stack2 = helpers.each;
    tmp1 = self.program(21, program21, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  		</select>\n  	</div>\n  </div>\n  <br />\n  <div class=\"row\">\n    <div class=\"span7\">\n      <label>Titre</label>\n      <input class=\"span7\" type=\"text\" id=\"input-title\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n    </div>\n  </div>\n  <br />\n  <div class=\"row\">\n    <div class=\"span5\">\n      <label>Image associe au titre</label>\n      <input type=\"file\" id=\"input-news-image\">\n      <img id=\"input-news-image-preview\" src=\"";
    foundHelper = helpers.newsImage;
    stack1 = foundHelper || depth0.newsImage;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "newsImage", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" alt=\"News image preview\" />\n    </div>\n  </div>\n  <br>\n  <div class=\"row\">\n  	<div class=\"span12\">\n  		<label>Description</label>\n  		<textarea id=\"input-description\" rows=\"15\" cols=\"80\">";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>\n  	</div>\n  </div>\n  <br>\n  <div class=\"row\">\n  	<div class=\"span6\">\n  		<label>Nom de l'application</label>\n		  <input class=\"span6\" type=\"text\" id=\"input-application-name\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationName);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationName", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  	</div>\n  	<div class=\"span2\">\n	 		<label>App Store Id</label>\n	  	<input type=\"text\" id=\"input-application-appstore-id\" class=\"span2\" id=\"input-application-appstore-id\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationAppStoreId);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationAppStoreId", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  	</div>\n  </div>\n  <br />\n  <div class=\"row\">\n    <div class=\"span4\">\n      <label>Icon</label>\n      <input type=\"file\" id=\"input-application-icon\">\n      <img id=\"input-application-icon-preview\" src=\"";
    foundHelper = helpers.applicationIconUrl;
    stack1 = foundHelper || depth0.applicationIconUrl;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "applicationIconUrl", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" alt=\"Application's icon preview\" />\n    </div>\n  </div>\n  <br>\n  <div class=\"row\">\n  	<div class=\"span6\">\n	 		<label>Type du jeu</label>\n	  	<input class=\"span6\" type=\"text\" id=\"input-application-type\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationType);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationType", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  	</div>\n  	<div class=\"span2\">\n	 		<label>Version</label>\n	  	<input type=\"text\" id=\"input-application-version\" class=\"span2\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationVersion);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationVersion", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n  	</div>\n  </div>  \n  <br />\n  <div class=\"row\">\n  	<div class=\"span1\">\n	 		<label>Prix</label>\n      <div class=\"input-append\">\n        <input class=\"span1\" id=\"input-application-price\" type=\"text\" style=\"text-align:right\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationPrice);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationPrice", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n        <span class=\"add-on\">€</span>\n      </div>\n  	</div>\n  	<div class=\"span2\">\n	 		<label>Note</label>\n      <div class=\"input-append\">\n        <input class=\"span1\" id=\"input-application-ranking\" type=\"text\" style=\"text-align:right\" value=\"";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.applicationRanking);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "news.attributes.applicationRanking", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n        <span class=\"add-on\">/5</span>\n      </div>\n  	</div>\n  </div>\n  <br>\n  <div class=\"row\">\n  	<div class=\"span12\">\n      ";
    foundHelper = helpers.news;
    stack1 = foundHelper || depth0.news;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.id);
    stack2 = helpers['if'];
    tmp1 = self.program(26, program26, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(28, program28, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  	</div>\n  </div>\n</form>";
    return buffer;});
}});

window.require.define({"views/templates/news_list_item": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    
    return "\n		<input type=\"button\" class=\"btn btn-small btn-success news-actions-status-toggle\" value=\"Active\"/>\n	";}

  function program3(depth0,data) {
    
    
    return "\n		<input type=\"button\" class=\"btn btn-small btn-danger news-actions-status-toggle\" value=\"Inactive\"/>\n	";}

    buffer += "<td style=\"width: 110px\"><img src=\"";
    foundHelper = helpers.newsImage;
    stack1 = foundHelper || depth0.newsImage;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "newsImage", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" width=\"110\" height=\"110\"/></td>\n<td style=\"white-space:nowrap\">";
    foundHelper = helpers.formatedCreationDate;
    stack1 = foundHelper || depth0.formatedCreationDate;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "formatedCreationDate", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td style=\"white-space:nowrap\"><span class=\"label priority-label\">";
    foundHelper = helpers.formatedPriority;
    stack1 = foundHelper || depth0.formatedPriority;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "formatedPriority", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span></td>\n<td style=\"white-space:nowrap\">";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td style=\"white-space:nowrap\">";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.source);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.source.attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td style=\"white-space:nowrap\">";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.section);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.attributes);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.section.attributes.name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td style=\"white-space:nowrap\">";
    foundHelper = helpers.attributes;
    stack1 = foundHelper || depth0.attributes;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.lang);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attributes.lang", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td style=\"width: 200px\">\n	";
    foundHelper = helpers.isActive;
    stack1 = foundHelper || depth0.isActive;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(3, program3, data);
    if(foundHelper && typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</td>\n<td style=\"width: 90px\">\n	<div id=\"news-";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "-actions\" style=\"width: 100%;height: 100%\"> \n		<input type=\"button\" class=\"news-actions-edit btn btn-small btn-block btn-primary\" value=\"Edit\"/>\n		<input type=\"button\" class=\"news-actions-destroy btn btn-small btn-block btn-danger\" value=\"Effacer\" confirm=\"alert('sure?')\"/>\n	</div>\n</td>";
    return buffer;});
}});

window.require.define({"views/templates/portal": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<form class=\"form-horizontal\" onsubmit=\"javascript: $('#sign-in-button').click()\">\n	<legend>Login</legend>\n  <div class=\"control-group\">\n    <label class=\"control-label\" for=\"inputEmail\">Email</label>\n    <div class=\"controls\">\n      <input type=\"text\" id=\"inputEmail\" placeholder=\"Email\">\n    </div>\n  </div>\n  <div class=\"control-group\">\n    <label class=\"control-label\" for=\"inputPassword\">Password</label>\n    <div class=\"controls\">\n      <input type=\"password\" id=\"inputPassword\" placeholder=\"Password\">\n    </div>\n  </div>\n  <div class=\"control-group\">\n    <div class=\"controls\">\n      <label class=\"checkbox\">\n        <input type=\"checkbox\"> Remember me\n      </label>\n      <button type=\"submit\" class=\"btn\" id=\"sign-in-button\">Sign in</button>\n    </div>\n  </div>\n</form>\n";});
}});

