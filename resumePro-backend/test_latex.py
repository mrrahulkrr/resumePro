import requests
import json

latex_content = r"""\documentclass{article}
\begin{document}
Hello World - LaTeX Test
\end{document}"""

print("=" * 50)
print("LATEX COMPILATION SERVICE TEST")
print("=" * 50)

# Test: latex.ytotech.com (free, open-source)
print("\nTesting latex.ytotech.com...")
try:
    response = requests.post(
        'https://latex.ytotech.com/builds/sync',
        json={
            'compiler': 'pdflatex',
            'resources': [
                {'main': True, 'content': latex_content}
            ]
        },
        headers={'Content-Type': 'application/json'},
        timeout=60
    )
    print(f"Status: {response.status_code}")
    print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
    print(f"Content-Length: {len(response.content)} bytes")
    
    if response.status_code in [200, 201] and response.content[:4] == b'%PDF':
        print("✅ SUCCESS: Valid PDF received!")
        with open("test_ytotech.pdf", "wb") as f:
            f.write(response.content)
        print("   Saved to test_ytotech.pdf")
    else:
        print(f"❌ Failed: {response.text[:200]}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")

print("\n" + "=" * 50)
