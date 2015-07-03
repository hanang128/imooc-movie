$(function(){
	$("#inputdbid").blur(function(e){
		var dbid = $(this).val();
		$.ajax({
			url:"http://api.douban.com/v2/movie/subject/"+dbid,
			type:"get",
			dataType:"jsonp",
			success:function(json){
				console.log(json);
				$("#inputTitle").val(json.title);
				$("#inputDirector").val(json.directors[0].name);
				$("#inputCountry").val(json.countries[0]);
				$("#inputPoster").val(json.images.large);
				
				$("#inputYear").val(json.year);
				$("#inputSummary").val(json.summary);
			}
		})
	})
})