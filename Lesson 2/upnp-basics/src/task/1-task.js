import { namespaceWrapper, TASK_ID } from "@_koii/namespace-wrapper";
import axios from "axios";

import { getAddressArray, getRandomNodeEndpoint } from "./upnpUtils.js";

export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
  try {
    // you can optionally return this value to be used in debugging
    // Get a list of the available IP addresses
    const IPAddressArray = await getAddressArray();

    // Get a random node from the list
    const randomNode = await getRandomNodeEndpoint(IPAddressArray);
    console.log("RANDOM NODE", randomNode);

    // Fetch the value from the random node
    const response = await axios.get(`${randomNode}/task/${TASK_ID}/secret`);
    const secret = response.data.secret;
    console.log("SECRET", secret);

    // Store the result in the local database
    await namespaceWrapper.storeSet("secret", secret);
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}
