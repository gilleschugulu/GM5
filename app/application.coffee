Chaplin = require 'chaplin'
mediator = require 'mediator'
routes = require 'routes'
SessionController = require 'controllers/session_controller'
HeaderController = require 'controllers/header_controller'
Layout = require 'views/layout'

# The application object
module.exports = class Application extends Chaplin.Application
  # Set your application name here so the document title is set to
  # “Controller title – Site title” (see Layout#adjustTitle)
  title: 'Mobile Gaming News'

  initialize: ->
    super

    # Init Parse
    Parse.initialize("HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3", "3PL8aI0r5dGMhb6K1QYt4afN5hyO98yLPCBBJXha");

    # Initialize core components
    @initDispatcher()
    @initLayout()
    @initMediator()

    # Application-specific scaffold
    @initControllers()

    # Register all routes and start routing
    @initRouter routes
    # You might pass Router/History options as the second parameter.
    # Chaplin enables pushState per default and Backbone uses / as
    # the root per default. You might change that in the options
    # if necessary:
    # @initRouter routes, pushState: false, root: '/subdir/'

    # Freeze the application instance to prevent further changes
    Object.freeze? this

  # Override standard layout initializer
  # ------------------------------------
  initLayout: ->
    # Use an application-specific Layout class. Currently this adds
    # no features to the standard Chaplin Layout, it’s an empty placeholder.
    @layout = new Layout {@title}

  # Instantiate common controllers
  # ------------------------------
  initControllers: ->
    # These controllers are active during the whole application runtime.
    # You don’t need to instantiate all controllers here, only special
    # controllers which do not to respond to routes. They may govern models
    # and views which are needed the whole time, for example header, footer
    # or navigation views.
    # e.g. new NavigationController()
    new SessionController()
    new HeaderController()

  # Create additional mediator properties
  # -------------------------------------
  initMediator: ->
    # Create a user property
    mediator.user = Parse.User.current();
    # Parse credentials
    mediator.parseApplicationId = 'HGoHF8NOmWIM8P3XjhcNcRi0euFsiiiRTV0dzkE3'
    mediator.parseApiKey = '7buOMQUxUWg2kEA0nQZtpvU3kOs9yLW0Jl4YJCfy'
    # Add additional application-specific properties and methods
    # Seal the mediator
    mediator.seal()
