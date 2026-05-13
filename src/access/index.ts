import type { Access, FieldAccess, Where } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

export const anyone: Access = () => true

export const isAdminField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'

/**
 * Team managers may only mutate documents whose `team` belongs to a team they manage,
 * and only when that team is in the current season.
 * Admin/editor bypass.
 */
export const teamManagerScoped =
  (relation: 'team' | 'self' = 'team'): Access =>
  async ({ req }): Promise<boolean | Where> => {
    const { user } = req
    if (!user) return false
    if (user.role === 'admin' || user.role === 'editor') return true
    if (user.role !== 'teamManager') return false

    // Find teams managed by this user in the current season
    const teams = await req.payload.find({
      collection: 'teams',
      depth: 1,
      limit: 100,
      where: {
        and: [
          { manager: { equals: user.id } },
          { 'season.isCurrent': { equals: true } },
        ],
      },
    })
    const teamIds = teams.docs.map((t: { id: string | number }) => t.id)
    if (teamIds.length === 0) return false

    const where: Where =
      relation === 'self' ? { id: { in: teamIds } } : { team: { in: teamIds } }
    return where
  }
