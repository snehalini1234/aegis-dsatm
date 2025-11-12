import React, { useEffect, useRef, useState } from 'react';

export default function BehaviorCapture() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const keystrokeBuffer = useRef({ keyDown: {}, keyDurations: [], interKey: [] });
  const lastKeyTime = useRef(null);
  const mouseBuffer = useRef({ lastPos: null, speedSamples: [], pathLength: 0 });

  function pushLog(msg) {
    setLogs(l => [
      `${new Date().toLocaleTimeString()} — ${msg}`,
      ...l
    ].slice(0,200));
  }

  useEffect(() => {
    if (!running) return;

    function onKeyDown(e) {
      const t = performance.now();
      keystrokeBuffer.current.keyDown[e.key] = t;
      if (lastKeyTime.current) keystrokeBuffer.current.interKey.push(t - lastKeyTime.current);
      lastKeyTime.current = t;
    }
    function onKeyUp(e) {
      const t = performance.now();
      const down = keystrokeBuffer.current.keyDown[e.key];
      if (down) {
        keystrokeBuffer.current.keyDurations.push(t - down);
        delete keystrokeBuffer.current.keyDown[e.key];
      }
    }

    function onMove(e) {
      const t = performance.now();
      const p = { x: e.clientX, y: e.clientY, t };
      const mb = mouseBuffer.current;
      if (mb.lastPos) {
        const dx = p.x - mb.lastPos.x;
        const dy = p.y - mb.lastPos.y;
        const dt = Math.max(1, p.t - mb.lastPos.t);
        const dist = Math.hypot(dx, dy);
        mb.speedSamples.push(dist / dt);
        mb.pathLength += dist;
      }
      mb.lastPos = p;
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMove);

    pushLog('Capture started');

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMove);
      pushLog('Capture stopped');
    };
  }, [running]);

  async function sendSample() {
    const payload = {
      keyDurations: keystrokeBuffer.current.keyDurations.slice(),
      interKey: keystrokeBuffer.current.interKey.slice(),
      speedSamples: mouseBuffer.current.speedSamples.slice(),
      pathLength: mouseBuffer.current.pathLength
    };
    pushLog(`Sending sample: kd=${payload.keyDurations.length} ik=${payload.interKey.length} sp=${payload.speedSamples.length}`);
    try {
      const res = await fetch('/api/profile/testuser', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const json = await res.json();
      pushLog(`Server response: ${json && json.profile ? 'OK' : JSON.stringify(json)}`);
    } catch (err) {
      pushLog('Send failed');
    }
  }

  function clearBuffers() {
    keystrokeBuffer.current = { keyDown: {}, keyDurations: [], interKey: [] };
    mouseBuffer.current = { lastPos: null, speedSamples: [], pathLength: 0 };
    lastKeyTime.current = null;
    pushLog('Buffers cleared');
  }

  return (
    <div className="card">
      <h1>Behavior Capture</h1>
      <p className="lead">Collects keystroke and mouse metrics for behavioral scoring (demo).</p>
      <div className="controls">
        <button className="btn" onClick={() => setRunning(r => !r)}>{running ? 'Stop' : 'Start'} capture</button>
        <button className="btn" onClick={sendSample}>Send sample</button>
        <button className="btn" onClick={clearBuffers}>Clear</button>
      </div>

      <div className="stats">
        <div className="stat">Keys captured: {keystrokeBuffer.current.keyDurations.length}</div>
        <div className="stat">Inter-key: {keystrokeBuffer.current.interKey.length}</div>
        <div className="stat">Mouse samples: {mouseBuffer.current.speedSamples.length}</div>
      </div>

      <div className="log" aria-live="polite">
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
