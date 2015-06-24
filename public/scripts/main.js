
// Semi-colon omission is safe so long as the following line doesn't begin with ( or [.
// For my own projects, I choose to omit.

;(function(){

	// I decided to include a rudimentary templating engine.
	var templates = {
		"list-item": "<li class=''><span class='copy'>{{ words }}</span><a href='#' class='delete-btn'>delete</a></li>\n"
	}

	var internal_data = [1,2,3,4]

	// Don't worry, I didn't include jQuery.
	var UI = {
		$input: $('#input')
	,	$add_btn: $('#add')
	,	$json_viewer: $('#json-viewer')
	,	$reload_btn: $('#reload')
	,	$list: $('#list-view')
	}

	UI.$add_btn.addEventListener('click', addToList)
	UI.$reload_btn.addEventListener('click', updateList)

	renderAll()


	function addToList ()
	{
		internal_data.push( UI.$input.value )

		appendHtmlFrag( UI.$list, template('list-item', { words: UI.$input.value }) )
		enableDelete( UI.$list.querySelector('li:last-child a.delete-btn'), internal_data.length-1 )

		UI.$input.value = ''
		UI.$json_viewer.value = JSON.stringify( internal_data )
		UI.$input.focus()
	}


	function removeFromList (i)
	{
		if (! i in internal_data)
			return

		internal_data.splice( i, 1 )
		renderAll()
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
			renderAll()
		}
	}


	function renderAll ()
	{
		if (! Array.isArray( internal_data ))
			return

		var html = ''
		internal_data.map( function (string) {
			html += template( 'list-item', { words: string } )
		})

		UI.$json_viewer.value = JSON.stringify( internal_data )
		UI.$list.innerHTML = html
		
		Array.prototype.map.call( UI.$list.querySelectorAll('li a.delete-btn'), enableDelete )
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


	function appendHtmlFrag (el, html)
	{
		var holder = document.createElement('div')
		holder.innerHTML = html
		el.appendChild( holder.childNodes[0] )
	}


	function enableDelete (el, i) {
		el.addEventListener( 'click', function(ev){ ev.preventDefault(); removeFromList(i) } )
	}

})();
