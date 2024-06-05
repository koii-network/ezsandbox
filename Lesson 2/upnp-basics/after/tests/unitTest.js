const { coreLogic } = require('../coreLogic');
const task = require('../task');
const index = require('../index');

async function test_coreLogic() {
  const round = 1;
  await coreLogic.task(round);
  const submission = await coreLogic.submitTask(round);
  console.log('Receive test submission', submission);
  const audit = await task.audit.validateNode(submission, round);
  // let vote = true;
  const _dummyTaskState = {
    stake_list: {
      '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': 20000000000,
      '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': 10000000000,
    },
    bounty_amount_per_round: 1000000000,

    submissions: {
      1: {
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cd',
          slot: 1889700,
          round: 1,
        },
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cc',
          slot: 1890002,
          round: 1,
        },
      },
    },
    submissions_audit_trigger: {
      1: {
        // round number
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          // Data Submitter (send data to K2)
          trigger_by: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH', // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: false, // Submission is invalid(Slashed)
              voter: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ', // Voter
              slot: 1890003,
            },
          ],
        },
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': {
          // Data Submitter (send data to K2)
          trigger_by: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL', // Audit trigger
          slot: 1890002,
          votes: [
            {
              is_valid: true, // Submission is valid
              voter: '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ', // Voter
              slot: 1890003,
            },
          ],
        },
      },
    },
  };
  if (audit == true) {
    console.log('Submission is valid, generating distribution list');
    await coreLogic.submitDistributionList(round);

    await task.distribution.auditDistribution(round);
  } else {
    console.log('Submission is invalid, not generating distribution list');
  }
}

test_coreLogic();
