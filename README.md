# jQuery-zipAutofill

zipAutofill is a jQuery plugin that automatically fills City and State and Country fields
based on a Zip Code value.

### Example Usage
	
	<input id="theZip">
	<input id="theCity">
	<input id="theState">
	<input id="theCountry">
	
	<script>
	$('#theZip').zipAutofill({
		cityField: $('#theCity'),
		stateField: $('#theState'),
		countryField: $('#theCountry')
	});
	</script>

### Works with Select Menus

If you have a select menu for the State or Country, this script 
works with them also. It compares the option's value to the zip code data.

### Loading data

By default, it loads only the U.S. zip code list from `data/zips-us.json`. 
Below is a snippet of what the JSON data looks like:

	{
		"99651":["Platinum","AK"],
		"99655":["Quinhagak","AK"],
		"99656":["Red Devil","AK"],
		"99668":["Sleetmute","AK"],
		"99679":["Tuluksak","AK"]
	}

### Options

Below are the options to configure zipAutofill:

* `cityField`: City form field (jQuery object)
* `stateField`: State form field (jQuery object)
* `countryField`: Country form field (jQuery object)
* `countries`: an array of country strings, indicating which data files to load.  
	The files are searched for according to the country string provided. For example, `us` loads the `data/zips-us.json` file.
* `dataFolderPath`: the path of the data folder. Default is `"data/"`.
* `dataFilePrefix`: the prefix of the data files. Default is `"zips-"`
