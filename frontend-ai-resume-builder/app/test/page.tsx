export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Test Page Works!</h1>
      <p>If you see this, basic routing is working.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  )
}
