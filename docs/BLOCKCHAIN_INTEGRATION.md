# Blockchain Integration Guide

## Overview
DeployHub integrates with Ethereum-compatible blockchains to provide immutable deployment records and verification. This guide covers the complete blockchain integration, including MetaMask connection, recording deployments on-chain, and verification.

---

## Table of Contents
1. [Architecture](#architecture)
2. [MetaMask Connection](#metamask-connection)
3. [Recording Deployments](#recording-deployments)
4. [Verification](#verification)
5. [Smart Contract](#smart-contract)
6. [Complete Examples](#complete-examples)

---

## Architecture

### Components
```
┌─────────────────────┐
│   Vue Component     │
│  (WalletConnect)    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   useBlockchain     │
│    (Composable)     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   MetaMask / Web3   │
│   (Browser Wallet)  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Ethereum Network   │
│  (Smart Contract)   │
└─────────────────────┘
```

### Data Flow
1. User connects wallet via MetaMask
2. Wallet address stored in app state
3. Deployment metadata prepared
4. Transaction sent to smart contract
5. Transaction hash and block number saved
6. Verification status tracked

---

## MetaMask Connection

### Setup

#### 1. Check MetaMask Installation
```typescript
const hasMetaMask = typeof window.ethereum !== 'undefined'

if (!hasMetaMask) {
  console.error('MetaMask is not installed')
  // Redirect to MetaMask installation page
  window.open('https://metamask.io/download/', '_blank')
}
```

#### 2. Request Account Access
```typescript
import { useBlockchain } from '~/composables/useBlockchain'

const { wallet, connectWallet, error } = useBlockchain()

const handleConnect = async () => {
  const result = await connectWallet()
  
  if (result) {
    console.log('Connected:', wallet.value.address)
    console.log('Chain ID:', wallet.value.chainId)
  } else {
    console.error('Connection failed:', error.value)
  }
}
```

#### 3. Handle Network Changes
```typescript
if (window.ethereum) {
  window.ethereum.on('chainChanged', (chainId: string) => {
    console.log('Network changed to:', parseInt(chainId, 16))
    // Reload app or update state
    window.location.reload()
  })
  
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnectWallet()
    } else {
      // Account changed
      console.log('Account changed to:', accounts[0])
    }
  })
}
```

### Component Integration

```vue
<template>
  <div>
    <div v-if="!wallet.connected">
      <Button @click="handleConnect">
        Connect Wallet
      </Button>
    </div>
    
    <div v-else>
      <p>Connected: {{ formatAddress(wallet.address) }}</p>
      <p>Network: {{ getNetworkName(wallet.chainId) }}</p>
      <Button @click="disconnectWallet">
        Disconnect
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlockchain } from '~/composables/useBlockchain'

const { wallet, connectWallet, disconnectWallet } = useBlockchain()

const formatAddress = (address: string | null) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getNetworkName = (chainId: number | null) => {
  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet'
  }
  return chainId ? networks[chainId] || `Chain ${chainId}` : 'Unknown'
}

const handleConnect = async () => {
  await connectWallet()
}
</script>
```

---

## Recording Deployments

### Workflow

1. **Create Deployment** (off-chain)
2. **Prepare Metadata**
3. **Send Transaction** (on-chain)
4. **Wait for Confirmation**
5. **Store Transaction Hash** (off-chain)

### Implementation

#### Step 1: Prepare Deployment Data
```typescript
const deploymentData = {
  deploymentId: 'deploy_abc123',
  projectName: 'my-web-app',
  commitHash: 'a1b2c3d4',
  timestamp: Date.now(),
  deployer: wallet.value.address
}
```

#### Step 2: Record on Blockchain
```typescript
import { useBlockchain } from '~/composables/useBlockchain'

const { recordDeployment, wallet } = useBlockchain()

// Check wallet connection
if (!wallet.value.connected) {
  await connectWallet()
}

// Record deployment
const record = await recordDeployment(deploymentId, {
  projectName: 'my-web-app',
  commitHash: 'abc123',
  timestamp: new Date().toISOString()
})

if (record) {
  console.log('Transaction:', record.transaction_hash)
  console.log('Block:', record.block_number)
}
```

#### Step 3: Monitor Transaction
```typescript
const monitorTransaction = async (txHash: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  
  // Wait for transaction receipt
  const receipt = await provider.waitForTransaction(txHash)
  
  console.log('Transaction confirmed!')
  console.log('Block number:', receipt.blockNumber)
  console.log('Gas used:', receipt.gasUsed.toString())
  
  return receipt
}
```

### Complete Recording Example

```vue
<template>
  <Card>
    <template #header>
      <h3>Record Deployment</h3>
    </template>
    
    <div class="space-y-4">
      <Input
        v-model="deploymentId"
        label="Deployment ID"
        placeholder="deploy_123"
      />
      
      <Button
        :loading="recording"
        :disabled="!wallet.connected || !deploymentId"
        @click="handleRecord"
      >
        Record on Blockchain
      </Button>
      
      <div v-if="txHash" class="p-4 bg-green-50 rounded">
        <p class="text-sm text-green-800">
          Transaction: {{ txHash }}
        </p>
        <a
          :href="`https://etherscan.io/tx/${txHash}`"
          target="_blank"
          class="text-blue-600 underline"
        >
          View on Etherscan
        </a>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useBlockchain } from '~/composables/useBlockchain'
import { useNotification } from '~/composables/useNotification'

const { wallet, recordDeployment } = useBlockchain()
const { success, error: errorNotif } = useNotification()

const deploymentId = ref('')
const recording = ref(false)
const txHash = ref('')

const handleRecord = async () => {
  recording.value = true
  
  try {
    const record = await recordDeployment(deploymentId.value, {
      timestamp: new Date().toISOString()
    })
    
    if (record) {
      txHash.value = record.transaction_hash
      success('Recorded!', 'Deployment recorded on blockchain')
    }
  } catch (e) {
    errorNotif('Failed', 'Could not record deployment')
  } finally {
    recording.value = false
  }
}
</script>
```

---

## Verification

### On-Chain Verification

#### 1. Verify Deployment Exists
```typescript
import { useBlockchain } from '~/composables/useBlockchain'

const { verifyDeployment } = useBlockchain()

const isVerified = await verifyDeployment('deploy_123')

if (isVerified) {
  console.log('✓ Deployment verified on blockchain')
} else {
  console.log('✗ Deployment not found on blockchain')
}
```

#### 2. Fetch Deployment Record
```typescript
const { records, fetchRecords } = useBlockchain()

await fetchRecords('deploy_123')

const record = records.value.find(r => r.deployment_id === 'deploy_123')

if (record) {
  console.log('Transaction:', record.transaction_hash)
  console.log('Block:', record.block_number)
  console.log('Verified:', record.verified)
}
```

#### 3. Verification Component
```vue
<template>
  <Card>
    <template #header>
      <h3>Verify Deployment</h3>
    </template>
    
    <div class="space-y-4">
      <Input
        v-model="deploymentId"
        label="Deployment ID"
        placeholder="Enter deployment ID"
      />
      
      <Button
        :loading="verifying"
        @click="handleVerify"
      >
        Verify on Blockchain
      </Button>
      
      <div v-if="verificationResult !== null">
        <div
          v-if="verificationResult"
          class="p-4 bg-green-50 rounded"
        >
          <p class="text-green-800 font-medium">
            ✓ Deployment Verified
          </p>
        </div>
        
        <div v-else class="p-4 bg-yellow-50 rounded">
          <p class="text-yellow-800 font-medium">
            ✗ Not Verified
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
const { verifyDeployment } = useBlockchain()

const deploymentId = ref('')
const verifying = ref(false)
const verificationResult = ref<boolean | null>(null)

const handleVerify = async () => {
  verifying.value = true
  verificationResult.value = null
  
  try {
    const result = await verifyDeployment(deploymentId.value)
    verificationResult.value = result
  } finally {
    verifying.value = false
  }
}
</script>
```

---

## Smart Contract

### Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeploymentRegistry {
    struct Deployment {
        string deploymentId;
        string projectName;
        string commitHash;
        uint256 timestamp;
        address deployer;
    }
    
    mapping(string => Deployment) public deployments;
    mapping(string => bool) public verified;
    
    event DeploymentRecorded(
        string indexed deploymentId,
        string projectName,
        string commitHash,
        uint256 timestamp,
        address deployer
    );
    
    function recordDeployment(
        string memory _deploymentId,
        string memory _projectName,
        string memory _commitHash
    ) public {
        require(!verified[_deploymentId], "Deployment already recorded");
        
        deployments[_deploymentId] = Deployment({
            deploymentId: _deploymentId,
            projectName: _projectName,
            commitHash: _commitHash,
            timestamp: block.timestamp,
            deployer: msg.sender
        });
        
        verified[_deploymentId] = true;
        
        emit DeploymentRecorded(
            _deploymentId,
            _projectName,
            _commitHash,
            block.timestamp,
            msg.sender
        );
    }
    
    function verifyDeployment(string memory _deploymentId)
        public
        view
        returns (bool)
    {
        return verified[_deploymentId];
    }
    
    function getDeployment(string memory _deploymentId)
        public
        view
        returns (Deployment memory)
    {
        require(verified[_deploymentId], "Deployment not found");
        return deployments[_deploymentId];
    }
}
```

### Contract Interaction

```typescript
import { ethers } from 'ethers'

const CONTRACT_ADDRESS = '0x...' // Your deployed contract
const CONTRACT_ABI = [
  'function recordDeployment(string deploymentId, string projectName, string commitHash) public',
  'function verifyDeployment(string deploymentId) public view returns (bool)',
  'function getDeployment(string deploymentId) public view returns (tuple(string deploymentId, string projectName, string commitHash, uint256 timestamp, address deployer))'
]

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

// Record deployment
const tx = await contract.recordDeployment(
  'deploy_123',
  'my-web-app',
  'abc123'
)
await tx.wait()

// Verify deployment
const isVerified = await contract.verifyDeployment('deploy_123')

// Get deployment details
const deployment = await contract.getDeployment('deploy_123')
console.log('Deployment:', deployment)
```

---

## Complete Examples

### Full Integration Flow

```vue
<template>
  <div class="space-y-6">
    <!-- Wallet Connection -->
    <WalletConnect />
    
    <!-- Record Deployment -->
    <Card v-if="wallet.connected">
      <template #header>
        <h3>Record Deployment</h3>
      </template>
      
      <form @submit.prevent="handleRecord" class="space-y-4">
        <Input
          v-model="form.deploymentId"
          label="Deployment ID"
          required
        />
        <Input
          v-model="form.projectName"
          label="Project Name"
          required
        />
        <Input
          v-model="form.commitHash"
          label="Commit Hash"
          required
        />
        
        <Button
          type="submit"
          :loading="recording"
        >
          Record on Blockchain
        </Button>
      </form>
      
      <div v-if="txHash" class="mt-4 p-4 bg-blue-50 rounded">
        <p class="font-medium">Transaction Hash:</p>
        <code class="text-sm">{{ txHash }}</code>
        <a
          :href="`https://etherscan.io/tx/${txHash}`"
          target="_blank"
          class="text-blue-600 underline ml-2"
        >
          View on Explorer
        </a>
      </div>
    </Card>
    
    <!-- Verification -->
    <DeploymentVerification />
    
    <!-- Records -->
    <ChainRecords />
  </div>
</template>

<script setup lang="ts">
import { useBlockchain } from '~/composables/useBlockchain'

const { wallet, recordDeployment } = useBlockchain()
const { success, error: errorNotif } = useNotification()

const form = ref({
  deploymentId: '',
  projectName: '',
  commitHash: ''
})

const recording = ref(false)
const txHash = ref('')

const handleRecord = async () => {
  recording.value = true
  
  try {
    const record = await recordDeployment(form.value.deploymentId, {
      projectName: form.value.projectName,
      commitHash: form.value.commitHash,
      timestamp: new Date().toISOString()
    })
    
    if (record) {
      txHash.value = record.transaction_hash
      success('Success!', 'Deployment recorded on blockchain')
      
      // Reset form
      form.value = {
        deploymentId: '',
        projectName: '',
        commitHash: ''
      }
    } else {
      errorNotif('Failed', 'Could not record deployment')
    }
  } finally {
    recording.value = false
  }
}
</script>
```

---

## Best Practices

### 1. Always Check Wallet Connection
```typescript
if (!wallet.value.connected) {
  await connectWallet()
}
```

### 2. Handle Network Switching
```typescript
const switchToMainnet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }] // Mainnet
    })
  } catch (error) {
    console.error('Failed to switch network:', error)
  }
}
```

### 3. Estimate Gas Before Transaction
```typescript
const gasEstimate = await contract.estimateGas.recordDeployment(
  deploymentId,
  projectName,
  commitHash
)
console.log('Estimated gas:', gasEstimate.toString())
```

### 4. Show Transaction Progress
```typescript
const tx = await contract.recordDeployment(...)
console.log('Transaction sent:', tx.hash)

const receipt = await tx.wait()
console.log('Transaction confirmed in block:', receipt.blockNumber)
```

### 5. Error Handling
```typescript
try {
  await recordDeployment(...)
} catch (error) {
  if (error.code === 4001) {
    // User rejected transaction
    console.log('User rejected transaction')
  } else if (error.code === -32603) {
    // Internal error
    console.error('Internal error:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

---

## Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Goerli Testnet** (Chain ID: 5)
- **Polygon** (Chain ID: 137)
- **Mumbai Testnet** (Chain ID: 80001)

## Resources

- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Ethers.js Documentation](https://docs.ethers.io/)
