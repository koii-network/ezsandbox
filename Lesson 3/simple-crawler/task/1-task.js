import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { storeFile } from "./fileUtils.js";
import { crawl } from "./crawler.js";

export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
  try {
    const postTitles = await crawl(process.env.SEARCH_TERM);
    const cid = await storeFile(postTitles);
    await namespaceWrapper.storeSet("cid", cid);
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}
