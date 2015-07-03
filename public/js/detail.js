$(function() {
	$(".comment").click(function(e) {

		var cid = $(this).data("cid");
		var tid = $(this).data("tid");

		if ($("#commentTid").size() > 0) {
			$("#commentTid").val(tid);
		} else {
			$("<input>").attr({
				name: "comment[tid]",
				type: "hidden",
				value: tid,
				id: "commentTid",

			}).appendTo("#commentForm");
		}


		if ($("#commentCid").size() > 0) {
			$("#commentTid").val(cid);
		} else {
			$("<input>").attr({
				name: "comment[cid]",
				type: "hidden",
				value: cid,
				id: "commentCid",

			}).appendTo("#commentForm");
		}


	})
})