#!/usr/bin/env python3
"""Extract the square tile positions and labels from the pinned krmap SVG."""

import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET


root = Path(__file__).resolve().parents[1]
source = root / 'src/regions/reference/krmap-sido-tiles.svg'
destination = root / 'src/regions/krmap-tiles.ts'
svg = {'svg': 'http://www.w3.org/2000/svg'}


def outputs():
    document = ET.parse(source)
    paths = document.findall("svg:g[@id='지역']/svg:path", svg)
    labels = document.findall("svg:g[@id='지명']/svg:text", svg)
    squares = {}
    for path in paths:
        name = path.attrib['id']
        x1, y1, x2, top, right, y2, left, bottom = map(
            float, path.attrib['d'].translate(str.maketrans({'M': ' ', 'L': ' ', 'Z': ' '})).split()
        )
        if (x1, y1, x2, y2) != (left, top, right, bottom) or abs((x2 - x1) - (y2 - y1)) > .2:
            raise ValueError(f'Expected a square tile for {name}')
        label, = [entry.text for entry in labels if
                  x1 < float(entry.attrib['x']) < x2 and y1 < float(entry.attrib['y']) < y2]
        squares[name] = (x1, y1, label)

    xs = sorted({x for x, _, _ in squares.values()})
    ys = sorted({y for _, y, _ in squares.values()})
    if (len(paths), len(squares), len(labels), len(xs), len(ys)) != (16, 16, 16, 4, 6):
        raise ValueError('Expected the 16-region edition of the krmap square tile map')

    lines = ['// Generated from reference/krmap-sido-tiles.svg by scripts/krmap-tiles.py.',
             'export const krmapTiles = {']
    positions = sorted(squares.items(), key=lambda tile: (tile[1][1], tile[1][0]))
    for name, (x, y, label) in positions:
        key = json.dumps(name, ensure_ascii=False)
        text = json.dumps(label, ensure_ascii=False)
        lines.append(f'  {key}: {{ shortName: {text}, row: {ys.index(y) + 1}, col: {xs.index(x) + 1} }},')
    return '\n'.join([*lines, '} as const;', ''])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='verify the committed coordinates')
    result = outputs()
    if parser.parse_args().check:
        if not destination.is_file() or destination.read_text(encoding='utf-8') != result:
            raise SystemExit('Run python3 scripts/krmap-tiles.py to regenerate the tiles.')
    else:
        destination.write_text(result, encoding='utf-8')
