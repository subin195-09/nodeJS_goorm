var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, description, control) {
  return `<!doctype html>
  <html>
  <head>
	<title>WEB</title>
	<meta charset="utf-8">
  </head>
  <body>
	<h1><a href="/">WEB</a></h1>
	${list}
	${control}
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
	var contral = _url === '/' ? '<a href="/create">create</a>' : `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`;

	var list = '<ul>';
	fs.readdir('./data/', function (err, filelist) {
		// console.log(filelist);
		filelist.forEach(function (data) {
			if (data !== 'welcome')
				list += '<li><a href="/?id=' + data + '">' + data + '</a></li>';
		});
	});
	list += '</ul>';

	if (pathname === '/') {
		if (_url === '/')
			title = 'welcome';

		fs.readFile(`data/${title}`, 'utf8', function(err, description){
			var template = templateHTML(title, list, description, contral);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname === '/create') {
		var title = 'WEB - create';
		var template = templateHTML(title, list, `
		<form action="/create_process" method="post">
			<p><input type="text" name="title" placeholder="title"></p>
			<p>
				<textarea name="description" placeholder="description"></textarea>
			</p>
			<p>
				<input type="submit">
			</p>
		</form>`, '');
		response.writeHead(200);
		response.end(template);
	} else if (pathname === '/create_process') {
		var body = '';
		request.on('data', function(data){
			body += data;
		});
		request.on('end', function(data){
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;
			fs.writeFile(`data/${title}`, description, 'utf8', function(err){
				response.writeHead(302, {Location: `/?id=${title}`});
				response.end();
			});
		});
	} else if (pathname === '/update') {
		fs.readFile(`data/${title}`, 'utf8', function(err, description){
			var template = templateHTML(title, list, `
			<form action="/update_process" method="post">
				<input type="hidden" name="id" value="${title}">
				<p><input type="text" name="title" placeholder="title" value=${title}></p>
				<p>
					<textarea name="description" placeholder="description">${description}</textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			</form>`, '');
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname === '/update_process') {
		var body = '';
		request.on('data', function(data){
			body += data;
		});
		request.on('end', function(data){
			var post = qs.parse(body);
			var id = post.id;
			var title = post.title;
			var description = post.description;
			fs.rename(`data/${id}`, `data/${title}`, function(err){
				fs.writeFile(`data/${title}`, description, 'utf8', function(err){
					response.writeHead(302, {Location: `/?id=${title}`});
					response.end();
				});
			});
		});
	} else {
		response.writeHead(404);
		response.end("Not found");
	}

});

app.listen(3000);

