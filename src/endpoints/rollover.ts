import type { Endpoint } from 'payload'

/**
 * POST /api/seasons/rollover
 * Body: {
 *   sourceSeasonId: string,
 *   newSeasonLabel: string,
 *   newStartDate: string,
 *   newEndDate: string,
 *   bumpAgeGroups: boolean,        // if true, attempt to assign the next ageGroup (by sortOrder)
 *   teamOverrides?: { teamId: string, newAgeGroupId?: string, skip?: boolean }[],
 * }
 *
 * Clones every team from the source season into a new season as drafts.
 * Sets `previousTeam` on each new team. The new season is created with isCurrent=false.
 */
export const rolloverEndpoint: Endpoint = {
  path: '/seasons/rollover',
  method: 'post',
  handler: async (req) => {
    const { user, payload } = req
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = (await req.json?.()) as {
      sourceSeasonId: string
      newSeasonLabel: string
      newStartDate: string
      newEndDate: string
      bumpAgeGroups?: boolean
      teamOverrides?: { teamId: string; newAgeGroupId?: string; skip?: boolean }[]
    }

    if (!body?.sourceSeasonId || !body?.newSeasonLabel) {
      return Response.json({ error: 'Missing sourceSeasonId or newSeasonLabel' }, { status: 400 })
    }

    // 1. Create the new season (not current yet)
    const newSeason = await payload.create({
      collection: 'seasons',
      data: {
        label: body.newSeasonLabel,
        startDate: body.newStartDate,
        endDate: body.newEndDate,
        isCurrent: false,
        archived: false,
      },
      overrideAccess: true,
    })

    // 2. Fetch the age-group ladder (sorted) for bump logic
    const ageGroups = await payload.find({
      collection: 'ageGroups',
      limit: 200,
      sort: 'sortOrder',
      overrideAccess: true,
    })
    const ladder = ageGroups.docs

    // 3. Fetch source-season teams
    const sourceTeams = await payload.find({
      collection: 'teams',
      where: { season: { equals: body.sourceSeasonId } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    })

    const overrideByTeam = new Map(
      (body.teamOverrides ?? []).map((o) => [o.teamId, o] as const),
    )

    const created: string[] = []
    const skipped: string[] = []

    for (const team of sourceTeams.docs) {
      const override = overrideByTeam.get(String(team.id))
      if (override?.skip) {
        skipped.push(String(team.id))
        continue
      }

      let ageGroupId: number = typeof team.ageGroup === 'object'
        ? (team.ageGroup as { id: number }).id
        : (team.ageGroup as number)
      if (override?.newAgeGroupId) {
        ageGroupId = Number(override.newAgeGroupId)
      } else if (body.bumpAgeGroups) {
        const idx = ladder.findIndex((ag) => Number(ag.id) === ageGroupId)
        if (idx >= 0 && idx + 1 < ladder.length) {
          ageGroupId = Number(ladder[idx + 1].id)
        }
      }

      const newTeam = await payload.create({
        collection: 'teams',
        data: {
          name: team.name,
          slug: `${team.slug}-${body.newSeasonLabel.replace(/\W+/g, '-').toLowerCase()}`,
          season: newSeason.id,
          ageGroup: ageGroupId,
          format: team.format,
          manager: team.manager,
          coaches: team.coaches,
          venue: team.venue,
          trainingTimes: team.trainingTimes,
          league: team.league,
          crestImage: team.crestImage,
          heroImage: team.heroImage,
          description: team.description,
          sponsors: team.sponsors,
          previousTeam: team.id,
        },
        overrideAccess: true,
      })
      created.push(String(newTeam.id))
    }

    return Response.json({
      newSeasonId: newSeason.id,
      created,
      skipped,
      message: `Rolled over ${created.length} team(s) into ${body.newSeasonLabel}. New season is draft (not current). Toggle "isCurrent" when ready.`,
    })
  },
}
