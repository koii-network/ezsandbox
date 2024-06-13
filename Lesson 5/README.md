# Lesson 5: Security & Hardening

In this lesson, we are only discussing namespaceWrapper functions, so we don't have a full task. We'll be looking at how to sign and verify messages sent from node to node.

Prerequisites:

- Completion of lessons 1-4

## Using Signatures

To improve security, you might want to verify that the data you're receiving is coming from the source you expect. This can be done by verifying messages with signatures.

A message can be signed like so, using [`namespaceWrapper.payloadSigning()`](./koiiNode.js#L222):

```javascript
const message = "Hello World!";

// Sign payload
const signedMessage = await namespaceWrapper.payloadSigning(message);
```

The `payloadSigning()` function will take care of accessing the node's private key for the signing.

When you want to send this signature to another node, you'll also need to include the current node's public key. You can get this from [`namespaceWrapper.getSubmitterAccount()`](./koiiNode.js#L325):

```javascript
// get current node's keypair
const keypair = await namespaceWrapper.payloadSigning(message);

// get the public key from the keypair
const publicKey = keypair.publicKey;
```

You can then send the signed message and the public key to another node to be verified and decoded. This can be done with [`namespaceWrapper.verifySignature()`](./koiiNode.js#L254):

```javascript
// Assuming you've already retrieved the signed message and the public key
const message = namespaceWrapper.verifySignature(signedMessage, pubKey);
```

Next up, we'll look at using custom tokens in [Lesson 6](../Lesson%206/README.md).
