# Blockchain Integration Documentation

## Overview
Complete guide to blockchain integration features in the Nova platform, including wallet connection, deployment recording, and on-chain verification.

## Features

### 1. Wallet Connection
- Connect Web3 wallets (MetaMask, WalletConnect, etc.)
- Display wallet address and balance
- Monitor account and chain changes
- Disconnect functionality

### 2. Deployment Recording
- Record deployments to blockchain
- Generate transaction hash
- Store chain records in database
- Link deployments to blockchain transactions

### 3. Verification
- Verify transactions on-chain
- Update verification status
- Display verification badges
- View on block explorer

---

## Architecture

### Components

```
components/blockchain/
├── WalletConnect.vue        # Wallet connection button
├── ChainRecords.vue         # Display chain records
└── DeploymentVerification.vue  # Verify deployments
```

### Composables

```typescript
composables/useBlockchain.ts  # Blockchain logic hook
```

### API Endpoints

```
/api/blockchain/record-deployment  # Record to chain
/api/blockchain/verify/:txHash     # Verify transaction
/api/blockchain/records/:projectId # Get chain records
```

### Database Models

```prisma
model ChainRecord {
  id          String   @id @default(cuid())
  projectId   String
  txHash      String   @unique
  blockNumber Int
  eventType   String
  data        Json
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Deployment {
  chainTxHash String? @unique
  // ... other fields
}
```

---

## Wallet Connection

### Using the WalletConnect Component

```vue
<template>
  <WalletConnect />
</template>
```

### Using the useBlockchain Composable

```typescript
const { 
  connected, 
  walletAddress, 
  balance, 
  connectWallet, 
  disconnectWallet 
} = useBlockchain()

// Connect wallet
await connectWallet()

// Check connection status
if (connected.value) {
  console.log('Wallet:', walletAddress.value)
  console.log('Balance:', balance.value, 'ETH')
}

// Disconnect
disconnectWallet()
```

### Wallet Connection Flow

1. User clicks "Connect Wallet" button
2. MetaMask (or other wallet) prompts for permission
3. User approves connection
4. App receives wallet address
5. App fetches balance and chain ID
6. Connection status updates to connected

### Error Handling

```typescript
try {
  await connectWallet()
} catch (error) {
  if (error.message.includes('MetaMask')) {
    console.error('MetaMask not installed')
  } else if (error.code === 4001) {
    console.error('User rejected connection')
  }
}
```

---

## Recording Deployments to Blockchain

### Using the DeploymentVerification Component

```vue
<template>
  <DeploymentVerification 
    :deployment="currentDeployment" 
    :projectId="projectId" 
  />
</template>
```

### Using the useBlockchain Composable

```typescript
const { recordDeployment } = useBlockchain()

const handleRecord = async () => {
  const deploymentData = {
    deploymentId: deployment.id,
    commitSha: deployment.commitSha,
    commitMessage: deployment.commitMessage,
    status: deployment.status,
    timestamp: deployment.createdAt
  }

  const result = await recordDeployment(projectId, deploymentData)
  
  console.log('Transaction Hash:', result.txHash)
  console.log('Block Number:', result.blockNumber)
}
```

### What Gets Recorded

The following data is recorded on-chain:
- Deployment ID
- Project ID
- Commit SHA
- Commit message
- Deployment status
- Timestamp
- Transaction hash
- Block number

### Recording Flow

1. User clicks "Record to Chain"
2. Check wallet connection
3. Prepare deployment data
4. Send to backend API
5. Backend creates blockchain transaction (simulated)
6. Transaction hash generated
7. Chain record saved to database
8. Update deployment with transaction hash
9. Display success message

---

## Verification

### Using the ChainRecords Component

```vue
<template>
  <ChainRecords :projectId="projectId" />
</template>
```

### Using the useBlockchain Composable

```typescript
const { verifyOnChain } = useBlockchain()

const handleVerify = async (txHash: string) => {
  const result = await verifyOnChain(txHash)
  
  if (result.verified) {
    console.log('Transaction verified!')
  }
}
```

### Verification Process

1. User clicks "Verify" button
2. App sends transaction hash to API
3. API simulates blockchain verification
4. Verification status updated in database
5. UI updates with verification badge

### Displaying Chain Records

```typescript
const { getChainRecords } = useBlockchain()

const loadRecords = async () => {
  const records = await getChainRecords(projectId)
  
  records.forEach(record => {
    console.log('TX Hash:', record.txHash)
    console.log('Block:', record.blockNumber)
    console.log('Verified:', record.verified)
  })
}
```

---

## Frontend Integration

### Page Integration

```vue
<template>
  <div>
    <!-- Wallet Connection -->
    <WalletConnect />

    <!-- Deployment with Verification -->
    <DeploymentVerification 
      v-if="deployment"
      :deployment="deployment"
      :projectId="projectId"
    />

    <!-- Chain Records -->
    <ChainRecords :projectId="projectId" />
  </div>
</template>

<script setup>
const { deployment } = useDeployments()
const projectId = useRoute().params.id
</script>
```

### Blockchain Page

A dedicated blockchain management page at `/blockchain`:
- Wallet connection interface
- Statistics (total records, verified, pending)
- All chain records table
- Verification functionality

