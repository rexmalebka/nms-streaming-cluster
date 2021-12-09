const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};
var nms = new NodeMediaServer(config)
nms.run();

nms.on('prePublish', (id, sp,args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} sp=${JSON.stringify(sp)} args=${JSON.stringify(args)}`);
	if(args.pass != "miau"){
	let session = nms.getSession(id);
	session.reject();

	}
});


