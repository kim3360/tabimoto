module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    'react-native/no-raw-text': [
      'error',
      { skip: ['Label', 'Caps', 'Button'] },
    ],
  },
  ignorePatterns: ['node_modules/', 'ios/', 'android/', 'vendor/'],
};
