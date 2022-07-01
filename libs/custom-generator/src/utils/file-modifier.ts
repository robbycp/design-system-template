import {
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

type DefaultSchema = {
  name: string,
  tags?: string
}
export type NormalizedSchema<TOptions> = TOptions & DefaultSchema & {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[]
}

export function normalizeOptions<TOptions extends DefaultSchema>(tree: Tree, options: TOptions): NormalizedSchema<TOptions> {
  const name = names(options.name).fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export const createPath = <TOptions>(options: NormalizedSchema<TOptions>, oldPath: string, newPath: string) => ({
  newPath: options.projectRoot.concat(newPath),
  oldPath: '/' + options.projectRoot.concat(oldPath),
})

export function addFiles<TOptions>(
  tree: Tree,
  options: NormalizedSchema<TOptions>,
  generatorName: string,
  directoryName: string,
) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  };
  const outputPath = tree.root
    + '/libs/custom-generator/src/generators'
    + `/${generatorName}`
    + `/${directoryName}`
  // logger.log('path.join(__dirname, directoryName)', path.join(__dirname, directoryName))
  // logger.log('tree', tree.root)
  // logger.log('options', options.projectRoot)
  console.log('outputPath', outputPath)
  generateFiles(tree, outputPath, options.projectRoot, templateOptions);
}

export function replaceContentFile<TOptions>({
  tree,
  options,
  path,
  fromString,
  toString,
}: {
  tree: Tree,
  options: NormalizedSchema<TOptions>,
  path: string,
  fromString: string,
  toString: string,
}) {
  const filePath = '/' + options.projectRoot + path
  const fileContent = tree.read(filePath)
  const fileContentString = fileContent.toString().replace(new RegExp(fromString, 'g'), toString)
  const fileContentBuffer = Buffer.from(fileContentString, "utf-8");
  tree.write(filePath, fileContentBuffer)
  logger.log(`REPLACE ${fromString} with ${toString} : ${filePath}`)
}

export function addModules<TOptions>({
  tree,
  options,
  modulePath,
  targetModulePath,
  replaceStrings,
}: {
  tree: Tree,
  options: NormalizedSchema<TOptions>,
  modulePath: string,
  targetModulePath: string
  replaceStrings?: {
    fromString: string
    toString: string
    paths: string[]
  }[]
}) {
  logger.log('GENERATE module ', modulePath)
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  };

  const sourcePath = tree.root.concat(modulePath)
  const targetPath = options.projectRoot + targetModulePath

  generateFiles(
    tree,
    sourcePath,
    targetPath,
    templateOptions,
  )

  if (replaceStrings) {
    replaceStrings.forEach((replaceString) => {
      replaceString.paths.forEach((path) => {
        replaceContentFile({
          tree,
          options,
          path,
          fromString: replaceString.fromString,
          toString: replaceString.toString,
        })
      })
    })
  }
}

export function copyFile(tree: Tree, oldPath: string, newPath: string) {
  
  logger.log('READ ', oldPath)
  const readPublicFile = tree.read(oldPath)
  logger.log('CONTENT ', readPublicFile)
  tree.write(newPath, readPublicFile)
  logger.log('WRITE ', newPath)
  tree.delete(oldPath)
  logger.log('DELETE ', oldPath)
  logger.log('')
}