// Google spreadsheet information
var urlStart = 'https://docs.google.com/spreadsheet/pub?';
var urlKey = 'key=0As3JvOeYDO50dEFxOEpCVms0eHZSR1pqcTVCSDF4Q3c&';
var urloutput = 'single=true&grid=2&output=html';
var public_spreadsheet_url = urlStart + urlKey + urloutput;

// Set up your DataTables column headers.
var tableColumnSet =   [
	{ "sTitle": "Date / Time", "sClass": "center" },
	{ "sTitle": "F / EF Scale", "sClass": "center" },
	{ "sTitle": "Injuries", "sClass": "center" },
	{ "sTitle": "Fatalities", "sClass": "center" },
	{ "sTitle": "Loss ($)", "sClass": "center", "sType": "currency", "sWidth": "125px" },
	{ "sTitle": "Length (Miles)", "sClass": "center" },
	{ "sTitle": "Width (Yards)", "sClass": "center" }
];

// We'll push data from spreadsheet into this array
var newDataSet = [];

// Leaflet map stuff
var map = L.map('map').setView([42, -93.3], 7);
L.tileLayer('http://{s}.tile.cloudmade.com/02ef99510f374abb911e6a0260145820/44094/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

// Used to sort currency in DataTables
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"currency-pre": function ( a ) {
		a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
		return parseFloat( a );
	},
	
	"currency-asc": function ( a, b ) {
		return a - b;
	},
	
	"currency-desc": function ( a, b ) {
		return b - a;
	}
});

// Add commas to numbers
function numberFormat(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1))
	x1 = x1.replace(rgx, '$1' + ',' + '$2');
	return x1 + x2;
}

// Load up Tabletop.JS
function showInfo(data, tabletop) {
	// Access the data from your spreadsheet
	$.each( tabletop.sheets("cleaned_1950_2011_edit").all(), function(i, iowa) {
		var dateData = iowa.datetime;
		var fefscaleData = iowa.fefscale;
		var injuriesData = iowa.injuries;
		var fatalitiesData = iowa.fatalities;
		var lossvalData = numberFormat(iowa.lossval);
		var lengthmilesData = iowa.lengthmiles;
		var widthyardsData = iowa.widthyards;
		var myArray = [dateData, fefscaleData, injuriesData, fatalitiesData, lossvalData, lengthmilesData, widthyardsData]

		// Info gets pushed to empty array
		newDataSet.push(myArray);
	});

	$('#table_div').html( '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="table"></table>' );

	// Push the data to the table
	$('#table').dataTable( {
		"sPaginationType": "bootstrap",
		"iDisplayLength": 10,
		"aaData": newDataSet,
		"aoColumns": tableColumnSet,
		"aaSorting": [[ 0, "desc" ]],
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	});
	$( "#loading" ).html("");
}

// Load it up
$(document).ready( function() {
	Tabletop.init( { key: public_spreadsheet_url,
		callback: showInfo,
		simpleSheet: false,
		debug: true } )
});