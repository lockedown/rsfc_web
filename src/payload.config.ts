import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users.js'
import { Seasons } from './collections/Seasons.js'
import { AgeGroups } from './collections/AgeGroups.js'
import { Teams } from './collections/Teams.js'
import { Fixtures } from './collections/Fixtures.js'
import { Results } from './collections/Results.js'
import { Players } from './collections/Players.js'
import { News } from './collections/News.js'
import { Events } from './collections/Events.js'
import { SoccerSchoolSessions } from './collections/SoccerSchoolSessions.js'
import { Sponsors } from './collections/Sponsors.js'
import { GalleryAlbums } from './collections/GalleryAlbums.js'
import { Pages } from './collections/Pages.js'
import { Media } from './collections/Media.js'
import { Enquiries } from './collections/Enquiries.js'
import { Settings } from './globals/Settings.js'
import { rolloverEndpoint } from './endpoints/rollover.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - Raw Skills FC Admin',
    },
  },
  collections: [
    Users,
    Seasons,
    AgeGroups,
    Teams,
    Fixtures,
    Results,
    Players,
    News,
    Events,
    SoccerSchoolSessions,
    Sponsors,
    GalleryAlbums,
    Pages,
    Media,
    Enquiries,
  ],
  globals: [Settings],
  endpoints: [rolloverEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '' },
    push: true, // auto-sync schema on first connection (fine for early-stage; switch to migrations later)
  }),
  plugins: [
    s3Storage({
      collections: { media: { prefix: 'media' } },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
