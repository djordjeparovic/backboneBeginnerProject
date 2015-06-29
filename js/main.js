//### zadatak: napraviti validaciju za unesene podatke, reagovanje na dugmice

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
		Models : {}, 
		Views : {},
		Collections : {}, 
		Router : {}
	};

	window.template = function ( id ) {
		return _.template( $('#' + id).html() );
	};

	App.Models.Car = Backbone.Model.extend({
        //TODO: Add validation to model
		defaults : {
			title : "",
			price : 0,
			mileage : 0,
			transmission : "",
			noOfPics : 0,
			imageUrl : "",
			selected : false,
			dealer : "", 
			visible : true
		}


	});

	App.Views.ListCarItem = Backbone.View.extend({ // Different views by changing template
		templateShow : template('listCarItemView'), 
		templateEdit : template('listCarItemEdit'),

		initialize : function () {
			this.render( this.templateShow );
		}, 

		render : function (template) {
			this.$el.html( template( this.model.toJSON() ) );
			return this;
		},

		events : {
			'click :button.btn-moreInfo' : 'moreInfo',
			'click :button.btn-edit' : 'edit',
			'click :checkbox' : 'clickedCheck', 
			'click :button.btn-cancel' : 'cancel',
			'click :button.btn-save' : 'save'
		}, 

		edit : function (){
			this.render( this.templateEdit );
		},

		cancel : function () {
            //TODO: Add event handler for Cancel button
		}, 

		save : function (e) {
            //TODO: Fix save button handler
			var newObj = {};

			newObj.title = this.getValue("inputTitle", e);
			newObj.price = this.getValue("inputPrice", e); 
			newObj.mileage = this.getValue("inputMileage", e); 
			newObj.transmission = this.getValue("inputTransmission", e);

			this.model.set(newObj);
		} ,

		getValue : function ( field, e ) { // dep : #listCarItemEdit template in index.html
			return $(e.currentTarget.parentElement.parentElement).
				find('.carDiv').find( '.' + field )[0].value; // <- not so smart...
		}
	});

 	App.Views.ListCarDealerItemView = App.Views.ListCarItem.extend({ // Different views by extending
        //TODO: Add extra events for dealer (eg click on title)
        initialize : function (options){
            App.Views.ListCarItem.prototype.initialize.call(this, options);
        },

		render : function ( template ) {
			this.$el.html( template( this.model.toJSON() ) ).find('article').addClass('dealer');
            return this;
		}
	});
	
	App.Collections.Cars = Backbone.Collection.extend({
		model : App.Models.Car
	});

	App.Views.CarsView = Backbone.View.extend({
		el : $('#listOfCars'),

		initialize : function (){
		},

		render : function (){
			this.$el.empty();
			this.collection.each(this.addOne ,this);
			return this;
		},

		addOne: function (car) {
			if ( !car.get('visible') ) return;
            var carView;
			if ( car.get('dealer') ){
				carView = new App.Views.ListCarDealerItemView( { model : car } );
			}else {
				carView = new App.Views.ListCarItem({ model : car });
			}
			this.$el.append( carView.el );
			return this;
		}, 

		hide : function () {
			this.$el.empty();
		}
	});

	var carsCollection = new App.Collections.Cars( CarData );
 	var allCarsView = new App.Views.CarsView({ collection : carsCollection });

	App.Router = Backbone.Router.extend({

        //TODO: Add routes handling
		routes : {

		}
	});

	var routes = new App.Router; 
	Backbone.history.start(); // Start monitoring hash changes 

}());
