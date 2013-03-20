// Google spreadsheet information
var urlStart = 'https://docs.google.com/spreadsheet/pub?';
var urlKey = 'key=0As3JvOeYDO50dGtGTFZKT2Q1S1BJSXkxdGRhZy1QX1E&';
var urloutput = 'single=true&grid=2&output=html';
var public_spreadsheet_url = urlStart + urlKey + urloutput;

// We'll push data from spreadsheet into this array
var newDataSet = [];

// Leaflet map stuff
var map = L.map('map').setView([42, -93.3], 7);
L.tileLayer('http://{s}.tile.cloudmade.com/02ef99510f374abb911e6a0260145820/44094/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

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
	$.each( tabletop.sheets("cleaned_1950_2011_counties").all(), function(i, iowa) {
		var dateData = iowa.date;
		var timeData = iowa.hourtime;
		var fefscaleData = iowa.fefscale;
		var injuriesData = iowa.injuries;
		var fatalitiesData = iowa.fatalities;
		var lossvalData = numberFormat(iowa.lossval);
		var lengthmilesData = iowa.lengthmiles;
		var widthyardsData = numberFormat(iowa.widthyards);
		var countyoneData = iowa.countyone;
		var countytwoData = iowa.countytwo;
		var countythreeData = iowa.countythree;
		var countyfourData = iowa.countyfour;
		var myArray = [dateData, timeData, fefscaleData, injuriesData, fatalitiesData, lossvalData, lengthmilesData, widthyardsData, countyoneData, countytwoData, countythreeData, countyfourData];

		// Info gets pushed to empty array
		newDataSet.push(myArray);
	});
}

// Load it up
$(document).ready( function() {
	Tabletop.init( { key: public_spreadsheet_url,
		callback: showInfo,
		simpleSheet: false,
		debug: true } )
});