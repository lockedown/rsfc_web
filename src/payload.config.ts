import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Seasons } from './collections/Seasons'
import { AgeGroups } from './collections/AgeGroups'
import { Teams } from './collections/Teams'
import { Fixtures } from './collections/Fixtures'
import { Results } from './collections/Results'
import { Players } from './collections/Players'
import { News } from './collections/News'
import { Events } from './collections/Events'
import { SoccerSchoolSessions } from './collections/SoccerSchoolSessions'
import { Sponsors } from './collections/Sponsors'
import { GalleryAlbums } from './collections/GalleryAlbums'
import { Pages } from './collections/Pages'
import { Media } from './collections/Media'
import { Enquiries } from './collections/Enquiries'
import { Settings } from './globals/Settings'
import { rolloverEndpoint } from './endpoints/rollover'

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
