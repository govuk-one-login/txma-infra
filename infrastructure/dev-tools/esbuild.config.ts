import esbuild from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { yamlParse } from 'yaml-cfn'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface IAwsResource {
  Type: string
}

interface ILambdaFunction extends IAwsResource {
  Properties: {
    Handler: string
  }
}

const handlerPath = 'src/lambdas'

const { Resources } = yamlParse(
  readFileSync(join(__dirname, 'template.yaml'), 'utf-8')
)

const awsResources = Object.values(Resources) as IAwsResource[]

const lambdas = awsResources.filter(
  (resource) => resource.Type === 'AWS::Serverless::Function'
) as ILambdaFunction[]

const entries = lambdas.reduce(
  (entries, lambda) => {
    const handlerName = lambda.Properties.Handler.split('.')[0] ?? ''

    entries[handlerName] = `./${handlerPath}/${handlerName}/handler.ts`
    return entries
  },
  {} as Record<string, string>
)

esbuild
  .build({
    bundle: true,
    entryPoints: entries,
    logLevel: 'info',
    minify: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    sourcesContent: false,
    sourcemap: 'inline',
    target: 'ES2024',
    banner: {
      js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);import { fileURLToPath } from 'url';import { dirname } from 'path';const __filename = fileURLToPath(import.meta.url);const __dirname = dirname(__filename);"
    }
  })
  .then(() => {
    // Create package.json with type: module for each Lambda function
    lambdas.forEach((lambda) => {
      const lambdaName = lambda.Properties.Handler.split('/')[1] ?? ''
      const lambdaDistPath = join(__dirname, 'dist', lambdaName)

      mkdirSync(lambdaDistPath, { recursive: true })

      const packageJson = {
        type: 'module'
      }

      writeFileSync(
        join(lambdaDistPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )
    })
  })
  .catch(() => process.exit(1))
