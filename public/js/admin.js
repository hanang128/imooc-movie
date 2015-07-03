$(function(){
	$(".del").click(function(e){
		var target = $(e.target);
		var id = target.data("id");
		var tr = $(".item-id-"+id);

		$.ajax({
			url:"/admin/movie/list?id="+id,
			type:"DELETE"
		}).done(function(result){
			console.log(result);
			console.log(result.status===1)
			if(result.status===1){
				console.log(tr)
				if(tr.length>0){
					tr.remove();
				}
				
			}
		})
	})
})