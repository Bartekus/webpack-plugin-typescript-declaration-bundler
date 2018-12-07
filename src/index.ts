
/**
 * WebpackPluginTypescriptDeclarationBundler class
 */
module.exports = class WebpackPluginTypescriptDeclarationBundler {
  out: string;
  moduleName: string;
  mode: string;
  excludedReferences: string[];

  constructor(options: any = {}) {
    this.out = options.out ? options.out : './build/';
    this.excludedReferences = options.excludedReferences ? options.excludedReferences : undefined;

    if (!options.moduleName) {
      throw new Error('please set a moduleName if you use mode:internal. new DacoreWebpackPlugin({mode:\'internal\',moduleName:...})');
    }
    this.moduleName = options.moduleName;
  }

  apply(compiler) {
    // when the compiler is ready to emit files
    compiler.hooks.emit.tapAsync('DeclarationBundlerPlugin', (compilation, callback) => {
      // collect all generated declaration files and remove them from the assets that will be emitted
      let declarationFiles = {};

      for (const filename in compilation.assets) {
        if (filename.indexOf('.d.ts') !== -1) {
          declarationFiles[filename] = compilation.assets[filename];
          delete compilation.assets[filename];
        }
      }

      // combine them into one declaration file
      const combinedDeclaration = this.generateCombinedDeclaration(declarationFiles);

      // and insert that back into the assets
      compilation.assets[this.out] = {
        source: () => {
          return combinedDeclaration;
        },
        size: () => {
          return combinedDeclaration.length;
        },
      };

      // webpack may continue now
      callback();
    });
  }

  private generateCombinedDeclaration(declarationFiles: object): string {
    let declarations = '';

    for (const fileName in declarationFiles) {
      const declarationFile = declarationFiles[fileName];
      const data = declarationFile.source();

      const lines = data.split('\n');
      let i = lines.length;


      while (i--) {
        const line = lines[i];

        // exclude empty lines
        let excludeLine: boolean = line === '';

        // exclude export statements
        excludeLine = excludeLine || line.indexOf('export =') !== -1;

        // exclude import statements
        excludeLine = excludeLine || (/import ([a-z0-9A-Z_-]+) = require\(/).test(line);

        // if defined, check for excluded references
        if (!excludeLine && this.excludedReferences && line.indexOf('<reference') !== -1) {
          excludeLine = this.excludedReferences.some(reference => line.indexOf(reference) !== -1);
        }

        if (excludeLine) {
          lines.splice(i, 1);
        } else {
          if (line.indexOf('declare ') !== -1) {
            lines[i] = line.replace('declare ', '');
          }
          // add tab
          lines[i] = '\t' + lines[i];
        }
      }
      declarations += lines.join('\n') + '\n\n';
    }

    return 'declare module ' + this.moduleName + '\n{\n' + declarations + '}';
  }

}
