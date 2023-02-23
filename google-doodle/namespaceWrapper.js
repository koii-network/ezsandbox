const { default: axios } = require("axios");
const BASE_ROOT_URL = "http://localhost:8080/namespace-wrapper";
const { TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY } = require("./init");
const { Connection, PublicKey, Keypair } = require("@_koi/web3.js");

class NamespaceWrapper {
  connection;
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   */
  async storeGet(key) {
    return await genericHandler("storeGet", key);
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   */
  async storeSet(key, value) {
    return await genericHandler("storeSet", key, value);
  }
  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   */
  async fs(method, path, ...args) {
    return await genericHandler("fs", method, path, ...args);
  }
  async fsStaking(method, path, ...args) {
    return await genericHandler("fsStaking", method, path, ...args);
  }
  async fsWriteStream(imagepath) {
    return await genericHandler("fsWriteStream", imagepath);
  }
  async fsReadStream(imagepath) {
    return await genericHandler("fsReadStream", imagepath);
  }

  async getSlot() {
    return await genericHandler("getCurrentSlot");
  }

  async submissionOnChain(submitterKeypair, submission) {
    return await genericHandler(
      "submissionOnChain",
      submitterKeypair,
      submission
    );
  }

  async stakeOnChain(
    taskStateInfoPublicKey,
    stakingAccKeypair,
    stakePotAccount,
    stakeAmount
  ) {
    return await genericHandler(
      "stakeOnChain",
      taskStateInfoPublicKey,
      stakingAccKeypair,
      stakePotAccount,
      stakeAmount
    );
  }
  async claimReward(stakePotAccount, beneficiaryAccount, claimerKeypair) {
    return await genericHandler(
      "claimReward",
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair
    );
  }
  async sendTransaction(serviceNodeAccount, beneficiaryAccount, amount) {
    return await genericHandler(
      "sendTransaction",
      serviceNodeAccount,
      beneficiaryAccount,
      amount
    );
  }

  async getSubmitterAccount() {
    const submitterAccountResp = await genericHandler("getSubmitterAccount");
    return Keypair.fromSecretKey(
      Uint8Array.from(Object.values(submitterAccountResp._keypair.secretKey))
    );
  }

  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(transaction, signers) {
    if (!this.connection) {
      const rpcUrl = await namespaceWrapper.getRpcUrl();
      console.log(rpcUrl, "RPC URL");
      this.connection = new Connection(rpcUrl, "confirmed");
    }
    const blockhash = (await connection.getRecentBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(MAIN_ACCOUNT_PUBKEY);
    return await genericHandler(
      "sendAndConfirmTransactionWrapper",
      transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }),
      signers
    );
  }

  async signArweave(transaction) {
    let tx = await genericHandler("signArweave", transaction.toJSON());
    return arweave.transactions.fromRaw(tx);
  }
  async signEth(transaction) {
    return await genericHandler("signEth", transaction);
  }
  async getTaskState() {
    return await genericHandler("getTaskState");
  }

  async auditSubmission(candidatePubkey, isValid, voterKeypair, round) {
    return await genericHandler(
      "auditSubmission",
      candidatePubkey,
      isValid,
      voterKeypair,
      round
    );
  }

  async distributionListAuditSubmission(
    candidatePubkey,
    isValid,
    voterKeypair,
    round
  ) {
    return await genericHandler(
      "distributionListAuditSubmission",
      candidatePubkey,
      isValid,
      round
    );
  }

  async getRound() {
    return await genericHandler("getRound");
  }

  async nodeSelectionDistributionList() {
    return await genericHandler("nodeSelectionDistributionList");
  }

  async payoutTrigger() {
    return await genericHandler("payloadTrigger");
  }

  async uploadDistributionList(distributionList, round) {
    return await genericHandler(
      "uploadDistributionList",
      distributionList,
      round
    );
  }

  async distributionListSubmissionOnChain(round) {
    return await genericHandler("distributionListSubmissionOnChain", round);
  }

  async payloadTrigger() {
    return await genericHandler("payloadTrigger");
  }

  async checkSubmissionAndUpdateRound(submissionValue = "default", round) {
    return await genericHandler(
      "checkSubmissionAndUpdateRound",
      submissionValue,
      round
    );
  }
  async getProgramAccounts() {
    return await genericHandler("getProgramAccounts");
  }
  async defaultTaskSetup() {
    return await genericHandler("defaultTaskSetup");
  }
  async getRpcUrl() {
    return await genericHandler("getRpcUrl");
  }
  async getNodes(url) {
    return await genericHandler("getNodes", url);
  }

  // Wrapper for selection of node to prepare a distribution list

  async nodeSelectionDistributionList(round) {
    return await genericHandler("nodeSelectionDistributionList", round);
  }

