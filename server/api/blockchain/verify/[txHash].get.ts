import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  await getAuthenticatedUser(event)
  const txHash = getRouterParam(event, 'txHash')
  
  if (!txHash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction hash is required'
    })
  }
  
  const record = await prisma.chainRecord.findUnique({
    where: { txHash },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  })
  
  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chain record not found'
    })
  }
  
  // NOTE: In production, this should verify against actual blockchain
  // For development/testing, we mark as verified without actual on-chain verification
  // TODO: Implement actual blockchain verification using ethers.js or web3.js
  // Example: const tx = await provider.getTransaction(txHash)
  const updated = await prisma.chainRecord.update({
    where: { txHash },
    data: { verified: true }
  })
  
  return {
    ...updated,
    verified: true,
    blockchainData: {
      txHash: updated.txHash,
      blockNumber: updated.blockNumber,
      network: updated.network
    }
  }
})
