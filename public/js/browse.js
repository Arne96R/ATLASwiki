$( document ).ready(function () {
	$( ".caty" ).click(function () {
		if ($("#"+this.id+"Art").is(':empty')){
			var articleTitles = $.ajax({
				url: "/browse/reqArticleTitles",
				type: "GET",
				data: {
					category: this.id
				} 
			}).then(function (articleTitles) {
				category = articleTitles.splice(0,1);
				articleTitles.forEach(function (articleTitle) {
					$( "#"+category[0]+"Art").append('<li class="'+ category[0] +'" id="' + articleTitle + '"><a>' + articleTitle + "<a></li>");
				});
				return category[0];
			}).then(function (category) {
				$( "."+category).click(function () {
					var title = this.id;
					$.ajax({
						url: "/browse/article/content",
						type: "GET",
						data: {
							title: title,
							category: category
						}
					}).then(function (articles) {
						articleTitle=articles[0].title;
						articleText=articles[0].text;
						articleAuthor=articles[0].author;
						$(".content").html('<h1>'+articleTitle+'</h1><br/><br/>'+articleText+'<br/><br/><p><i><small> Written by: '+articleAuthor+'</i></small></p><br/><br/><br/><br/><a href="/browse">Back to Explorer</a>');
					});
				});
			});	
		} else {
			$("#"+this.id+"Art").empty();
		}
	});
});

