import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/schema.gql',
  generates: {
    './src/generated/schema.d.ts': {
      config: {
        useIndexSignature: true,
        contextType: '../context#Context',
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
}
export default config
