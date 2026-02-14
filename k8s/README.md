# Frontend Kubernetes manifests

This folder contains basic Kubernetes manifests for the **Secret Letter frontend**.

## Apply

```sh
kubectl apply -k frontend/k8s
```

## Notes

- Update the image in `deployment.yaml` (`spec.template.spec.containers[0].image`) to point to your registry.
- `BACKEND_URL` in `configmap.yaml` is optional and is only used if your frontend calls `/api/...` and you want the Node `server.mjs` to proxy those calls.
- Ingress host is `secret-letter.local`. Add it to your hosts file or change it to your domain.
