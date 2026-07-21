import shutil
import os

src_dir = 'c:/Users/SWATHI/Documents/Projects/DA'
dest_dir = 'c:/Users/SWATHI/Documents/Projects/DA/Deep-Annotate'

files_to_copy = [
    ('components/hero.html', 'components/hero.html'),
    ('css/hero.css', 'css/hero.css'),
    ('js/hero.js', 'js/hero.js')
]

for src_path, dest_path in files_to_copy:
    src = os.path.join(src_dir, src_path)
    dest = os.path.join(dest_dir, dest_path)
    
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(src, dest)
        print(f"Copied {src_path} to {dest_path}")
    else:
        print(f"Source file not found: {src}")

print("Copy completed.")
