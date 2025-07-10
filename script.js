async function check() {
  const input = document.getElementById('cc-input').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const cards = input.split('\n').map(c => c.trim()).filter(Boolean);

  for (const card of cards) {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-card';
    wrapper.textContent = `Checking ${card}...`;
    resultsDiv.appendChild(wrapper);

    try {
      const res = await fetch('https://web-cc.marinaaqua366.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: card })
      });

      const json = await res.json();

      wrapper.classList.add(
        json.status?.toLowerCase() === 'live' ? 'live' :
        json.status?.toLowerCase() === 'die' ? 'die' :
        json.status?.toLowerCase() === 'unknown' ? 'unknown' : 'error'
      );

      wrapper.innerHTML = `
        <div><span class="label">Card:</span> ${json.card}</div>
        <div><span class="label">Status:</span> ${json.status} | ${json.message}</div>
        <div><span class="label">Bank:</span> ${json.bank}</div>
        <div><span class="label">Type:</span> ${json.type} - ${json.category} - ${json.brand}</div>
        <div><span class="label">Country:</span> ${json.country} ${json.emoji || ''}</div>
      `;
    } catch (err) {
      wrapper.className = 'result-card error';
      wrapper.innerHTML = `<strong>${card}</strong> → <b>Error</b><br><small>${err.message}</small>`;
    }
  }
}
