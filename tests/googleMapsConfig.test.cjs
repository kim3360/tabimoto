const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function configure(t, config, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tabimoto-maps-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ['scripts', 'config', 'ios', 'android'])
    fs.mkdirSync(path.join(root, dir));
  fs.copyFileSync(
    path.join(__dirname, '../scripts/prepare-google-maps.cjs'),
    path.join(root, 'scripts/prepare-google-maps.cjs'),
  );
  if (config)
    fs.writeFileSync(
      path.join(root, 'config/google-maps.local.json'),
      JSON.stringify(config),
    );
  if (options.envFile !== undefined)
    fs.writeFileSync(path.join(root, '.env'), options.envFile);
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'scripts/prepare-google-maps.cjs')],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GOOGLE_MAPS_IOS_API_KEY: '',
        GOOGLE_MAPS_ANDROID_API_KEY: '',
        ...options.environment,
      },
    },
  );
  return { root, result };
}
test('missing Google keys produce a safe disabled screen configuration', (t) => {
  const { root, result } = configure(t);
  assert.equal(result.status, 0);
  assert.match(
    fs.readFileSync(
      path.join(root, 'src/config/googleMaps.generated.ts'),
      'utf8',
    ),
    /ios: false, android: false/,
  );
});
test('keys stay in native configuration and never enter JavaScript or output', (t) => {
  const key = 'AIzaExampleOnly_NotARealKey';
  const { root, result } = configure(t, { iosApiKey: key });
  assert.equal(result.status, 0);
  const generated = fs.readFileSync(
    path.join(root, 'src/config/googleMaps.generated.ts'),
    'utf8',
  );
  assert.match(generated, /ios: true, android: false/);
  assert.equal(generated.includes(key), false);
  assert.equal(result.stdout.includes(key), false);
  assert.match(
    fs.readFileSync(path.join(root, 'ios/GoogleMaps.local.xcconfig'), 'utf8'),
    /AIzaExampleOnly/,
  );
});
test('unsupported credentials are rejected without exposing them', (t) => {
  const key = 'not-a-google-maps-key';
  const { result } = configure(t, { androidApiKey: key });
  assert.notEqual(result.status, 0);
  assert.equal(result.stderr.includes(key), false);
});

test('.env supports comments, quoted values and independent platform keys', (t) => {
  const iosKey = 'AIzaExampleOnly_IosKey';
  const androidKey = 'AIzaExampleOnly_AndroidKey';
  const { root, result } = configure(t, undefined, {
    envFile: `# Local keys\r\nGOOGLE_MAPS_IOS_API_KEY="${iosKey}" # iOS\r\nGOOGLE_MAPS_ANDROID_API_KEY='${androidKey}'\r\n`,
  });
  assert.equal(result.status, 0);
  const generated = fs.readFileSync(
    path.join(root, 'src/config/googleMaps.generated.ts'),
    'utf8',
  );
  assert.match(generated, /ios: true, android: true/);
  assert.equal(generated.includes(iosKey), false);
  assert.equal(generated.includes(androidKey), false);
  assert.equal(result.stdout.includes(iosKey), false);
  assert.equal(result.stdout.includes(androidKey), false);
  assert.equal(
    fs.readFileSync(path.join(root, 'ios/GoogleMaps.local.xcconfig'), 'utf8'),
    `GOOGLE_MAPS_API_KEY = ${iosKey}\n`,
  );
  assert.equal(
    fs.readFileSync(
      path.join(root, 'android/google-maps.local.properties'),
      'utf8',
    ),
    `apiKey=${androidKey}\n`,
  );
});

test('process environment overrides .env and .env overrides legacy JSON', (t) => {
  const { root, result } = configure(
    t,
    { iosApiKey: 'AIzaLegacyIos', androidApiKey: 'AIzaLegacyAndroid' },
    {
      envFile:
        'GOOGLE_MAPS_IOS_API_KEY=AIzaFileIos\nGOOGLE_MAPS_ANDROID_API_KEY=AIzaFileAndroid\n',
      environment: { GOOGLE_MAPS_IOS_API_KEY: 'AIzaEnvironmentIos' },
    },
  );
  assert.equal(result.status, 0);
  assert.equal(
    fs.readFileSync(path.join(root, 'ios/GoogleMaps.local.xcconfig'), 'utf8'),
    'GOOGLE_MAPS_API_KEY = AIzaEnvironmentIos\n',
  );
  assert.equal(
    fs.readFileSync(
      path.join(root, 'android/google-maps.local.properties'),
      'utf8',
    ),
    'apiKey=AIzaFileAndroid\n',
  );
});

test('an invalid .env key is rejected without printing the credential', (t) => {
  const key = 'invalid-private-credential';
  const { result } = configure(t, undefined, {
    envFile: `GOOGLE_MAPS_IOS_API_KEY=${key}\n`,
  });
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout.includes(key), false);
  assert.equal(result.stderr.includes(key), false);
});
