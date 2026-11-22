import dataSource from '../typeorm/data-source';
import { seedAuthorization } from './authorization.seed';

async function main() {
  await dataSource.initialize();

  try {
    await seedAuthorization(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  // oxlint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
