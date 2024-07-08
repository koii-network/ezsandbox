const { namespaceWrapper } = require('@_koii/namespace-wrapper');
class GetData {
  async getAddressArray() {
  try {
    // get the task state from K2 (the Koii blockchain)
    const taskState = await namespaceWrapper.getTaskState();
    console.log(taskState)

    // get the list of available IP addresses from the task state
    // nodeList is an object with key-value pairs in the form stakingKey: ipAddress
    const nodeList = taskState.ip_address_list ?? {};

    // return just the IP addresses
    return Object.values(nodeList);
  } catch (e) {
    console.log('ERROR GETTING TASK STATE', e);
  }
  }

  async getRandomNodeEndpoint(IPAddressArray) {
    if (!IPAddressArray || IPAddressArray.length === 0) {
      throw new Error('No IP addresses available');
    }
   //  Choose a random index
    const randomIndex = Math.floor(Math.random() * IPAddressArray.length);
   //  Return the IP address stored at the random index position
    return IPAddressArray[randomIndex];
  }
}

const getData = new GetData();
module.exports = getData;
