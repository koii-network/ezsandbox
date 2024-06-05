class getData {
  async getAddressArray() {
    try {
      // get the task state from K2 (the Koii blockchain)
      const taskState = await namespaceWrapper.getTaskState();
      // get the list of available IP addresses from the task state
      const nodeList = taskState.ip_address_list;
      console.log('Node List', nodeList);
      return nodeList;
    } catch (e) {
      console.log('ERROR GETTING TASK STATE', e);
    }
  }

  async getRandomNodeEndpoint(IPAddressArray) {
    const values = Object.values(IPAddressArray);
   //  Choose a random index
    const randomIndex = Math.floor(Math.random() * values.length);
   //  Return the value stored at the random index position
    return values[randomIndex];
  }
}

module.exports = getData;
