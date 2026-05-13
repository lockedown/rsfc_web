import { getPayload } from 'payload'
import config from '@payload-config'

export const getPayloadClient = async () => {
  return await getPayload({ config })
}

/**
 * Returns the season marked isCurrent, or null if none.
 */
export const getCurrentSeason = async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'seasons',
    where: { isCurrent: { equals: true } },
    limit: 1,
  })
  return res.docs[0] ?? null
}
