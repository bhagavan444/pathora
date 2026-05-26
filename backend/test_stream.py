import requests

url = "http://127.0.0.1:5000/api/v1/resume/analyze/stream"
files = {'resume': ('dummy.pdf', b'dummy content', 'application/pdf')}
data = {'domain': 'AI', 'interest': 'Backend', 'use_ai': 'true'}

try:
    with requests.post(url, files=files, data=data, stream=True) as r:
        for line in r.iter_lines():
            if line:
                print(line.decode('utf-8'))
except Exception as e:
    print(f"Request failed: {e}")
