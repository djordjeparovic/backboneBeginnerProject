(function (){

	window.App = {
		Models : {}, 
		Views : {},
		CustomViewOptions : {},
		Collections : {}
	};
/* define views */
	App.Views.HomePage = Backbone.View.extend({
		el: '#wrapper',
		initialize: function(opt){
			this.$el = $(this.el);
		},
		render: function(){
			var content = '<h4>Home Page</h4><p>This is our home, our place for work, and awesome place for fun!</p>';
			this.$el.empty();
			this.$el.removeAttr( 'style' );
			this.$el.append(content);
		}
	});

	App.Views.AboutPage = Backbone.View.extend({
		el: '#wrapper',
		initialize: function(opt){
			this.$el = $(this.el);
		}, 
		render: function(){
			var content = '<h4>About Page</h4><p>We are software engineers, crazy people with blue blood... </p>';
			this.$el.empty();
			this.$el.removeAttr( 'style' );
			this.$el.append(content);
		}
	});

	App.Views.ContactPage = Backbone.View.extend({
		el: '#wrapper',
		initialize: function(opt){
			this.$el = $(this.el);
		},
		render: function(){
			var content = '<h4>Contact Page</h4><p>We can do anything for you, if we want to. Don\'t call us, fill find you.</p>';
			this.$el.empty();
			this.$el.removeAttr( 'style' );
			this.$el.append(content);
		}
	});

	App.Views.ErrorPage = Backbone.View.extend({
		el: '#wrapper',
		initialize: function(opt){
			this.$el = $(this.el);
		},
		render: function(){
			var content = '<h4>Error Page</h4><p>The requested page doesn\'t exist :( </p>';
			this.$el.empty();
			if (App.CustomViewOptions['error404'].color) {
				var colr = App.CustomViewOptions['error404'].color;
				this.$el.css('background-color', colr);
			}
			this.$el.append(content);
		}
	});

	App.CustomViewOptions = { 
		'error404' : {
			color: '#f00' 
		},
		'home': {}
	}
/* end of views definition */

	var Router = Backbone.Router.extend({
		routes: {
			'': 'updateView',
	        ':page': 'updateView',
    	},
    	views: {
    		'home': App.Views.HomePage,
    		'about': App.Views.AboutPage, 
    		'contact': App.Views.ContactPage,
    		'error404': App.Views.ErrorPage
    	},
	    updateView: function (page) {
	    	page = page ? page : 'home';
	    	page = Object.keys(this.views).indexOf(page) !== -1 ? page : 'error404';

	        // create instance if it doesn't exist
	        if (typeof this.views[page] === 'function') {
	            this.views[page] = new this.views[page]( {} );
	        }
	        // render view
	        this.views[page].render();

	        // destroy previous active view and set new one 
	        if (this.active) {
	        	//this should be triggered only if we handle more views on different elements
	            //this.active.remove();
	        }
	        this.active = this.views[page];
	    }
	});

	var router = new Router();

	/* Code below this line is for demostration purpose only (making this example works) */
	App.Views.NavigationView = Backbone.View.extend({
		el: '#nav',
		initialize: function(){
			this.$el = $(this.el);
		},
		events: {
			'click #home': 'goHome',
			'click #about': 'goAbout', 
			'click #contact': 'goContact'
		}, 

		goHome: function(){
			router.navigate('home', {trigger: true});
		},
		goAbout: function(){
			router.navigate('about', {trigger: true});
		},
		goContact: function(){
			router.navigate('contact', {trigger: true});
		}
	});
	new App.Views.NavigationView();
	Backbone.history.start();
}());


