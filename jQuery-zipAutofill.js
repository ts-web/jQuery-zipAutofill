/*
	zipAutofill jQuery plugin
	
	@description auto-populates state and country form fields based on an entered zip code
	@author Matthias Dailey <matthias.dailey@gmail.com>
	@date 2012-10-16
	@version 1
	
	Usage:
		$('#zipCodeField').zipAutofill({
			cityField: $('#state'),
			stateField: $('#state'),
			countryField: $('#country')
		});
	
	Credits:
		US zip code data from Brett Sauers <bsauers@liberty.edu>
*/

(function($) {
	
	/*
		The zip code data, by country.
		Properties are filled via AJAX.
	*/
	var data = {/*
		"us": {"24502":["Lynchburg","VA"]},
		...
	*/};
	
	var originalValues = {};
	
	var defaults;
	
	/*
		Runs after a successful request for zip code JSON data
	*/
	var saveJSONData = function (country, JSON) {
		var zip;
		
		// create a property in the data object
		data[country] = {};
		
		// go through all the properties of the data object
		for (zip in JSON) {
			// skip inherited properties
			if (!JSON.hasOwnProperty(zip)) continue;
			// add this zip code to the data item for this country
			data[country][zip] = JSON[zip];
		}
	};
	
	/*
		searches through the data to find the zip code. Returns true if found; false otherwise
	*/
	var findZip = function (zip, onSuccess, onFail) {
		
		// the only restriction is the length
		if (zip.length == 0) return;
		
		// search through the data for the zip
		// go through the loaded countries
		for (co in data) {
			if (!data.hasOwnProperty(co)) continue;
			
			// look for the zip code property
			if (data[co][zip]) {
				onSuccess(data[co][zip][0], data[co][zip][1], co);
				return;
			}
		}
		// not found
		onFail();
	}
	
	$.fn.zipAutofill = function(options) {
		
		var countries;
	
		var $cityField, $stateField, $countryField;
		
		var citySync, stateSync, countrySync;
		
		/*
			Sets the values of $cityField, $stateField, $countryField
		*/
		var updateOthers = function(city, state, country) {
			
			// City
			if (citySync) {
				if ($cityField.is('select')) {
					// it's a select menu
					$cityField.find("option").filter(function() {
						return $(this).attr('value').toLowerCase() == city.toLowerCase();
					}).attr('selected', true);
				}
				else {
					// it's a regular form field
					$cityField.val(city);
				}
			}
			
			// State
			if (stateSync) {
				if ($stateField.is('select')) {
					// it's a select menu
					$stateField.find("option").filter(function() {
						return $(this).attr('value').toLowerCase() == state.toLowerCase();
					}).attr('selected', true);
				}
				else {
					// it's a regular form field
					$stateField.val(state);
				}
			}
			
			// Country
			if (countrySync) {
				if ($countryField.is('select')) {
					// it's a select menu
					$countryField.find("option").filter(function() {
						return $(this).attr('value').toLowerCase() == country.toLowerCase();
					}).attr('selected', true);
				}
				else {
					// it's a regular form field
					$countryField.val(country);
				}
			}
		};
		
		/*
			Restores the original or user-modified values of a form field
		*/
		var restoreOriginal = function () {
			// City
			if (originalValues.cityIndex >= 0) {
				// it's a select menu
				$cityField.prop('selectedIndex', originalValues.cityIndex);
			}
			else {
				// it's a regular form field
				$cityField.val(originalValues.city);
			}
			
			// State
			if (originalValues.stateIndex >= 0) {
				// it's a select menu
				$stateField.prop('selectedIndex', originalValues.State);
			}
			else {
				// it's a regular form field
				$stateField.val(originalValues.state);
			}
			// Country
			if (originalValues.countryIndex >= 0) {
				// it's a select menu
				$countryField.prop('selectedIndex', originalValues.countryIndex);
			}
			else {
				// it's a regular form field
				$countryField.val(originalValues.country);
			}
		};
		
		
		/*
			Saves the original or user-modified values of a form field
		*/
		var saveOriginal = function () {
			// if the field is not being synced, save its value
			if (!citySync) {
				originalValues.city = $cityField.val();
				if (!isNaN($cityField.prop('selectedIndex'))) {
					originalValues.cityIndex = $cityField.prop('selectedIndex');
				}
			}
			if (!stateSync) {
				originalValues.state = $stateField.val();
				if (!isNaN($stateField.prop('selectedIndex'))) {
					originalValues.stateIndex = $stateField.prop('selectedIndex');
				}
			}
			if (!countrySync) {
				originalValues.country = $countryField.val();
				if (!isNaN($countryField.prop('selectedIndex'))) {
					originalValues.countryIndex = $countryField.prop('selectedIndex');
				}
			}
		};
		
		// merge the defaults with the options
		options = $.extend(
			{
				country: 'us',
				dataFolderPath: 'data/',
				dataFilePrefix: 'zips-'
			},
			options
		);
		
		countries = [options.country];
		
		// load the data
		// go through each country requested
		for (var i = 0, len = countries.length; i < len; i++) {
			// check if that country is already loaded
			if (data[countries[i]]) {
				// we already have the zip code data for this country
			}
			else {
				// load the zip code data for this country
				$.ajax({
					url: options.dataFolderPath + options.dataFilePrefix + countries[i] + '.json',
					dataType: 'json',
					success: (function () {
						var country = countries[i];
						return function (data) {
							saveJSONData(country, data);
						}
					}())/*,
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(arguments);
					}*/
				});
			}
		}
		
		// save references to the form fields
		$cityField = options.cityField;
		$stateField = options.stateField;
		$countryField = options.countryField;
		
		if ($cityField.val() == "") citySync = true;
		if ($stateField.val() == "") stateSync = true;
		if ($countryField.val() == "") countrySync = true;
		
		// set up change events to break sync
		//     and reset if the value is ""
		$cityField.change(function (event) {
			if (event.target.value == "")
				citySync = true;
			else
				citySync = false;
		});
		$stateField.change(function (event) {
			if (event.target.value == "")
				stateSync = true;
			else
				stateSync = false;
		});
		$countryField.change(function (event) {
			if (event.target.value == "")
				countrySync = true;
			else
				countrySync = false;
		});
		
		// set up events
		this.keydown(function(event) {
			saveOriginal();
		});
		
		this.keyup(function (event) {
			findZip(event.target.value, updateOthers, restoreOriginal)
		});
		
	};
})(jQuery);