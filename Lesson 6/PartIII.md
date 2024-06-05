
## Part III. RPC API
In this section of our guide, we'll explore how to use JSON RPC API to interact with KPL Tokens. Specifically, we'll look at finding all token accounts for a specific mint address. This operation is crucial for understanding the distribution and accessibility of a token on the network. In this section, we will give a example, further cases you can reference our [RPC API Docs](https://docs.koii.network/develop/rpcapi/http/). 

### Finding All Token Accounts for a Specific Mint
To retrieve all token accounts associated with a specific mint, we utilize the `getProgramAccounts` RPC method. This method allows us to query multiple accounts that meet specified criteria.

#### Step-by-Step Guide
Here is a straightforward example using curl to send a request to the JSON RPC API:

```bash
Copy code
curl https://testnet.koii.network -X POST -H "Content-Type: application/json" -d '
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getProgramAccounts",
  "params": [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    {
      "encoding": "jsonParsed",
      "filters": [
        {
          "dataSize": 165
        },
        {
          "memcmp": {
            "offset": 0,
            "bytes": "TESTpKgj42ya3st2SQTKiANjTBmncQSCqLAZGcSPLGM"
          }
        }
      ]
    }
  ]
}
'
```
#### Explanation of Parameters:
- method: getProgramAccounts is used to fetch accounts managed by a specific program.
- params:
    - The first parameter is the program ID of the KPL Token program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA).
    - The second parameter specifies the encoding and filters:
    - encoding: jsonParsed provides the account data in a human-readable JSON format.
    - filters:
        - dataSize: 165 indicates the size of a typical KPL Token account.
        - memcmp: Filters accounts where the mint address matches the specified mint.

This command returns all the accounts that are token accounts under the specified mint address, making it easier to analyze the distribution and usage of the token.

#### Usage
Run the above curl command in your terminal to fetch the token accounts. The response will include details about each account, such as the owner, the amount of tokens held, and other relevant metadata.

### Conclusion
Understanding how to interact with the blockchain through RPC calls is essential for developers working with KPL Tokens. This method provides a powerful way to query and manage blockchain data efficiently. 