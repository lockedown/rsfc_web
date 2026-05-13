import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

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
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_URI ||
  ''

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
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
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: { connectionString },
    push: false, // use committed migrations instead
    prodMigrations: migrations,
  }),
  plugins: [
    // Only register R2/S3 storage when actually configured.
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                ...(process.env.S3_PUBLIC_URL
                  ? {
                      generateFileURL: ({ filename }) =>
                        `${process.env.S3_PUBLIC_URL}/media/${filename}`,
                    }
                  : {}),
              },
            },
            bucket: process.env.S3_BUCKET,
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
        ]
      : []),
  ],
})
