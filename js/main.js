(function (){
	var debug = function (v){
		console.log(v);   
	};
	/* "database" */
	window.CarData = [
		{
			id: 1,
			title : "Ford Freemont",
			price : 2223,
			mileage : 190343,
			transmission : "Automatic",
			noOfPics : 3,
			imageUrl: "google.rs",
			selected : false
		},
		{
			id: 2,
			title : "Dodge New",
			price : 45000,
			mileage : 34200,
			transmission : "Manual",
			noOfPics : 1,
			imageUrl: "google.rs",
			selected : false
		},
		{
			id: 3,
			title : "Mercedes S",
			price : 30100,
			mileage : 200190,
			transmission : "Manual",
			noOfPics : 2,
			imageUrl: "google.rs",
			selected : false
		},
		{
			id: 4,
			title : "Golf kec",
			price : 200,
			mileage : 300000,
			transmission : "Manual",
			noOfPics : 1,
			imageUrl: "google.rs",
			selected : false
		},
		{
			id: 5,
			title : "BMW i3",
			price : 86000,
			mileage : 20,
			transmission : "Automatic",
			noOfPics : 10,
			imageUrl: "google.rs",
			selected : false
		}
	];

	window.App = {
		Models : {}, 
		Views : {},
		Collections : {}, 
		Router : {}
	};

	window.template = function (id) {
		return _.template( $('#' + id).html() );
	};

	App.Models.Car = Backbone.Model.extend({
		defaults : {
			title : "",
			price : "",
			mileage : "",
			transmission : "",
			noOfPics : "",
			imageUrl: ""
			// dealer : ""  for extending views (unimplemented)
		},

		validate : function (attrs, opts) {
			debug("[ called : App.Models.Car.validate() ]");
			if ( !attrs.title ) {
				return "Title shouldn't be empty";
			}
		}
		
	});

	App.Views.ListCarItem = Backbone.View.extend({

		templateShow : template('listCarItemView'), 
		templateEdit : template('listCarItemEdit'), 

		initialize : function () { 
			debug("[ called : App.Views.ListCarItem.intialize() ]");
			this.render(this.templateShow);
		},

		render : function (template) {
			debug("[ called : App.Views.listCarItem.render() ]");
			this.$el.empty();
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

		moreInfo : function (id) {
			var carId = $(id.currentTarget.parentElement.parentElement).find('#carDiv').attr('class');
			routes.navigate('details/' + carId, { trigger : true });
			// #TODO
		}, 

		clickedCheck : function (e) {
			var parent = e.currentTarget.parentElement.parentElement.parentElement;
			var id = parseInt( $(parent).find('#carDiv').attr('class') );
			/* Find selected model in carsCollection and set selected attribute */
			var oCar = carsCollection.get({id : id});
			oCar.get('selected')?oCar.set({ selected : false }):oCar.set({ selected : true });
			// side conclusion : Backbone.Collection takes only references to objects
		}, 

		edit : function () {
			this.render( this.templateEdit );
		}, 

		cancel : function () {
			this.render( this.templateShow );
		}, 

		save : function (e) {
			var parent = e.currentTarget.parentElement.parentElement;
			var newObj = {};

			newObj.title = this.getValue("inputTitle", e);
			newObj.price = this.getValue("inputPrice", e); 
			newObj.mileage = this.getValue("inputMileage", e); 
			newObj.transmission = this.getValue("inputTransmission", e);

			this.model.set(newObj, { validate : true });
			this.render( this.templateShow );
		}, 

		getValue : function (id, e) {
			var parent = e.currentTarget.parentElement.parentElement;
			return $(parent).find('#' + id)[0].value;
		}
	});

	App.Views.DetailedCarView = Backbone.View.extend({
		el : $("#detailedCarView"),

		initialize : function () {
		}, 

		render :function (id) {
			// this.$el.empty(); // Nepotrebno, jer se taj metod pozove 
			// unutar $el.html(), $.html() interno poziva $.empty(), 
			// a taj metod detachuje i evente, ne samo html.
			this.$el.append("Details of car: " + id);
			return this;
		}, 

		hide : function () {
			this.$el.empty();
		}
	});
	
	App.Views.TopPageView = Backbone.View.extend({
		el : $('#sortSelector'),

		initialize : function () {
			this.render('');
		},

		render : function (opt) {
			debug("[ called : App.Views.TopPageView.render(" + opt + ") ]");
			//this.$el.empty(); // OVDE JE BUG
			if ( opt === 'details' ){
				var btn = '<input type="button" value="Go Back" class="btn btn-goBack">';
				this.$el.html(btn);
			}else {
				//alert("Sorting isn't immplemented yet");
			}
			return this;
		},

		events : {
			'click :button.btn-goBack' : 'goBack'
		}, 

		goBack : function (){
			routes.navigate('', {trigger : true});
		}, 
		hide : function () { 
			this.$el.empty();
		}

	});
	var topPageView = new App.Views.TopPageView;

	App.Views.MiniCompareView = Backbone.View.extend({
		initialize : function () {

		}, 

		render : function () {

		}
	});
	


	App.Views.ListCompareCarItem = Backbone.View.extend({

		template : template('compareCars'),

		intialize : function () { 
		
		},

		render : function () {
			var table = $('<table></table>'); 
			this.collection.each(this.addOne, this);

			this.$el.html( table );
			return this;
		}, 

		// 	title : "Ford Freemont",
		// 	price : "$12,223",
		// 	mileage : "190,343",
		// 	transmission : "Automatic",
		// 	noOfPics : "3",
		// 	imageUrl: "google.rs",
		// 	selected : "false"
		// },
		// rows : {
		// 	title : "<td>Title</td>",
		// 	price : "<td>"
		// }

		addOne : function (car) {
			if ( car.selected ){

			}
			return this;
		}
	});

	App.Collections.Cars = Backbone.Collection.extend({
		model : App.Models.Car
	});

	App.Views.CarsView = Backbone.View.extend({
		el : $('#listOfCars'),
		initialize : function (){
			debug("[ called: App.Views.CarsView() ]");
			//this.render(); // render is called in route '' so this render is not necessary
		},
/* Need to refactor this part of code */
		render : function (){
			carsDetailedView.hide();
			topPageView.hide();
			this.$el.empty();
			this.collection.each(this.addOne ,this);
			return this;
		},

		addOne: function (car) {
			var carView = new App.Views.ListCarItem({ model : car });
			this.$el.append( carView.el );
			return this;
		}, 
		hide : function () {
			this.$el.empty();
		}
	});
/* End of refactorisation */

 	var carsCollection = new App.Collections.Cars( CarData );
 	var allCarsView = new App.Views.CarsView({ collection : carsCollection });

 	var carsDetailedView = new App.Views.DetailedCarView; 

	App.Router = Backbone.Router.extend({
		routes : {
			'' : 'index', 
			'details/:id' : 'moreInfo',

			'*other' : 'unknownRoute' // handle unknown router (probably go to index)
		}, 


		index : function () { 
			// $('#sortSelector').empty();

			allCarsView.render();
			//$('#listOfCars').append(allCarsView.el);
			//allCarsView.render();
		}, 

		moreInfo : function (id) {
			// $('#sortSelector').empty(); // BUG
			// $('#sortSelector').html(topPageView.el); //BUG
			topPageView.render('details');
			// $('#listOfCars').empty(); 
			carsDetailedView.render(id);
			//$('#detailedCarView').append( carsDetailedView.el );
			// topPageView.render('details');
			allCarsView.hide();
		}, 

		unknownRoute : function (url){
			alert("Unknown URL : " + url);
		}
	});
	var routes = new App.Router; 
	Backbone.history.start(); // Start monitoring hash changes 

	// App.Collections.Compare = Backbone.Collection.extend({
	// 	// collection holds pairs [{id : id}, {id : id}, ... ]
	// 	toggleEl : function (el) {
	// 		if ( ! this.get(el) ) {
	// 			this.add(el);
	// 		} else {
	// 			this.remove(el);
	// 		}
	// 		console.log(this);
	// 	}
	// });
	// var compareCollection = new App.Collections.Compare;

	App.Views.CompareView = Backbone.View.extend({
		tagName : 'div.mainDiv', 

		initialize : function () {
			this.render();
		}, 

		render : function () {
			this.$el.append("trlala");
			// prikupi podatke i napakuj u niz
			// napakuj u div, sa sub divovima 

			return this;
		}
	});
	var carsCompareView = new App.Views.CompareView;

}());


