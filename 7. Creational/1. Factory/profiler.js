class Profiler {
  constructor(label) {
    this.label = label;
    this.lastTime = null;
  }

  start() {
    this.lastTime = process.hrtime();
  }

  end() {
    const diff = process.hrtime(this.lastTime);
    console.log(
      `Timer "${this.label}" took ${diff[0]} seconds and ${diff[1]} nanoseconds.`
    );
  }
}

/*
    Using a factory to abstract the creation of the Profile object

    Intead of exporting the Profile class, we will export only our factory.

*/

const noopProfiler = {
  start() {},
  end() {},
};

export function createProfiler(label) {
  if (process.env.NODE_ENV === "production") {
    return noopProfiler;
  }

  return new Profiler(label);
}

/*
    In the production, we export noopProfiler which doesnt do anything, effectively disabling any profiling

    In other modes, we create and return a new, fully functional Profiler instance

    Advantage : Allows us to create an instance in any way we like inside the factory function.


 */
