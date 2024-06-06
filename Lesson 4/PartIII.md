# Lesson 4: Auditing & Distribution

## Part III. Building Audit and Distribution Mechanisms

The first two sections were conceptually heavy topics, so lets do something more fun and create our own audit and distribution systems!

Prerequisites:

- Understanding of Audit and Distribution Mechanisms
- Basic knowledge of [Caesar Cipher](https://en.wikipedia.org/wiki/Caesar_cipher)

### Caesar Task

If you navigate to the attached task for this lesson, you'll see that it simulates a mini Caesar cipher. For this task, the submission logic is completed for you but it's up to you to _decipher_ the audit logic! Let's take a look at what's going on in the `task()` function from `submissions.js`

```javascript
const originalMsg = "koii rocks!";
const randomShift = CaesarCipher.getRandomShiftNum();
const encryptedMsg = CaesarCipher.encrypt(originalMsg, randomShift);
const value = randomShift + encryptedMsg;
```

1. We're first specifying an original message that will be encrypted and submitted. It looks like you decided with the message, "koii rocks!". We agree!

2. Next, we get a random number from 1-5 to shift our Caesar cipher by. This is specifically done to make your life a little harder! We don't want your audit logic to be as simple as checking if the value equals `"koii rocks!"`, that'd be no fun. But, for simplicity sake, we decided to keep the shift between 1 and 5 letters.

3. We encrypt the message with a standard Caesar cipher using the random number we want to shift by. If you're curious about the code used to do this, feel free to investigate `caesar-cipher/caesar-cipher.js`.

4. We finally store the encrypted message along with the shift number prepended to the start. This is will come in handy when writing our audit logic!

### Auditing The Caesar Task

Now, if we navigate to the `validateNode()` function in `audit.js`, we'll see that it's left blank for you to fill in! Go ahead and give it a go right now and if you can't figure it out, come back here for the answer. Hint: Remember the value we prepended at the start of our submission? That might come in handy!

If you're having a little trouble figuring it out, no worries. Here's a step-by-step guide to one solution:

1. We first want to grab the shift value that is prepended before submission. This will help us decrypt the rest of the message!

2. We can then slice off the first character to get our encrypted message

3. With our encrypted message and our shift value, we can simply use the decrypt function from our CaesarCipher class to get our original string back!

4. We compare our result with the answer that we expect, `'koii rocks!'`, and adjust our vote accordingly.

If you're still having trouble, take a look at our solution in the [`after` folder](./caesar-task/after/task/audit.js#L16).

### Adjusting Distribution Mechanisms

Now let's try changing the distribution rewards. Try to make these three changes:

1. When there are no votes, slash by 50%.
2. When there are more negative than positive votes, slash by 100%.
3. Instead of distributing the bounty equally, give each successful submission 0.25 KOII. Note that rewards are distributed in Roe, with 1,000,000,000 Roe per KOII.

Again, if you run into difficulties, you can see our answer in the [`after` folder](./caesar-task/after/task/distribution.js#L105).

You've reached the end of this lesson which means you're now familiar with audit and distribution mechanisms. The next lesson will discuss security and hardening.

[Click here to start Lesson 5](../README.md)
