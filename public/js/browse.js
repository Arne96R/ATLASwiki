$( document ).ready(function () {
	$( "#1" ).click(function () {
		var ppTitles = $.ajax({
			url: "/browse/reqPPtitles"
		}).then(function (ppTitles) {
			ppTitles.forEach(function (ppTitle) {
				$( "#10" ).append('<li class="pp" id="' + ppTitle + '"><a>' + ppTitle + "<a></li>");
			});
		}).then(function () {
			$( ".pp" ).click(function () {
				var article;
				var title = this.id;
				// $.ajax({
				// 	url: "/browse/pp/article",
				// 	type: "GET"
				// }).then(function (res) {
				// 	$( ".content" ).empty();
				// 	$( ".content" ).append(res);
				// 	console.log('request made');				
				// });
				$.ajax({
					url: "/browse/pp/content",
					type: "GET",
					data: {
						title: title
					}
				}).then(function (articles) {
					console.log(articles);
					article=articles[0];
					console.log(typeof article);
					console.log('got articles');
					window.location.href = "./browse/article";
					return article;
				});
			});
		});	
	});
});

