const { Connection, PublicKey } = require("@_koi/web3.js");
async function main() {
  const connection = new Connection("https://k2-testnet.koii.live/");
  const accountInfo = await connection.getAccountInfo(
    new PublicKey("8iaGKc2PLx7pVvyLqW378CMTEyC1t5Z2HRsXsgLXg6Kh")
  );
  console.log(JSON.parse(accountInfo.data + ""));
}
main();
