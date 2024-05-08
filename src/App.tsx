import { useEffect, useState } from "react";
import { codeToHtml } from 'shiki'
import { generate } from 'peggy';
import grammar from './search.peggy?raw';

export function App() {
  const [text, setText] = useState('');
  const [html, setHTML] = useState('');
  const [error, setError] = useState('');

  const getHTML = async () => {

    const parser = generate(grammar);

    try {
      const apiFilter = JSON.stringify(parser.parse(text, { allowedKeys: ['label', 'tag'] }), null, 2);
      console.log(apiFilter)

      const code = await codeToHtml(apiFilter, {
        lang: 'json',
        theme: 'vitesse-light'
      })

      setHTML(code);
      setError('');

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


  useEffect(() => {
   getHTML();
  }, [text]);
  

  return (
    <div>
      <h1>Cloud Manager - Full API Seach</h1>
      {error && <div style={{ backgroundColor: 'red', color: 'white', padding: 8 }}>{error}</div>}
      <div style={{ width: "100%", display: "flex", flexDirection: 'row', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Search Query</h2>
          <textarea style={{ width: 800, fontSize: '1rem', fontFamily: '"Lucida Console", "Menlo", "Monaco", "Courier"' }} value={text} onChange={(e) => setText(e.target.value)} />
          <h2>API Filter</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
