import config from './package.json';
import { EmbedOGP } from './src/EmbedOGP';
import { Options, Func, ViewOptions } from './types/utils';

declare const growiFacade : {
  markdownRenderer?: {
    optionsGenerators: {
      customGenerateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generatePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      customGeneratePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
    },
  },
};

const activate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }
  const { optionsGenerators } = growiFacade.markdownRenderer;
  const originalCustomViewOptions = optionsGenerators.customGenerateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args) => {
    const options = originalCustomViewOptions ? originalCustomViewOptions(...args) : optionsGenerators.generateViewOptions(...args);
    const A = options.components.a;
    // replace
    options.components.a = EmbedOGP(A);
    return options;
  };

  // For preview
  const originalGeneratePreviewOptions = optionsGenerators.customGeneratePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args) => {
    const preview = originalGeneratePreviewOptions ? originalGeneratePreviewOptions(...args) : optionsGenerators.generatePreviewOptions(...args);
    const { a } = preview.components;
    preview.components.a = EmbedOGP(a); // Wrap the default component
    return preview;
  };
};

const deactivate = (): void => {
};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators[config.name] = {
  activate,
  deactivate,
};
