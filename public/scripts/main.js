
// Semi-colon omission is safe so long as the following line doesn't begin with ( or [.
// For my own projects, I choose to omit.

;(function(){

	// I decided to include a rudimentary templating engine.
	var templates = {
		"list-item": "<li class=''>{{ words }}<a href='#' class='delete-btn'>delete</a></li>\n"
	}

	var internal_data = []

	// Don't worry, I didn't include jQuery.
	var UI = {
		$input: $('#input')
	,	$add_btn: $('#add')
	,	$json_viewer: $('#json-viewer')
	,	$reload_btn: $('#reload')
	,	$list: $('#list')
	}

	UI.$add_btn.addEventListener('click', addToList)
	UI.$reload_btn.addEventListener('click', updateList)


	function addToList ()
	{
		internal_data.push( UI.$input.value )
		UI.$input.value = ''
		UI.$input.focus()
		render()
	}


	function removeFromList (i)
	{
		if (! i in internal_data)
			return

		internal_data.splice( i, 1 )
		render()
	}


	function updateList ()
	{
		var valid = false
		var json = null

		try {
			json = JSON.parse( UI.$json_viewer.value )
			valid = true
		} catch (e) {}

		if (! valid || ! Array.isArray(json)) {
			window.alert( 'Invalid input. Reverting to previous state.' )
			UI.$json_viewer.value = JSON.stringify( internal_data )
		}
		else {
			internal_data = json
			render()
		}
	}


	function render ()
	{
		if (! Array.isArray( internal_data ))
			return

		var html = ''
		internal_data.map( function (string) {
			html += template( 'list-item', { words: string } )
		})

		UI.$json_viewer.value = JSON.stringify( internal_data )
		UI.$list.innerHTML = html
		
		toArray( UI.$list.querySelectorAll('li a.delete-btn') ).map( function (el, i) {
			el.addEventListener( 'click', function(){ removeFromList(i) } )
		})
	}


	// Because, what else would we name this thing?
	function $ (sel)
	{
		sel = document.querySelectorAll(sel)
		return sel.length > 1 ? sel : sel[0];
	}


	// I decided to include a rudimentary templating engine.
	function template (temp_name, input_data)
	{
		if (! templates[ temp_name ])
			return

		var result = templates[temp_name]

		result.match( /\{\{.*?\}\}/g ).map( function (match) {
			var attr = match.replace( /(\{\{\s*|\s*\}\})/g, '' )
			result = result.replace( match, input_data.hasOwnProperty( attr ) ? input_data[attr] : '' )
		})

		return result
	}


	function toArray (data)
	{
		return Array.prototype.slice.call( data )
	}

})();
