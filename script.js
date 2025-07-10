async function check() {
  const input = document.getElementById('cc-input').value;
  const resultsDiv = document.getElementById('results');
  const statsDiv = document.getElementById('stats');
  const checkBtn = document.getElementById('check-btn');

  resultsDiv.innerHTML = '';
  statsDiv.innerHTML = '⏳ Sedang mengecek...';
  checkBtn.disabled = true;

  const cards = input.split('\n').map(c => c.trim()).filter(Boolean);

  let live = 0, die = 0, unknown = 0, error = 0;

  for (const card of cards) {
    const wrapper = document.createElement('div');
    wrapper.className = 'result-card';
    wrapper.textContent = `Checking ${card}...`;
    resultsDiv.appendChild(wrapper);

    try {
      const res = await fetch('https://YOUR-WORKER.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: card })
      });

      const json = await res.json();

      let cls = 'unknown';
      if (json.status?.toLowerCase() === 'live') {
        cls = 'live'; live++;
      } else if (json.status?.toLowerCase() === 'die') {
        cls = 'die'; die++;
      } else if (json.status?.toLowerCase() === 'unknown') {
        cls = 'unknown'; unknown++;
      }

      wrapper.classList.add(cls);
      wrapper.innerHTML = `
        <div><span class="label">Card:</span> ${json.card}</div>
        <div><span class="label">Status:</span> ${json.status} | ${json.message}</div>
        <div><span class="label">Bank:</span> ${json.bank}</div>
        <div><span class="label">Type:</span> ${json.type} - ${json.category} - ${json.brand}</div>
        <div><span class="label">Country:</span> ${json.country} ${json.emoji || ''}</div>
      `;
    } catch (err) {
      error++;
      wrapper.className = 'result-card error';
      wrapper.innerHTML = `<strong>${card}</strong> → <b>Error</b><br><small>${err.message}</small>`;
    }

    // Update statistik real-time
    statsDiv.innerHTML = `
      ✅ Live: ${live} | ❌ Die: ${die} | ❔ Unknown: ${unknown} | ⚠️ Error: ${error} <br>
      📊 Total dicek: ${live + die + unknown + error} / ${cards.length}
    `;
  }

  checkBtn.disabled = false;
}
