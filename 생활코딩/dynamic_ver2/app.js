var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, description) {
  return `<!doctype html>
  <html>
  <head>
	<title>WEB</title>
	<meta charset="utf-8">
  </head>
  <body>
	<h1><a href="/">WEB</a></h1>
	${list}
	<h2>${title}</h2>
	<p>
	${description}
	</p>
  </body>
  </html>
`;
}

var app = http.createServer(function(request, response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var title = queryData.id;

	var list = '<ul>';
	fs.readdir('./data/', function (err, filelist) {
		console.log(filelist);
		filelist.forEach(function (data) {
			if (data !== 'welcome')
				list += '<li><a href="/?id=' + data + '">' + data + '</a></li>';
		});
	});
	list += '</ul>';

	if (pathname == '/') {
		if (_url == '/')
			title = 'welcome';

		fs.readFile(`data/${title}`, 'utf8', function(err, description){
			var template = templateHTML(title, list, description);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname == '/creat') {
		fs.readdir('./data/', function (err, filelist) {
			var title = 'WEB - create';
			list = '<ul>';
			fs.readdir('./data/', function (err, filelist) {
				console.log(filelist);
				filelist.forEach(function (data) {
					if (data !== 'welcome')
						list += '<li><a href="/?id=' + data + '">' + data + '</a></li>';
				});
			});
			list += '</ul>';
		});
	} else {
		response.writeHead(404);
		response.end("Not found");
	}

});

app.listen(3000);
