import json

def geojson_to_svg():
    # Load GeoJSON
    with open('public/data/india_states.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Calculate bounding box of all coordinates
    min_lon, min_lat = 999.0, 999.0
    max_lon, max_lat = -999.0, -999.0
    
    features = data['features']
    for feat in features:
        geom = feat['geometry']
        coords = geom['coordinates']
        
        # Flatten helper
        def check_coords(c_list):
            nonlocal min_lon, min_lat, max_lon, max_lat
            for c in c_list:
                if isinstance(c[0], (int, float)):
                    lon, lat = c[0], c[1]
                    if lon < min_lon: min_lon = lon
                    if lon > max_lon: max_lon = lon
                    if lat < min_lat: min_lat = lat
                    if lat > max_lat: max_lat = lat
                else:
                    check_coords(c)
        check_coords(coords)
        
    print(f"GeoJSON Bounds: Lon [{min_lon}, {max_lon}], Lat [{min_lat}, {max_lat}]")
    
    # Map configuration
    width = 600
    height = 650
    padding = 20
    
    # Uniform scaling to preserve aspect ratio
    lon_range = max_lon - min_lon
    lat_range = max_lat - min_lat
    
    scale_x = (width - 2 * padding) / lon_range
    scale_y = (height - 2 * padding) / lat_range
    scale = min(scale_x, scale_y)
    
    # Adjust width/height based on actual scale
    map_width = lon_range * scale + 2 * padding
    map_height = lat_range * scale + 2 * padding
    
    def project(lon, lat):
        # lat is inverted because SVG y goes down
        x = (lon - min_lon) * scale + padding
        y = map_height - ((lat - min_lat) * scale + padding)
        return x, y
        
    svg_paths = []
    
    for feat in features:
        state_name = feat['properties'].get('ST_NM', 'Unknown')
        geom = feat['geometry']
        g_type = geom['type']
        coords = geom['coordinates']
        
        path_data = []
        state_min_x, state_min_y = 9999.0, 9999.0
        state_max_x, state_max_y = -9999.0, -9999.0
        
        def process_polygon(poly):
            nonlocal state_min_x, state_min_y, state_max_x, state_max_y
            sub_path = []
            for i, ring in enumerate(poly):
                ring_str = []
                for j, pt in enumerate(ring):
                    x, y = project(pt[0], pt[1])
                    if x < state_min_x: state_min_x = x
                    if x > state_max_x: state_max_x = x
                    if y < state_min_y: state_min_y = y
                    if y > state_max_y: state_max_y = y
                    
                    if j == 0:
                        ring_str.append(f"M{x:.2f},{y:.2f}")
                    else:
                        ring_str.append(f"L{x:.2f},{y:.2f}")
                ring_str.append("Z")
                sub_path.append(" ".join(ring_str))
            return " ".join(sub_path)
            
        if g_type == "Polygon":
            d = process_polygon(coords)
            path_data.append(d)
        elif g_type == "MultiPolygon":
            for poly in coords:
                d = process_polygon(poly)
                path_data.append(d)
                
        d_attribute = " ".join(path_data)
        
        # Centroid calculation for transform-origin zoom
        cx = (state_min_x + state_max_x) / 2
        cy = (state_min_y + state_max_y) / 2
        
        svg_paths.append({
            'name': state_name,
            'd': d_attribute,
            'cx': cx,
            'cy': cy
        })
        
    # Write to a JSON metadata file for easy JS load / inline render
    output = {
        'width': map_width,
        'height': map_height,
        'bounds': {
            'min_lon': min_lon, 'max_lon': max_lon,
            'min_lat': min_lat, 'max_lat': max_lat
        },
        'paths': svg_paths
    }
    
    with open('public/data/india_map_paths.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
        
    print(f"Generated public/data/india_map_paths.json with {len(svg_paths)} states.")

if __name__ == "__main__":
    geojson_to_svg()
