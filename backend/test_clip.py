import traceback
import io
import sys
from PIL import Image

sys.path.append('.')
from classifier import classify_image_bytes

img = Image.new('RGB', (100, 100), color='red')
buf = io.BytesIO()
img.save(buf, format='JPEG')
byte_im = buf.getvalue()

try:
    print(classify_image_bytes(byte_im))
except Exception as e:
    traceback.print_exc()
