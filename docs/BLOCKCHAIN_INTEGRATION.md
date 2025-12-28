# Blockchain Integration Guide

Complete guide to blockchain features in DeployHub, including wallet connection, deployment recording, and verification.

## Overview

DeployHub integrates blockchain technology to provide:
- **Immutable deployment records** - Permanent, tamper-proof deployment history
- **Cryptographic verification** - Prove authenticity of deployments
- **Transparent audit trails** - Public verification of deployment history
- **Decentralized trust** - No central authority needed for verification

## Technologies Used

- **ethers.js v6** - Ethereum wallet and blockchain interaction
- **MetaMask** - Web3 wallet provider
- **Ethereum** - Default blockchain network (also supports Polygon, etc.)

---

## Wallet Connection

### MetaMask Integration

Users must connect a MetaMask wallet to use blockchain features.

**Component**: `components/blockchain/WalletConnect.vue`

**Usage**:
```vue
<template>
  <WalletConnect />
</template>
```

**Composable**:
```typescript
const { 
  account,        // Connected wallet address
  chainId,        // Current network chain ID
  isConnected,    // Connection status
  connectWallet,  // Connect function
  disconnectWallet 
} = useBlockchain()

// Connect wallet
const connected = await connectWallet()
if (connected) {
  console.log('Connected:', account.value)
  console.log('Network:', chainId.value)
}
```

### Supported Networks

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Ethereum Mainnet | 1 | etherscan.io |
| Goerli Testnet | 5 | goerli.etherscan.io |
| Sepolia Testnet | 11155111 | sepolia.etherscan.io |
| Polygon Mainnet | 137 | polygonscan.com |
| Mumbai Testnet | 80001 | mumbai.polygonscan.com |

---

## Recording Deployments

### Process Flow

1. User connects MetaMask wallet
2. Deployment completes successfully
3. System creates a hash of deployment data
4. Transaction is recorded on blockchain
5. Transaction hash is stored in database
6. User can view and verify the record

### Implementation

**Component**: `components/blockchain/DeploymentVerification.vue`

```vue
<template>
  <DeploymentVerification 
    :projectId="project.id"
    :deploymentId="deployment.id"
    :deployment="deployment"
  />
</template>
```

**Composable Usage**:
```typescript
const { recordDeployment } = useBlockchain()

// Create data hash
const dataString = `${deployment.id}${deployment.commitHash}${deployment.status}`
const dataHash = `0x${Buffer.from(dataString).toString('hex')}`

// Record on blockchain
const record = await recordDeployment(
  projectId,
  deploymentId,
  dataHash
)

if (record) {
  console.log('Transaction Hash:', record.txHash)
  console.log('Block Number:', record.blockNumber)
}
```

### API Endpoint

**POST** `/api/blockchain/record-deployment`

```json
{
  "projectId": "project-id",
  "deploymentId": "deployment-id",
  "dataHash": "0xabc123...",
  "walletAddress": "0x..."
}
```

---

## Verification

### Verify Transaction

Check if a deployment transaction is valid and confirmed.

```typescript
const { verifyDeployment } = useBlockchain()

const result = await verifyDeployment(txHash)
if (result.verified) {
  console.log('Deployment is verified!')
  console.log('Record:', result.record)
}
```

**API**: `GET /api/blockchain/verify/:txHash`

### View Chain Records

**Component**: `components/blockchain/ChainRecords.vue`

```vue
<template>
  <ChainRecords :projectId="project.id" />
</template>
```

**Composable**:
```typescript
const { getProjectRecords } = useBlockchain()

const records = await getProjectRecords(projectId)
// Returns array of ChainRecord objects
```

---

## Data Structures

### ChainRecord Model

```typescript
interface ChainRecord {
  id: string
  projectId: string
  deploymentId?: string
  txHash: string              // Blockchain transaction hash
  blockNumber?: bigint        // Block number where recorded
  network: string             // ethereum, polygon, etc.
  dataHash: string            // Hash of deployment data
  verified: boolean           // Verification status
  created_at: string
}
```

### Database Schema

```prisma
model ChainRecord {
  id           String      @id @default(cuid())
  projectId    String      @map("project_id")
  project      Project     @relation(fields: [projectId], references: [id])
  deploymentId String?     @map("deployment_id")
  deployment   Deployment? @relation(fields: [deploymentId], references: [id])
  txHash       String      @unique @map("tx_hash")
  blockNumber  BigInt?     @map("block_number")
  network      String      @default("ethereum")
  dataHash     String      @map("data_hash")
  verified     Boolean     @default(false)
  createdAt    DateTime    @default(now()) @map("created_at")
}
```

---

## Smart Contract (Future)

Currently, the system simulates blockchain recording. In production, you would:

1. Deploy a smart contract for recording deployments
2. Update `useBlockchain.ts` to interact with the contract
3. Store actual transaction receipts

**Example Contract Structure**:
```solidity
contract DeploymentRegistry {
    struct Deployment {
        string projectId;
        string deploymentId;
        bytes32 dataHash;
        uint256 timestamp;
        address recorder;
    }
    
    mapping(bytes32 => Deployment) public deployments;
    
    event DeploymentRecorded(
        bytes32 indexed txHash,
        string projectId,
        string deploymentId
    );
    
    function recordDeployment(
        string memory projectId,
        string memory deploymentId,
        bytes32 dataHash
    ) public returns (bytes32) {
        // Implementation
    }
}
```

---

## Security Considerations

### Data Privacy

- Only deployment metadata is recorded on-chain
- Source code and secrets are NEVER stored on blockchain
- Only hashes are recorded, not actual data

### Wallet Security

- Users maintain control of their private keys
- MetaMask handles all signing operations
- Application never has access to private keys

### Transaction Costs

- Recording on-chain requires gas fees
- Users pay gas fees from their wallet
- Estimated cost: ~$0.50 - $5.00 depending on network

### Best Practices

1. **Use testnets** for development and testing
2. **Inform users** about gas costs before transactions
3. **Validate data** before recording on-chain
4. **Handle failures** gracefully (transaction rejected, insufficient funds)
5. **Store transaction hashes** in database for reference

---

## Error Handling

### Common Errors

**MetaMask Not Installed**:
```typescript
if (!window.ethereum) {
  error.value = 'MetaMask is not installed'
}
```

**User Rejected Transaction**:
```typescript
try {
  await recordDeployment(...)
} catch (e) {
  if (e.code === 4001) {
    // User denied transaction
  }
}
```

**Insufficient Funds**:
```typescript
if (e.code === 'INSUFFICIENT_FUNDS') {
  error.value = 'Insufficient funds for gas'
}
```

**Wrong Network**:
```typescript
if (chainId.value !== 1) {
  error.value = 'Please switch to Ethereum Mainnet'
}
```

---

## Testing

### Test Networks

Use Goerli or Sepolia testnet for testing:
1. Get test ETH from faucet
2. Switch MetaMask to testnet
3. Test recording and verification

### Test Accounts

Create test wallets in MetaMask for development.

---

## Future Enhancements

1. **Multi-chain support** - Record on multiple blockchains
2. **NFT certificates** - Mint NFTs for verified deployments
3. **IPFS integration** - Store deployment artifacts on IPFS
4. **DAO governance** - Community verification of deployments
5. **Token rewards** - Incentivize deployment verification

---

## Resources

- [ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Ethereum.org](https://ethereum.org/en/developers/)
- [Blockchain Explorer](https://etherscan.io/)

---

For composable reference, see [COMPOSABLES_HOOKS.md](./COMPOSABLES_HOOKS.md)
