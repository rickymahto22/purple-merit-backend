import { Queue, Worker } from 'bullmq';
import { redisConfig } from '../config/redis';

// 1. Create the Queue (The "Waiting Line")
export const codeQueue = new Queue('code-execution-queue', {
  connection: redisConfig
});

// 2. Define the Worker (The "Processor")
// This runs in the background. It picks up jobs one by one.
const worker = new Worker('code-execution-queue', async (job) => {
  console.log(`⚙️ [Worker] Processing Job ${job.id}: Running ${job.data.language} code...`);

  // Simulate heavy computation (e.g., compiling code)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (Math.random() > 0.9) {
     // Simulate random failure to test "Retry Logic" [cite: 71]
     throw new Error('Random Compilation Error'); 
  }

  console.log(`✅ [Worker] Job ${job.id} Completed!`);
  return { status: 'success', output: 'Hello World (Executed)' };
}, {
  connection: redisConfig,
  concurrency: 2 // Allow processing 2 jobs at the same time
});

// 3. Event Listeners (Observability)
worker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Job ${job?.id} Failed: ${err.message}`);
});

worker.on('completed', (job) => {
  console.log(`🎉 [Worker] Job ${job.id} finished successfully.`);
});