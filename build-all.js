const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readdir = util.promisify(require('fs').readdir);

const build = async () => {
  try {
    const names = await readdir('apps');
    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      await exec(`nest build ${name}`);
      console.log(`${name} is built`);
    }
  } catch (err) {
    console.log(err);
  }
};

void build();
