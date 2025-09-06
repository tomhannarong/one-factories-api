import { AppDataSource } from '../data-source';

async function run() {
  await AppDataSource.initialize();
  // TODO: insert base data (e.g., permissions, roles)
  await AppDataSource.destroy();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
