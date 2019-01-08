module.exports = {
  extends: 'airbnb-base',
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    'implicit-arrow-linebreak': 0,
    'no-console': 0,
    'no-param-reassign': 0,
  },
};