  async validateAndVoteOnNodes(validate, round) {
    // await this.checkVoteStatus();
    console.log("******/  IN VOTING /******");
    const taskAccountDataJSON = await this.getTaskState();

    console.log(
      "Fetching the submissions of N - 1 round",
      taskAccountDataJSON.submissions[round]
    );
    const submissions = taskAccountDataJSON.submissions[round];
    if (submissions == null) {
      console.log("No submisssions found in N-1 round");
      return "No submisssions found in N-1 round";
    } else {
      const keys = Object.keys(submissions);
      const values = Object.values(submissions);
      const size = values.length;
      console.log("Submissions from last round: ", keys, values, size);
      let isValid;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();
      for (let i = 0; i < size; i++) {
        let candidatePublicKey = keys[i];
        console.log("FOR CANDIDATE KEY", candidatePublicKey);
        let candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log("YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS");
        } else {
          try {
            console.log(
              "SUBMISSION VALUE TO CHECK",
              values[i].submission_value
            );
            isValid = await validate(values[i].submission_value);
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const submissions_audit_trigger =
                taskAccountDataJSON.submissions_audit_trigger[round];
              console.log("SUBMIT AUDIT TRIGGER", submissions_audit_trigger);
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   submissions_audit_trigger[candidatePublicKey]
              // );
              if (
                submissions_audit_trigger &&
                submissions_audit_trigger[candidatePublicKey]
              ) {
                console.log("VOTING TRUE ON AUDIT");
                const response = await this.auditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round
                );
                console.log("RESPONSE FROM AUDIT FUNCTION", response);
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log("RAISING AUDIT / VOTING FALSE");
              const response = await this.auditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round
              );
              console.log("RESPONSE FROM AUDIT FUNCTION", response);
            }
          } catch (err) {
            console.log("ERROR IN ELSE CONDITION", err);
          }
        }
      }
    }
  }

  async validateAndVoteOnDistributionList(validateDistribution, round) {
    // await this.checkVoteStatus();
    console.log("******/  IN VOTING OF DISTRIBUTION LIST /******");
    const taskAccountDataJSON = await this.getTaskState();
    console.log(
      "Fetching the Distribution submissions of N - 2 round",
      taskAccountDataJSON.distribution_rewards_submission[round]
    );
    const submissions =
      taskAccountDataJSON.distribution_rewards_submission[round];
    if (submissions == null) {
      console.log("No submisssions found in N-2 round");
      return "No submisssions found in N-2 round";
    } else {
      const keys = Object.keys(submissions);
      const values = Object.values(submissions);
      const size = values.length;
      console.log(
        "Distribution Submissions from last round: ",
        keys,
        values,
        size
      );
      let isValid;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();

      for (let i = 0; i < size; i++) {
        let candidatePublicKey = keys[i];
        console.log("FOR CANDIDATE KEY", candidatePublicKey);
        let candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log("YOU CANNOT VOTE ON YOUR OWN DISTRIBUTION SUBMISSIONS");
        } else {
          try {
            console.log(
              "DISTRIBUTION SUBMISSION VALUE TO CHECK",
              values[i].submission_value
            );
            isValid = await validateDistribution(values[i].submission_value);
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const distributions_audit_trigger =
                taskAccountDataJSON.distributions_audit_trigger[round];
              console.log(
                "SUBMIT DISTRIBUTION AUDIT TRIGGER",
                distributions_audit_trigger
              );
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   distributions_audit_trigger[candidatePublicKey]
              // );
              if (
                distributions_audit_trigger &&
                distributions_audit_trigger[candidatePublicKey]
              ) {
                console.log("VOTING TRUE ON DISTRIBUTION AUDIT");
                const response = await this.distributionListAuditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round
                );
                console.log(
                  "RESPONSE FROM DISTRIBUTION AUDIT FUNCTION",
                  response
                );
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log("RAISING AUDIT / VOTING FALSE ON DISTRIBUTION");
              const response = await this.distributionListAuditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round
              );
              console.log(
                "RESPONSE FROM DISTRIBUTION AUDIT FUNCTION",
                response
              );
            }
          } catch (err) {
            console.log("ERROR IN ELSE CONDITION FOR DISTRIBUTION", err);
          }
        }
      }
    }
  }
}

async function genericHandler(...args) {
  try {
    let response = await axios.post(BASE_ROOT_URL, {
      args,
      taskId: TASK_ID,
      secret: SECRET_KEY,
    });
    if (response.status == 200) return response.data.response;
    else {
      console.error(response.status, response.data);
      return null;
    }
  } catch (err) {
    console.log("Error in genericHandler", err);
    console.error(err.message);
    console.error(err?.response?.data);
    return null;
  }
}
// let connection;
const namespaceWrapper = new NamespaceWrapper();

module.exports = {
  namespaceWrapper,
};
