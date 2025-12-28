/**
 * Standard error responses for API
 */

export function notFoundError(message = 'Resource not found') {
  return createError({
    statusCode: 404,
    message
  })
}

export function unauthorizedError(message = 'Unauthorized') {
  return createError({
    statusCode: 401,
    message
  })
}

export function forbiddenError(message = 'Forbidden') {
  return createError({
    statusCode: 403,
    message
  })
}

export function badRequestError(message = 'Bad request') {
  return createError({
    statusCode: 400,
    message
  })
}

export function validationError(errors: Record<string, string[]>) {
  return createError({
    statusCode: 422,
    message: 'Validation failed',
    data: errors
  })
}

export function internalError(message = 'Internal server error') {
  return createError({
    statusCode: 500,
    message
  })
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: any) {
  if (error.code === 'P2002') {
    return createError({
      statusCode: 409,
      message: 'Resource already exists'
    })
  }
  
  if (error.code === 'P2025') {
    return notFoundError('Resource not found')
  }
  
  console.error('Prisma error:', error)
  return internalError('Database error')
}
