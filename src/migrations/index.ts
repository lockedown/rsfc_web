import * as migration_20260513_144711_initial from './20260513_144711_initial';

export const migrations = [
  {
    up: migration_20260513_144711_initial.up,
    down: migration_20260513_144711_initial.down,
    name: '20260513_144711_initial'
  },
];
