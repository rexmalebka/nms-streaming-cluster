const NodeMediaServer = require('node-media-server');
const http = require('http')
const port = 80
const host = "0.0.0.0"

const config = {
	logType: 3,

	rtmp: {
		port: 1935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60
	},
	relay: {
	  ffmpeg: `${process.env.ffmpeg_dir}`,
	  tasks: []
	}
};

const nms = new NodeMediaServer(config)
const secondaries = new Set()

const requestListener = (req, res) => {
	let ip = req.connection.remoteAddress
	let url = req.url
	console.debug("IP",ip, url)

	if(url == '/join'){
		secondaries.add(ip)
	}else if(url == '/leave'){
		secondaries.delete(ip)
	}else{
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("ok");
		res.end();
		return
	}

	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("ok");
	res.end();
	
	nms.stop()

	config.relay.tasks = Array.from(secondaries).map( sec => {
		return {
			app: 'live',
		        mode: 'push',
		        edge: `rtmp://${sec}`,
		}
	})

	nms.run()
}

if(process.env.hasOwnProperty('primary')){
	const server = http.createServer(requestListener);

	server.listen(port, host, () => {
		console.log(`Http server is running on http://${host}:${port}`);
	});
	
}
//else{
	nms.on('preConnect', (id, args) => {
		console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
		let session = nms.getSession(id);
		console.debug(session.ip)
		// session.reject();
	});

//}

nms.run()
