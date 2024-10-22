import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { encrypt, getRandomShiftNum } from "./cipher.js";

export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
    const originalMsg = "Koii rocks!";
    const randomShift = getRandomShiftNum();
    const encryptedMsg = encrypt(originalMsg, randomShift);
    const value = `{"shift": ${randomShift}, "message": "${encryptedMsg}"}`;
    await namespaceWrapper.storeSet("value", value);
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}
