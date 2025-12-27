import { Request, Response } from 'express';
import { codeQueue } from '../jobs/codeExecutionJob';

export const runCode = async (req: Request, res: Response) => {
  try {
    const { language, code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Add job to the queue
    const job = await codeQueue.add('execute-code', 
      { language, code }, 
      {
        attempts: 3, // Retry 3 times if it fails [cite: 71]
        backoff: 1000 // Wait 1 second before retrying
      }
    );

    // Respond immediately (Async I/O) [cite: 89]
    res.status(202).json({
      message: 'Code submission queued',
      jobId: job.id,
      status: 'pending'
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to queue job' });
  }
};