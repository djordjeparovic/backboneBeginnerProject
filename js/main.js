(function (){
	var debug = function (v){
		console.log(v);   
	};
	/* Imaginarna baza podataka */
	window.CarData = [
	{
			id: "1",
			title : "Ford Freemont",
			price : "$12,223",
			mileage : "190,343",
			transmission : "Automatic",
			noOfPics : "3",
			imageUrl: "google.rs",
			selected : "false"
		},
		{
			id: "2",
			title : "Dodge New",
			price : "$45,000",
			mileage : "34,200",
			transmission : "Manual",
			noOfPics : "1",
			imageUrl: "google.rs",
			selected : "false"
		},
		{
			id: "3",
			title : "Mercedes S",
			price : "$30,100",
			mileage : "200,190",
			transmission : "Manual",
			noOfPics : "2",
			imageUrl: "google.rs",
			selected : "false"
		},
		{
			id: "4",
			title : "Golf kec",
			price : "$200",
			mileage : "300,000",
			transmission : "Manual",
			noOfPics : "1",
			imageUrl: "google.rs",
			selected : "false"
		},
		{
			id: "5",
			title : "BMW i3",
			price : "$86,000",
			mileage : "20",
			transmission : "Automatic",
			noOfPics : "10",
			imageUrl: "google.rs",
			selected : "false"
		}
		// ,
		// {
		// 	title : "",
		// 	price : "",
		// 	mileage : "",
		// 	transmission : "",
		// 	noOfPics : "",
		// 	imageUrl: "",
		//	selected : "false"  // ovaj parametar se koristi kod compare view, 
		//inace moze se i bez njega implementirati resenje sa eventima
		// }
	];

	/* Defining aplication */
	window.App = {
		Models : {}, 
		Views : {},
		Collections : {}
	};

	window.template = function (id) {
		templ = $( '#' + id).html(); // debug
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
			// dealer : ""  ako je prazno - niko, ako ima nesto poseban
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
			//this.render(this.templateEdit);
		},

		render : function (template) {
			debug("[ called : App.Views.listCarItem.render() ]");
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

		moreInfo : function () {
			alert("Unimplemented. moreInfo will trigger new route, where will be possible " +
			"show all relevant information");
		}, 

		clickedCheck : function (e) {
			// #TODO if e in collection remove(e) else push(e)
			alert("Unimplemented. clickedCheck will trigger some operations on new View.");
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

	App.Views.ListCompareCarItem = Backbone.View.extend({
		intialize : function () { 
		
		},

		render : function () {
			this.collection.each(this.addOne, this);
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
		tagName: 'div',
		initialize : function (){
			debug("[ called: App.Views.CarsView() ]");
			this.render();
		},

		render : function (){
			this.collection.each(this.addOne ,this);
			return this;
		},

		addOne: function (car) {
			var carView = new App.Views.ListCarItem({ model : car });
			this.$el.append( carView.el );
			return this;
		}
	});


	App.Collections.Compare = Backbone.Collection.extend({

	});

	App.Views.CompareView = Backbone.View.extend({
		// #TODO
	});


/* Using application */
eV = undefined; //variable exposed to global scope (testing/studying purpose)

var automobili = new App.Collections.Cars( CarData );
debug(automobili);
var automobiliView = new App.Views.CarsView({ collection : automobili });
$('#listOfCars').append(automobiliView.el);
eV = automobiliView;
}());


