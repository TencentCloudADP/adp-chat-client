let monacoPromise: Promise<typeof import('monaco-editor')> | null = null;

/**
 * 懒加载 Monaco Editor，全局单例，避免重复初始化 Worker
 */
export function loadMonaco(): Promise<typeof import('monaco-editor')> {
    if (!monacoPromise) {
        monacoPromise = (async () => {
            // Worker 配置必须在 import monaco-editor 之前设置
            const [
                { default: editorWorker },
                { default: jsonWorker },
                { default: cssWorker },
                { default: htmlWorker },
                { default: tsWorker },
            ] = await Promise.all([
                import('monaco-editor/esm/vs/editor/editor.worker?worker'),
                import('monaco-editor/esm/vs/language/json/json.worker?worker'),
                import('monaco-editor/esm/vs/language/css/css.worker?worker'),
                import('monaco-editor/esm/vs/language/html/html.worker?worker'),
                import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
            ]);

            (self as any).MonacoEnvironment = {
                getWorker(_: unknown, label: string) {
                    if (label === 'json') return new jsonWorker();
                    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
                    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
                    if (label === 'typescript' || label === 'javascript') return new tsWorker();
                    return new editorWorker();
                },
            };

            const monaco = await import('monaco-editor');
            return monaco;
        })();
    }
    return monacoPromise;
}
