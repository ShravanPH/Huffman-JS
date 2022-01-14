// Global variables
var timeout_to_show;


// Padding function
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};


// Enable tool tips
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
});

(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
    }
})();


// Handle fullscreen functionality
$(document).ready(function(){
	$("#fullscreen_icon").click(function(e){
		$("#huffman_graph").addClass("fullscreen");
		$("#huffman_input").keyup();
		$("#hide_fullscreen_icon").show();
	});
	
	$("#hide_fullscreen_icon").click(function(e){
		$("#huffman_graph").removeClass("fullscreen");
		$("#huffman_input").keyup();
		$("#hide_fullscreen_icon").hide();
	});
});


// Handle text input
$(document).ready(function(){
	$("#huffman_input").keyup(function(){
		// Get text
		var input = $("#huffman_input").val();
		
		var result 
		var row = document.createElement('tr');;
		// Call the interpret function
		if(input != "")
		{
			   result = interpret_text(input);}
			//    var table = document.getElementsByTagName('table')[0];
			   
			   
			//    var charTD = document.createElement('td');
			//    var codeTD = document.createElement('td')
			//    for (let i = 0; i < result.text.length; i++) {
			//    		var m = new Map()
			// 		if(!m.has(result.text.charAt(i)))
			// 		{
			// 			charTD.innerHTML = result.text.charAt(i)
			// 			codeTD.innerHTML = result.paths[result.text.charAt(i)]
			// 				row.appendChild(charTD);
			// 				row.appendChild(codeTD);
			// 				table.appendChild(row);
							
			// 		}
			// 		else{
			// 			m.set(result.text.charAt(i),result.paths[result.text.charAt(i)])
			// 		}
			//    }

			//    }
			   else
			   {
				   window.location.reload()
			   }
			  
		
			
		// Update GUI
		update_gui_elements(result);
		console.log(result.paths)

		
	});
});


// Handle text file uploads (dragging)
$(document).ready(function(){
	var target = document.getElementById("huffman_input");
	target.addEventListener("dragover", function(e){e.preventDefault();}, true);
	target.addEventListener("drop", function(e){
		e.preventDefault();
		load_file_text(e.dataTransfer.files[0]);
	}, true);
});


// Handle reading the file's contents
function load_file_text(file){
	var reader = new FileReader();
	
	reader.onload = function(e){
		$("#huffman_input").val(e.target.result);
		$("#huffman_input").keyup();
	};
	
	reader.readAsText(file);
}


// Handle file uploads (dragging)
$(document).ready(function(){
	var target = document.getElementById("huffman_bits");
	target.addEventListener("dragover", function(e){e.preventDefault();}, true);
	target.addEventListener("drop", function(e){
		e.preventDefault();
		load_file(e.dataTransfer.files[0]);
	}, true);
});


// Handle file uploads (button to upload)
$(document).ready(function(){
	$("#huffman_upload_input").change(function(e){
		var input = document.getElementById("huffman_upload_input");
		var file = input.files[0];
		load_file(file);
	});
});

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    
}

// Handle reading the file's contents
function load_file(file){
	var reader = new FileReader();
	
	reader.onload = function(e){
		// Get all the bytes from the file
		var byte_array = new Uint8Array(e.target.result.length);
		
		for(i = 0; i < e.target.result.length; i++){
			byte_array[i] = (e.target.result.charCodeAt(i));
		}
		
		
		// Call the interpret function
		var result = interpret_byte_array(byte_array);
		
		
		// Verify
		if(result === false){
			$(".show_error").html("<div class='alert alert-dismissible alert-danger'><button type='button' class='close' data-dismiss='alert'>×</button><strong>Oh snap!</strong> It looks like the file you uploaded is either too large or incorrectly formatted.</div>");
			return;
		}
		
		var obj="Input: "+result.text+" Bit string: "+result.bit_string +"Compression ratio: "+ result.compression_percentage.toPrecision(4) +"% "
		
		download(obj.toString(),"huffman.txt","text/plain")
		// Update GUI
		update_gui_elements(result);
	};
	
	reader.readAsBinaryString(file);

}


// Update the GUI elements with a result object
function update_gui_elements(result){
	// Prepare screen
	$("#huffman_graph-canvaswidget").remove();
	clearTimeout(timeout_to_show);
	
	
	// Hide any error
	$(".show_error").html("");
	
	
	// Handle if undefined
	if(result === undefined)
		result = {};
	
	
	// Update each element
	$("#huffman_input").val(result.text);
	update_huffman_graph(result.encoded_tree);
	update_huffman_bits(result.bit_string);
	update_huffman_download(result.file_output);
	update_huffman_compression(result.compression_percentage);
}


// Draw an encoded tree
function update_huffman_graph(encoded_tree){
	if(encoded_tree !== undefined && encoded_tree.length != 0){
		// Hide initial message
		$("#huffman_graph i").hide();
		
		
		// Visualize
		visualize(encoded_tree, ($("#huffman_graph").hasClass("fullscreen")) ? true : false);
		
		
		// Animate tree building
		$("#huffman_graph-canvaswidget").fadeTo(0, 0);
		timeout_to_show = setTimeout(function(){
			$("#huffman_graph-canvaswidget").fadeTo(0, 1);
		}, 550);
	}
	else{
		// Show initial message
		$("#huffman_graph i").show();
	}
}


// Write the bits to the box
function update_huffman_bits(bit_string){
	if(bit_string !== undefined && bit_string != ""){
		$("#huffman_bits").html(bit_string);
	}
	else{
		$("#huffman_bits").html("<i style=\"font-family:'Lato','Helvetica Neue',Helvetica,Arial,sans-serif\">Type to see bits, or <span>drop encoded file here</span>...</i>");
	}


}


// Update the download button
function update_huffman_download(file_output){
	var blob = new Blob([file_output], {type: "application/octet-stream"});
	var url = window.URL.createObjectURL(blob);
	$("#huffman_download").attr("href", url);
	$("#huffman_download").attr("download", "Encoded String");
}


// Update compression percentage meter
function update_huffman_compression(percentage){
	// Handle undefined
	if(percentage === undefined){
		$("#huffman_compression_bar").css("width", "0%");
		$("#huffman_compression").attr("data-original-title", "0%");
		return;
	}
	
	
	// Format bar
	$("#huffman_compression_bar").css("width", Math.abs(percentage)+"%");
	
	if(percentage < 0){
		$("#huffman_compression_bar").removeClass("progress-bar-danger");
		$("#huffman_compression_bar").addClass("progress-bar-danger");
	}
	else{
		$("#huffman_compression_bar").removeClass("progress-bar-danger");
	}
	
	$("#huffman_compression").attr("data-original-title", Math.round(percentage, 1)+"%");
}