---

## Backend Implementation

### Record Deployment API

```typescript
// server/api/blockchain/record-deployment.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { projectId, deploymentData, walletAddress } = body

  // Simulate blockchain transaction
  const txHash = generateTxHash()
  const blockNumber = generateBlockNumber()

  // Store in database
  const chainRecord = await prisma.chainRecord.create({
    data: {
      projectId,
      txHash,
      blockNumber,
      eventType: 'deployment',
      data: deploymentData,
      verified: false
    }
  })

  return {
    success: true,
    txHash,
    blockNumber,
    record: chainRecord
  }
})
```

### Verify Transaction API

```typescript
// server/api/blockchain/verify/[txHash].get.ts
export default defineEventHandler(async (event) => {
  const txHash = getRouterParam(event, 'txHash')

  // Find chain record
  const chainRecord = await prisma.chainRecord.findUnique({
    where: { txHash }
  })

  // Simulate verification
  const verified = true

  // Update database
  await prisma.chainRecord.update({
    where: { txHash },
    data: { verified }
  })

  return {
    success: true,
    verified,
    record: chainRecord
  }
})
```

---

## Security Considerations

### 1. Never Store Private Keys
- Never ask users for private keys
- Never store wallet private keys
- Use wallet providers for signing

### 2. Validate Wallet Addresses
```typescript
const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
```

### 3. Verify Wallet Ownership
- Sign a message to prove ownership
- Verify signature on backend
- Link wallet to user account

### 4. Network Validation
```typescript
const SUPPORTED_CHAINS = [1, 5, 137] // Mainnet, Goerli, Polygon

if (!SUPPORTED_CHAINS.includes(chainId.value)) {
  throw new Error('Unsupported network')
}
```

---

## Real Blockchain Integration

The current implementation uses simulated blockchain transactions. To integrate with a real blockchain:

### 1. Install Dependencies

```bash
npm install ethers web3 @web3-react/core
```

### 2. Create Smart Contract

```solidity
// contracts/DeploymentRegistry.sol
contract DeploymentRegistry {
    struct Deployment {
        string projectId;
        string commitSha;
        string commitMessage;
        uint256 timestamp;
        address deployer;
    }
    
    mapping(bytes32 => Deployment) public deployments;
    
    event DeploymentRecorded(
        bytes32 indexed deploymentHash,
        string projectId,
        address deployer
    );
    
    function recordDeployment(
        string memory projectId,
        string memory commitSha,
        string memory commitMessage
    ) public {
        bytes32 deploymentHash = keccak256(
            abi.encodePacked(projectId, commitSha, block.timestamp)
        );
        
        deployments[deploymentHash] = Deployment({
            projectId: projectId,
            commitSha: commitSha,
            commitMessage: commitMessage,
            timestamp: block.timestamp,
            deployer: msg.sender
        });
        
        emit DeploymentRecorded(deploymentHash, projectId, msg.sender);
    }
}
```

### 3. Update Backend to Use Real Chain

```typescript
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
)

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  provider
)

// Record deployment
const tx = await contract.recordDeployment(
  projectId,
  commitSha,
  commitMessage
)

await tx.wait()
```

### 4. Update Frontend to Sign Transactions

```typescript
const recordDeployment = async (data) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(address, abi, signer)
  
  const tx = await contract.recordDeployment(
    data.projectId,
    data.commitSha,
    data.commitMessage
  )
  
  const receipt = await tx.wait()
  return receipt.transactionHash
}
```

---

## Testing

### Test Wallet Connection

```typescript
describe('Wallet Connection', () => {
  it('should connect wallet', async () => {
    const { connectWallet, connected } = useBlockchain()
    await connectWallet()
    expect(connected.value).toBe(true)
  })
})
```

### Test Recording

```typescript
describe('Record Deployment', () => {
  it('should record deployment to chain', async () => {
    const { recordDeployment } = useBlockchain()
    const result = await recordDeployment('project1', deploymentData)
    expect(result.txHash).toBeDefined()
    expect(result.blockNumber).toBeGreaterThan(0)
  })
})
```

---

## Troubleshooting

### MetaMask Not Detected

```typescript
if (typeof window.ethereum === 'undefined') {
  alert('Please install MetaMask')
  window.open('https://metamask.io/download.html', '_blank')
}
```

### Wrong Network

```typescript
const switchNetwork = async (chainId: number) => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }]
  })
}
```

### Transaction Failed

```typescript
try {
  await recordDeployment(data)
} catch (error) {
  if (error.code === 4001) {
    console.error('User rejected transaction')
  } else {
    console.error('Transaction failed:', error.message)
  }
}
```

---

## Future Enhancements

1. **Multi-chain Support**
   - Ethereum
   - Polygon
   - Binance Smart Chain
   - Arbitrum

2. **NFT Badges**
   - Mint NFT for verified deployments
   - Display NFT in user profile

3. **IPFS Integration**
   - Store deployment metadata on IPFS
   - Reference IPFS hash in blockchain

4. **DAO Governance**
   - Vote on deployment approvals
   - Community verification

5. **Gas Optimization**
   - Batch transactions
   - Layer 2 solutions

---

## Resources

- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
