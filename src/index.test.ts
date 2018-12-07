const WebpackPluginTypescriptDeclarationBundler = require('./index');

/**
 * WebpackPluginTypescriptDeclarationBundler test
 */
describe('WebpackPluginTypescriptDeclarationBundler test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  });

  it('WebpackPluginTypescriptDeclarationBundler is instantiable', () => {
    expect(new WebpackPluginTypescriptDeclarationBundler({ mode:'internal', moduleName: {} })).toBeInstanceOf(WebpackPluginTypescriptDeclarationBundler)
  });
});
