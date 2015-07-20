//### 

'use strict';
	(function (){
	var debug = function (v){
		//console.log("[ CALLED: " + v + "() ]");   
	};
	var errorFn = function(err){
		alert("Error: " + err);
	};
	/* "database" */
	window.CarData=[{id:1,title:"Ford Freemont",price:2223,mileage:190343,
	transmission:"Automatic",noOfPics:3,imageUrl:"images/freemont.jpg",selected:"",dealer:"",
	phone:"064 123 1234"},{id:2,title:"Dodge X",price:45e3,mileage:34200,
	transmission:"Manual",noOfPics:1,imageUrl:"images/dodge.jpg",selected:"",
	dealer:"Mishkovic",phone:"064 123 1234"},{id:3,title:"Mercedes S",price:30100,
	mileage:200190,transmission:"Manual",noOfPics:2,imageUrl:"images/mercedes.jpg",
	selected:"",dealer:"",phone:"064 123 1234"},{id:4,title:"Golf kec",price:200,
	mileage:3e5,transmission:"Manual",noOfPics:1,imageUrl:"images/golf.jpg",
	selected:"",dealer:"",phone:"064 123 1234"},{id:5,title:"BMW i3",price:86e3,
	mileage:20,transmission:"Automatic",noOfPics:10,imageUrl:"images/bmw.jpg",
	selected:"",dealer:"BMW Belgrade",phone:"064 123 1234"},{id:6,title:"Zastava Fico 850",
	price:1e3,mileage:2e5,transmission:"Manual",noOfPics:10,imageUrl:"images/fico.jpg",
	selected:"",dealer:"",phone:"064 123 1234"},{id:7,title:"Range Rover",price:95e3,
	mileage:15e4,transmission:"Manual",noOfPics:10,imageUrl:"images/rover.jpg",
	selected:"",dealer:"",phone:"064 123 1234"}];

	window.App = {
		Models: {}, 
		Views: {},
		Collections: {}, 
		Router: {}
	};

	window.template = function ( id ) {
		return _.template( $('#' + id).html() );
	};

	App.Models.Car = Backbone.Model.extend({
		defaults: {
			title: "",
			price: 0,
			mileage: 0,
			transmission: "",
			noOfPics: 0,
			imageUrl: "",
			selected: false,
			dealer: "", 
			visible: true
		},

		validate: function (attrs, opts) {
			if ( !attrs.title ) {
				errorFn("Title shouldn't be empty");
				return "Title shouldn't be empty";
			}
			if ( attrs.transmission !== "Manual" && attrs.transmission !== "Automatic" ){
				errorFn("Non-valid transmission value");
				return "Non-valid transmission value";
			}
			if(!attrs.mileage ||  attrs.mileage < 0) {
				errorFn("Mileage not valid");
				return "Mileage not valid";
			}
		}
	});

	App.Views.ListCarItem = Backbone.View.extend({ // Different views by changing template
		templateShow: template('listCarItemView'), 
		templateEdit: template('listCarItemEdit'),

		initialize: function () {
			this.render( this.templateShow );
		}, 

		render: function (template) {
			this.$el.html( template( this.model.toJSON() ) );
			return this;
		},

		events: {
			'click :button.btn-moreInfo': 'moreInfo',
			'click :button.btn-edit': 'edit',
			'click :checkbox': 'clickedCheck', 
			'click :button.btn-cancel': 'cancel',
			'click :button.btn-save': 'save'
		}, 

		edit: function (){
			this.render( this.templateEdit );
		},

		cancel: function () {
			this.render( this.templateShow );
		}, 

		save: function (e) {
			var newObj = {};

			newObj.title = this.getValue("inputTitle", e);
			newObj.price = this.getValue("inputPrice", e); 
			newObj.mileage = this.getValue("inputMileage", e); 
			newObj.transmission = this.getValue("inputTransmission", e);

			this.model.set(newObj, { validate: true });
			this.render( this.templateShow );
		},
		moreInfo: function() {
			routes.navigate('details/'+this.model.get('id'), {trigger: true});
		},

		getValue: function ( field, e ) { // dep: #listCarItemEdit template in index.html
			return $(e.currentTarget.parentElement.parentElement).
				find('.carDiv').find( '.' + field )[0].value; // <- not so smart...
		}
	});

 	App.Views.ListCarDealerItemView = App.Views.ListCarItem.extend({ // Different views by extending
        initialize: function (options){
            App.Views.ListCarItem.prototype.initialize.call(this, options);
        },

        events: function() {
            return _.extend({}, App.Views.ListCarItem.prototype.events, {
                'click .title': 'alertDealer'
            });
        },

		alertDealer: function () {
			alert("Dealer: " + this.model.get('dealer'));
		},

		render: function ( template ) {
			this.$el.html( template( this.model.toJSON() ) ).find('article').addClass('dealer');
            return this;
		}
	});
	
	App.Collections.Cars = Backbone.Collection.extend({
		model: App.Models.Car,
	});

	App.Views.CarsView = Backbone.View.extend({
		el: $('#listOfCars'),

		initialize: function (){
			debug("[ called: App.Views.CarsView() ]");
		},

		render: function (){
			this.$el.empty();
			this.collection.each(this.addOne ,this);
			return this;
		},

		addOne: function (car) {
			if ( !car.get('visible') ) return;
            var carView;
			if ( car.get('dealer') ){
				carView = new App.Views.ListCarDealerItemView( { model: car } );
			}else {
				carView = new App.Views.ListCarItem({ model: car });
			}
			this.$el.append( carView.el );
			return this;
		}, 

		hide: function () {
			this.$el.empty();
		}
	});

	App.Views.DetailedCarView = Backbone.View.extend({
		el: $('#listOfCars'), 
		initialize: function() {
			this.template = template( 'detailedCarViewTemplate' );
		}, 
		render: function(id) {
			this.$el.empty();
			var model = this.collection.get( {id: id} );
			var data = {
				title: model.get('title'),
				price: model.get('price'),
				mileage: model.get('mileage'), 
				transmission: model.get('transmission'),
				phone: model.get('phone'),
				imageUrl: model.get('imageUrl')
			};
			this.$el.html( this.template(data) );
		}
	});

	var carsCollection = new App.Collections.Cars( CarData );
 	var allCarsView = new App.Views.CarsView({ collection: carsCollection });
 	var detailsPage = new App.Views.DetailedCarView({ collection: carsCollection });

	App.Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'details/:id': 'showDetailPage',
			'*other': 'unknownRoute' // handle unknown router
			// (probably it should go to index)
		}, 

		index: function () {
			allCarsView.render();
		}, 

		unknownRoute: function (url){
			alert("Unknown URL: " + url);
		}, 
		showDetailPage: function(id) {
			detailsPage.render(id);
		} 
	});

	var routes = new App.Router; 
	Backbone.history.start(); // Start monitoring hash changes 

}());
