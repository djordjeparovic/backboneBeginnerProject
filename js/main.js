'use strict';
(function (){
	var debug = function (v){
		//console.log(v);   
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
			imageUrl: "images/freemont.jpg",
			selected : "", 
			dealer : "", 
			phone : "064 123 1234"
		},
		{
			id: 2,
			title : "Dodge X",
			price : 45000,
			mileage : 34200,
			transmission : "Manual",
			noOfPics : 1,
			imageUrl: "images/dodge.jpg",
			selected : "",
			dealer : "Mishkovic",
			phone : "064 123 1234"
		},
		{
			id: 3,
			title : "Mercedes S",
			price : 30100,
			mileage : 200190,
			transmission : "Manual",
			noOfPics : 2,
			imageUrl: "images/mercedes.jpg",
			selected : "",
			dealer : "",
			phone : "064 123 1234"
		},
		{
			id: 4,
			title : "Golf kec",
			price : 200,
			mileage : 300000,
			transmission : "Manual",
			noOfPics : 1,
			imageUrl: "images/golf.jpg",
			selected : "",
			dealer : "",
			phone : "064 123 1234"
		},
		{
			id: 5,
			title : "BMW i3",
			price : 86000,
			mileage : 20,
			transmission : "Automatic",
			noOfPics : 10,
			imageUrl: "images/bmw.jpg",
			selected : "",
			dealer : "BWM Belgrade",
			phone : "064 123 1234"
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
			price : 0,
			mileage : 0,
			transmission : "",
			noOfPics : 0,
			imageUrl : "",
			selected : false,
			dealer : ""
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
			var elem = template( this.model.toJSON() );
			
			if ( this.model.get('dealer') ){
				var deal = '<p class="dealerName rounded">Dealer: ' + 
				this.model.get('dealer') + '</p>';
				elem = $(elem).prepend(deal);
				elem = $(elem).addClass('dealer');
			}
			this.$el.html( elem );
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
			var carId = $(id.currentTarget.parentElement.parentElement)
			.find('#carDiv').attr('class');
			routes.navigate('details/' + carId, { trigger : true });
		}, 

		clickedCheck : function (e) {
			var parent = e.currentTarget.parentElement.
			parentElement.parentElement;
			var id = parseInt( $(parent).find('#carDiv').attr('class') );
			/* Find selected model in carsCollection and set selected attribute */
			var oCar = carsCollection.get({id : id});
			oCar.get('selected')?oCar.set({ selected : "" }):oCar.
			set({ selected : "checked" });
			// side conclusion : Backbone.Collection takes only references to objects
			miniCompareView.render();
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
			return $(parent).find('#' + id)[0].value; //<- magic bro
		}
	});

	App.Views.DetailedCarView = Backbone.View.extend({
		el : $("#detailedCarView"),

		initialize : function () {
		}, 

		render :function (id) {
			carsCompareView.hide();
			var table = "<table><tbody></tbody></table>";
			var car = carsCollection.get( { id : id } );
			var redovi = "";
			var imageUrl = "";
			if ( car.get('dealer') ) {
				redovi = '<tr><th colspan="2">(Car Dealer) ' + car.get('dealer')
				 + '</th><tr>';
			}
			redovi = redovi + "<tr><td>Model</td><td>" + car.get('title') 
			+ "</td></tr><tr><td>Price</td><td>$" +car.get('price') 
			+ "</td></tr><tr><td>Mileage</td><td>" + car.get('mileage') + 
			"</td></tr><tr><td>Transmission</td><td>" + car.get('transmission') + "<tr><td>Phone</td><td>" 
			+ car.get('phone') + "</td></tr>";
			if ( car.get('imageUrl') ){
				imageUrl = '<img src="' + car.get('imageUrl') + '">';
			}

			table =  $(table).append(redovi);
			this.$el.append( table );
			this.$el.append( imageUrl );
			topPageView.render('details');
			return this;
		}, 

		hide : function () {
			this.$el.empty();
		}
	});
	
	App.Views.GoBackView = Backbone.View.extend({
		el : $('#sortSelector'),

		initialize : function () {
			this.render();
		},

		render : function (opt) {
			var btn = '<input type="button" value="Go Back" class="btn btn-goBack">';
			this.$el.html(btn);
			return this;
		},

		events : {
			'click :button.btn-goBack' : 'goBack'
		}, 

		goBack : function (){
			routes.navigate('', {trigger: true});
		}, 
		hide : function () { 
			this.$el.hide();
		}, 

		show : function () {
			this.$el.show();
		}
	});

	var topPageView = new App.Views.GoBackView;
	
	App.Collections.Cars = Backbone.Collection.extend({
		model : App.Models.Car
	});

	App.Views.CarsView = Backbone.View.extend({
		el : $('#listOfCars'),
		initialize : function (){
			debug("[ called: App.Views.CarsView() ]");
			//this.render(); // render is called in route '' so this render is not necessary
		},

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

	var carsCollection = new App.Collections.Cars( CarData );
 	var allCarsView = new App.Views.CarsView({ collection : carsCollection });

 	var carsDetailedView = new App.Views.DetailedCarView; 

	App.Views.CompareView = Backbone.View.extend({
		el : $('#compareCars'),

		initialize : function () {
			//this.render();
		}, 

		render : function () {
			// collect all neccessary data and put them in array of divs
			var mainDiv = $("<div></div>");
			mainDiv.addClass('mainDiv');
			var firstDiv = '<div class="subDiv"><p>Title</p><p>Price</p>' + 
			'<p>Mileage</p><p>Transmission</p>';
			mainDiv.append( firstDiv );
			var numOfSelectedCars = 0;
			this.collection.each( function( model ){
				if ( model.get('selected') ){
					// make sub-div and put it in main div
					numOfSelectedCars += 1;
					var littleDiv = '<div class="subDiv" ><p>' + model.get('title') + 
					'</p><p>$' + model.get('price') +'</p><p>' + model.get('mileage') + 
					'</p>' + '<p>' + model.get('transmission') + '</p>' + '<img src="' + model.get('imageUrl') + '"></div>';
					mainDiv.append(littleDiv);
				}
			}, this );
			var widthSubDiv = Math.floor(100/ (numOfSelectedCars+1) );
			var attr = '' + widthSubDiv + '%';

			this.$el.append( mainDiv );
			$('.subDiv').css({'width' : attr } );
			return this;
		}, 
		hide : function () {
			this.$el.empty();
		}
	});

	var carsCompareView = new App.Views.CompareView( { collection : carsCollection } );

	App.Router = Backbone.Router.extend({
		routes : {
			'' : 'index', 
			'details/:id' : 'moreInfo',
			'compare' : 'compareCars',
			'*other' : 'unknownRoute' // handle unknown router 
			// (probably it should go to index)
		}, 


		index : function () { 
			carsCompareView.render();
			topPageView.hide();
			allCarsView.render();
			carsCompareView.hide();
		}, 

		moreInfo : function (id) {
			topPageView.show();
			carsDetailedView.render(id);
			allCarsView.hide();
		}, 

		unknownRoute : function (url){
			alert("Unknown URL : " + url);
		}, 

		compareCars : function () {
			carsCompareView.render();
			topPageView.show();
		}
	});

	var routes = new App.Router; 
	Backbone.history.start(); // Start monitoring hash changes 

	App.Views.MiniCompareView = Backbone.View.extend({
		el : $('#miniCompareView'),

		initialize : function () {
		}, 

		render : function () {
			var numOfSelectedCars = 0;
			var divString = "";
			var add = "";
			var butn = '<input type="button" class="btn btn-compare" value="Compare">';
			// find all selected cars
			this.collection.each(function(model){
				if ( model.get('selected') ){
					numOfSelectedCars += 1;
					divString += " [ " + model.get('title') + " ]";
				}
			}, this);

			if ( numOfSelectedCars ){
				if ( numOfSelectedCars > 1){
					add = divString + butn;
				}else {
					add = divString;
				}
				
				this.$el.html( add );
				this.$el.show();
			}else {
				this.$el.hide();
			}
			return this;
		}, 

		events : {
			'click :button.btn-compare' : 'compareFun'
		}, 

		compareFun : function () {
			allCarsView.hide();
			routes.navigate('compare', {trigger : true});
		}
	});

	var miniCompareView = new App.Views.MiniCompareView({ collection : carsCollection });

}());
