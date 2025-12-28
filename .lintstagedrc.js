module.exports = {
  '*.{js,ts,vue}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{json,md,yml,yaml}': [
    'prettier --write',
  ],
  '*.{ts,tsx,vue}': [
    () => 'vue-tsc --noEmit',
  ],
};
