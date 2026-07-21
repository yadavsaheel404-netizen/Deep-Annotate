import re
with open('../india_states.svg', 'r', encoding='utf-8') as f:
    raw = f.read()
paths = re.findall(r'<path[^>]*\sd="(.*?)"[^>]*>', raw, re.DOTALL)
min_x, min_y, max_x, max_y = 9999, 9999, -9999, -9999
for p in paths:
    nums = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', p)]
    if nums:
        xs = nums[0::2]
        ys = nums[1::2]
        if xs: min_x = min(min_x, min(xs)); max_x = max(max_x, max(xs))
        if ys: min_y = min(min_y, min(ys)); max_y = max(max_y, max(ys))
print(f'BBox: min_x={min_x} min_y={min_y} max_x={max_x} max_y={max_y}')
