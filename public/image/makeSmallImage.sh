#!/bin/sh

dirs="santa1 santa2 santa3 santa4 down1 down2 down3 down4 up1 up2 up3 up4"

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
# for f in santa4/*.png                                                                       (git)-[special_move] - (m3)kg86dev@gmail.com
# convert $f -resize 25% santas4/${f#*/}