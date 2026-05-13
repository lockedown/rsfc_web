import * as migration_20260513_144711_initial from './20260513_144711_initial';
import * as migration_20260513_160544_add_media_prefix_field from './20260513_160544_add_media_prefix_field';

export const migrations = [
  {
    up: migration_20260513_144711_initial.up,
    down: migration_20260513_144711_initial.down,
    name: '20260513_144711_initial'
  },
  {
    up: migration_20260513_160544_add_media_prefix_field.up,
    down: migration_20260513_160544_add_media_prefix_field.down,
    name: '20260513_160544_add_media_prefix_field'
  },
];
