import NodeMediaServer  from 'node-media-server';
import { createServer }  from 'http'
const port = 80
const host = "0.0.0.0"

console.debug(NodeMediaServer)
interface task  {
	app: string
	mode: string
	edge: string
	name?: string
}

let tasks: task[ ] = []

if(process.env.hasOwnProperty('primary')){
	if(process.env.hasOwnProperty('relay_url')){
		const relay_url:string = process.env.hasOwnProperty('relay_url') ?  ''+process.env['relay_url'] : "";
		tasks.push({
			app: 'live',
			mode: 'static',
			edge: relay_url,
			name: 'relay'
		})
	}
	if(process.env.hasOwnProperty('push')){
		const plain_push_urls:string = process.env.hasOwnProperty('push') ?  ''+process.env['push'] : "";
		try{
			const push_urls:any = JSON.parse(plain_push_urls)
			tasks.push(...push_urls.map( push => {
				return {
					app: 'live',
					mode: 'push',
					edge: `${push.server.replace(/\/$/, '')}/${push.key}`,
					appendName: push.hasOwnProperty('appendName') ? push.appendName : true
				}
			}))

		}catch{

		}
	}
}else{
	const primary_url:string = process.env.hasOwnProperty('primary_url') ? ''+process.env['primary_url'] : ''
	tasks.push({
		  app: 'live',
		  mode: 'pull',
		  edge: primary_url
	})
}

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
          tasks: tasks
        }
};

console.debug(JSON.stringify(config))
const nms = new NodeMediaServer(config)

nms.on('preConnect', (id, args) => {
	console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
	let session = nms.getSession(id);
	console.debug(session.ip)
});

nms.run()


/*
let config= {
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
	  tasks: [
		  {
			  app: 'live',
			  mode: 'pull',
			  edge:  process.env['primary_url']
		  }
	  ]
	}
}

const nms = new NodeMediaServer(config)
const secondaries = new Set()

const requestListener = function(req:, res){
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

	config.relay.tasks =  Array.from(secondaries).map( sec => {
		return {
			app: 'live',
		        mode: 'push',
		        edge: `rtmp://${sec}`,
		}
	})

	nms.run()
}

config.relay.tasks = []

if(process.env.hasOwnProperty('primary')){
		
	const server = createServer(requestListener);

	server.listen(port, host, () => {
		console.log(`Http server is running on http://${host}:${port}`);
	});
	
}

nms.on('preConnect', (id, args) => {
	console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
	let session = nms.getSession(id);
	console.debug(session.ip)
});

nms.run()
*/
