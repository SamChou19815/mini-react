/**
 * A simple scheduler to run delayed computations.
 *
 * @param J type of the job.
 */
export default class Scheduler<J> {
  // The scheduler starts as non-idle, since we need to wait until initial DOM mount.
  private idle: boolean = false;
  private jobsQueue: J[] = [];

  public constructor(private readonly singleJobRunner: (job: J) => void) {}

  public addJob = (job: J): void => {
    // When we add a job, we cannot just run it, since it might interfere with current DOM rendering.
    // Instead, we can only start triggering it when the schedular is idle.
    this.jobsQueue.push(job);
    if (this.idle) {
      this.runTheQueuedJobs();
    }
  };

  public runTheQueuedJobs = (): void => {
    // This needs to be public, so that we can call it after initial DOM mount.
    // If there is no update, then it will be a no-op.
    this.idle = false;
    while (true) {
      const job = this.jobsQueue.shift();
      if (job == null) {
        break;
      }
      this.singleJobRunner(job);
    }
    this.idle = true;
  };
}
