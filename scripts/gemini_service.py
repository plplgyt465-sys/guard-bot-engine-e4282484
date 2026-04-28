import requests
import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys

URL = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate"

HEADERS = {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "x-same-domain": "1",
}


def build_payload(prompt):
    inner = [
        [prompt, 0, None, None, None, None, 0],
        ["en-US"],
        ["", "", "", None, None, None, None, None, None, ""],
        "", "", None, [0], 1, None, None, 1, 0,
        None, None, None, None, None, [[0]], 0
    ]

    outer = [None, json.dumps(inner)]

    return urllib.parse.urlencode({
        "f.req": json.dumps(outer)
    }) + "&"


def parse_response(text):
    text = text.replace(")]}'", "")
    best = ""

    for line in text.splitlines():
        if "wrb.fr" not in line:
            continue

        try:
            data = json.loads(line)
        except:
            continue

        entries = []
        if isinstance(data, list):
            if data[0] == "wrb.fr":
                entries = [data]
            else:
                entries = [i for i in data if isinstance(i, list) and i[0] == "wrb.fr"]

        for entry in entries:
            try:
                inner = json.loads(entry[2])

                if isinstance(inner, list) and isinstance(inner[4], list):
                    for c in inner[4]:
                        if isinstance(c, list) and isinstance(c[1], list):
                            txt = "".join([t for t in c[1] if isinstance(t, str)])
                            if len(txt) > len(best):
                                best = txt
            except:
                continue

    return best.strip()


def ask(prompt):
    try:
        payload = build_payload(prompt)
        res = requests.post(URL, headers=HEADERS, data=payload, timeout=30)
        
        if res.status_code != 200:
            return f"خطأ: الخادم أرجع الكود {res.status_code}"

        response = parse_response(res.text)
        return response or "لم يحصل على رد"
    except Exception as e:
        return f"خطأ: {str(e)}"


class GeminiHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/ask":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                prompt = data.get('prompt', '')
                
                if not prompt:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'prompt required'}).encode())
                    return
                
                response = ask(prompt)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'response': response}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress logging


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
    server = HTTPServer(('0.0.0.0', port), GeminiHandler)
    print(f"Gemini Service running on port {port}...")
    server.serve_forever()
