# Part III. Building Audit and Distribution Mechanisms

The first two sections were conceptually heavy topics, so lets do something more fun and create our own audit and distribution systems!

Prerequisites:

- Understanding of Audit and Distribution Mechanisms
- Basic knowledge of [Caesar Cipher](https://en.wikipedia.org/wiki/Caesar_cipher)

## Caesar Task

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

## Auditing The Caesar Task

Now, if we navigate to the `validateNode()` function in `audit.js`, we'll see that it's left blank for you to fill in! Go ahead and give it a go right now and if you can't figure it out, come back here for the answer.

Hint: Remember the value we prepended at the start of our submission? That might come in handy!

If you're having a little trouble figuring it out, no worries. Here's one possible answer, we'll break it down for you:

```javascript
  async validateNode(submission_value, round) {
    let vote;
    console.log('SUBMISSION VALUE', submission_value, round);
    try {
        const shift = parseInt(submission_value.charAt(0), 10);
        const encryptedMsg = submission_value.slice(1);
        const msg = CaesarCipher.decrypt(encryptedMsg, shift);
        if(msg == 'koii rocks!'){
            vote = true;
        }
        else{
            vote = false;
        }
    } catch (e) {
      console.error(e);
      vote = false;
    }
    return vote;
  }
```

1. We first want to grab the shift value that is prepended before submission. This will help us decrypt the rest of the message!

2. We can then slice off the first character to get our encrypted message

3. With our encrypted message and our shift value, we can simply use the decrypt function from our CaesarCipher class to get our original string back!

4. We compare our result with the answer that we expect, `'koii rocks!'`, and adjust our vote accordingly.

Just like that, we've successfully created our very own audit mechanism for a unique task!

## Adjusting Distribution Mechanisms

For the sake of this task, we've provided the standard 70% slashing distribution but we challenge you to experiment with this! For example, these two exercises:

1. Change the slashing mechanism to only slash 0%, 50%, and 100%
2. Hardcoded reward of 0.25, 0.5, and 1 Koii for every participating node

<br>
<br>

You've reached the end of this lesson which means you're now familiar with audit and distribution mechanisms! The next lesson will discuss security and hardening.

[Click here to start Lesson 5](../README.md)
