import re
import os

def migrate_file(filepath):
    print(f"Migrating {filepath}...")
    if not os.path.exists(filepath):
        print(f"File {filepath} not found!")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Function to replace sw and sp class tokens inside class="..." attributes
    def repl_class(match):
        class_str = match.group(1)
        classes = class_str.split()
        new_classes = []
        for c in classes:
            if c == 'sw':
                new_classes.append('section-wrap')
            elif c == 'sp':
                new_classes.append('section-pad')
            else:
                new_classes.append(c)
        return f'class="{" ".join(new_classes)}"'

    content = re.sub(r'class="([^"]+)"', repl_class, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished migrating {filepath}.")

migrate_file('about.html')
migrate_file('blog.html')
