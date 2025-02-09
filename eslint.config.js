import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  // Add your custom rules here~
  rules: {
    'ts/no-namespace': 'off',
  },
})
