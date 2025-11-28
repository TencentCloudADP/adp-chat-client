'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [id] = useState<string>(`mermaid-${Math.random().toString(36).substring(2, 10)}`);
  const mermaidRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
    // 只在客户端获取主题
    if (typeof window !== 'undefined') {
      const theme = document.documentElement.getAttribute('data-theme') || 
                    document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setIsDark(theme === 'dark');
      
      // 监听主题变化
      const observer = new MutationObserver(() => {
        const newTheme = document.documentElement.getAttribute('data-theme') || 
                        document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setIsDark(newTheme === 'dark');
      });
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
      });
      
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let isMounted = true;

    const loadMermaid = async () => {
      if (!mermaidRef.current) {
        const mod = await import('mermaid');
        mermaidRef.current = mod.default ?? mod;
      }
      return mermaidRef.current;
    };

    const renderChart = async () => {
      if (!ref.current) return;

      const mermaid = await loadMermaid();
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'sandbox',
      });

      try {
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvg(svg);
        }
      } catch (error) {
        console.error('Error rendering mermaid chart:', error);
        if (isMounted) {
          setSvg(`<div class="text-red-500 p-2 border border-red-400 rounded">
            Error rendering chart: ${(error as Error).message || String(error)}
          </div>`);
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart, id, isDark, mounted]);

  return (
    <div className="my-6 overflow-x-auto">
      {!svg && <div className="h-16 w-full animate-pulse bg-fd-muted/20 rounded" />}
      <div
        ref={ref}
        className="mermaid"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ display: svg ? 'block' : 'none' }}
      />
    </div>
  );
}

export default Mermaid; 
