"""
Vercel entrypoint: expose the Flask app from backend.
Vercel looks for app.py, src/app.py, etc. This file allows detection when the app lives in backend/.
"""
import sys
import os

# Ensure backend is on the path when running from repo root
_root = os.path.dirname(os.path.abspath(__file__))
_backend = os.path.join(_root, "backend")
if _backend not in sys.path:
    sys.path.insert(0, _root)

from backend.app import app
