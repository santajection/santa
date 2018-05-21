#!/bin/sh

dirs="santa1 santa2 santa3 santa4 down1 down2 down3 down4 up1 up2 up3 up4 warp1 warp2 warp3 warp4"

ratio="25%"

for dir in $dirs
do
  # mkae dir if not exist
  to_dir="${dir}s"
  if [ ! -e "$to_dir" ]; then
    mkdir "$to_dir"
    echo "create $to_dir"
  fi
  for f in $dir/*.png
  do
    echo "convert $f -resize ${ratio} ${to_dir}/${f#*/}"
    convert "$f" -resize ${ratio} "${to_dir}/${f#*/}"
  done
done