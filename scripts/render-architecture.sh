#!/bin/sh
set -eu

repo=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
diagrams="$repo/docs/diagrams"
font=${TTAGONG_DIAGRAM_FONT:-sans-serif}

render() {
  name=$1
  shift
  theme_source=$(mktemp)
  sed -e "s/@CANVAS@/$1/g" -e "s/@INK@/$2/g" -e "s/@BORDER@/$3/g" \
      -e "s/@SURFACE@/$4/g" -e "s/@EDGE@/$5/g" -e "s/@ACCENT@/$6/g" \
      -e "s/@ACCENT_BORDER@/$7/g" "$diagrams/architecture.dot" > "$theme_source"

  for extension in svg png; do
    if ! dot -Gfontname="$font" -Nfontname="$font" -Efontname="$font" \
        -T"$extension" -o "$diagrams/$name.$extension" "$theme_source"; then
      rm -f "$theme_source"
      return 1
    fi
  done
  rm -f "$theme_source"
}

render architecture '#fffefa' '#282421' '#d8cfc5' '#ffffff' '#756457' '#fff0c4' '#caa85c'
render architecture-dark '#171615' '#fcf3e7' '#62594d' '#262322' '#ceb7a2' '#45351d' '#9b7943'
