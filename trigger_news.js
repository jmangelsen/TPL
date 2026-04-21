fetch('http://localhost:3000/api/news/refresh', { method: 'POST' }).then(res => res.json()).then(console.log).catch(console.error);
