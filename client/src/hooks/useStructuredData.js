import { useEffect } from 'react';

export default function useStructuredData(id, data) {
  useEffect(() => {
    if (!data) return undefined;

    const scriptId = `structured-data-${id}`;
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      script?.remove();
    };
  }, [data, id]);
}
