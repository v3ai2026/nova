# Blockchain Integration Guide

## Overview
Integration guide for blockchain features including wallet connection and deployment verification.

## Setup

### 1. MetaMask Installation
Users need MetaMask or compatible Web3 wallet installed in their browser.

### 2. Supported Networks
- Ethereum Mainnet
- Polygon
- Other EVM-compatible networks

## Wallet Connection

### Using useBlockchain Composable
```typescript
const { connectWallet, walletAddress, walletConnected } = useBlockchain()

// Connect wallet
await connectWallet()

// Check connection
if (walletConnected.value) {
  console.log('Connected:', walletAddress.value)
}
```

### Error Handling
```typescript
try {
  await connectWallet()
} catch (error) {
  console.error('Connection failed:', error.message)
}
```

## Recording Deployments

### On-Chain Recording
```typescript
const { recordDeployment } = useBlockchain()

await recordDeployment(projectId, {
  txHash: '0x...',
  blockNumber: 12345,
  network: 'ethereum',
  deploymentId: 'deployment-id',
  metadata: { version: '1.0.0' }
})
```

## Verification

### Verify Transaction
```typescript
const { verifyOnChain } = useBlockchain()

const result = await verifyOnChain('0x...')
console.log('Verified:', result.verified)
```

### Get Chain Records
```typescript
const { getChainRecords } = useBlockchain()

const records = await getChainRecords(projectId)
```

## Security Considerations

1. **Never store private keys** - Users connect via MetaMask
2. **Validate transactions** - Always verify on-chain before trusting
3. **Handle errors** - Network issues are common
4. **Gas fees** - Users pay gas for on-chain transactions

## Best Practices

- Check wallet connection before blockchain operations
- Provide clear error messages
- Show transaction status to users
- Allow users to disconnect wallet
- Cache chain records to reduce API calls

## Troubleshooting

### MetaMask Not Detected
```typescript
if (typeof window.ethereum === 'undefined') {
  alert('Please install MetaMask')
}
```

### Wrong Network
Users may need to switch networks in MetaMask.

### Transaction Failed
Check gas fees and network congestion.
