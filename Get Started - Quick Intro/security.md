# Security Quick Reference

A message can be signed like so, using `namespaceWrapper.payloadSigning()`:

```javascript
const message = "Hello World!";

// Sign payload
const signedMessage = await namespaceWrapper.payloadSigning(message);
```

The `payloadSigning()` function will take care of accessing the node's private key for the signing.

When you want to send this signature to another node, you'll also need to include the current node's public key. You can get this from `namespaceWrapper.getSubmitterAccount()`:

```javascript
// get current node's keypair
const keypair = await namespaceWrapper.getSubmitterAccount(message);

// get the public key from the keypair
const publicKey = keypair.publicKey;
```

You can then send the signed message and the public key to another node to be verified and decoded. This can be done with `namespaceWrapper.verifySignature()`:

```javascript
// Assuming you've already retrieved the signed message and the public key
const message = namespaceWrapper.verifySignature(signedMessage, publicKey);
```
