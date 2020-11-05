# RTMP streaming helm chart

Helm chart implementation of streaming server  

## implementation

```helm install -f cluster/values.yaml streaming-server cluster```

this implements two load balancers we stream to input load balancer `streaming-server-inp-lb` and receives from `streaming-server-out-lb`.
