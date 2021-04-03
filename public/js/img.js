	var image = document.getElementById("img");
	var choose= document.getElementById("file");

	choose.addEventListener("change", function(){
		var file= this.files[0];

		if(file){
			var reader = new FileReader();

			reader.addEventListener("load", function(){
				image.src=this.result;
				clickimg.src=image.src;
			})
			reader.readAsDataURL(file)}

			else{
			image.src=null;
			clickimg.src=null;};
			});


