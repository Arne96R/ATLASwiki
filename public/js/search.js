$( document ).ready(function () {
	function search(searchVis) {
		var url=window.location.href;
		var query=url.split('?')[1];
		var params=url.split('&');
		var searchParams;
		params.forEach(function (param) {
			if (param.indexOf('searchParams') > -1) {
				searchParams=param.split('=')[1];
				searchVis(searchParams);
			} else {
				return;
			}
		});	
	}
	
	function searchVis (searchParams) {
		$.ajax({
			url:"/search/results",
			type:"GET",
			data: {
				searchParams: searchParams
			}
		}).then(function (results) {
			console.log(results);
			var resultsOnTitle = results.titles;
			var resultsOnText = results.texts;
			var resultsOnAuthor = results.authors;

			resultsOnTitle.forEach(function (result) {
				$("#titleResults").append('<li class="article" id="'+result.title+"-"+result.category+'"><a>'+result.title+"</a>,<i> written by: "+result.author+"</i></li>");
			});
			resultsOnText.forEach(function (result) {
				$("#textResults").append('<li class="article" id="'+result.title+"-"+result.category+'"><a>'+result.title+"</a>,<i> written by: "+result.author+"</i></li>");
			});
			resultsOnAuthor.forEach(function (result) {
				$("#authorResults").append('<li class="article" id="'+result.title+"-"+result.category+'"><a>'+result.title+"</a>,<i> written by: "+result.author+"</i></li>");
			});
			return;
		}).then(function () {
			$(".article").click(function () {
				//add category to li id and rip m out here then use get req to find it and return it, do same as browse

				title =this.id.split('-')[0];
				category=this.id.split('-')[1];
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
					$(".content").html('<h1>'+articleTitle+'</h1><br/><br/>'+articleText+'<br/><br/><p><i><small> Written by: '+articleAuthor+'</i></small></p><br/><br/><br/><br/><a href="/">Back to Home</a>');
				});
			})
		});
	}

	search(searchVis);
});