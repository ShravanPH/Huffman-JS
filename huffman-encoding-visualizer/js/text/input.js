function interpret_text(text){
	// Init result
	var paths ={}
	var result = {
		"text": text,
		"bit_string": "",
		"encoded_tree": {},
		"file_output": [],
		"compression_percentage": 0.0,
		"paths":paths
	};
	
	
	// Build data
	var input_data = build_character_nodes(text);
	var encoded_tree = build_tree(input_data);
	
	
	// Set encoded tree
	result.encoded_tree = encoded_tree;
	
	
	// Generate paths
	// var paths = {};

	build_path(encoded_tree, paths);

	// var table = document.getElementsByTagName('table')[0];
	// var row = document.createElement('tr');;
	
	// var charTD = document.createElement('td');
	// var codeTD = document.createElement('td')
	// for (let i = 0; i < text.length; i++) {
	    
	// 	charTD.innerHTML = text.charAt(i)
	//     codeTD.innerHTML = paths[text.charAt(i)];
	//     row.appendChild(charTD);
    // 	row.appendChild(codeTD);
	//     table.appendChild(row);

	// }





	var pad = {"count": 0};
	var byte_array = encode_string(text, paths, pad);
	
	
	// Create bit string
	for(i = 0; i < byte_array.length; i++){
		result.bit_string += byte_array[i].toString(2).paddingLeft("00000000")+" ";
	}
	
	
	// Build file output
	result.file_output = build_file_output(paths, byte_array, pad.count);
	
	
	// Calculate percentage
	result.compression_percentage = (1- ( text.length/result.file_output.length ))*100 ;

	
	// console.log(result)
	// Return
	return result;

}