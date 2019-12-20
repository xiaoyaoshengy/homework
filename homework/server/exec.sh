#!/bin/sh
export PATH=/home/ubuntu/anaconda3/bin:$PATH
export PYTHONPATH=/home/ubuntu/models/research:/home/ubuntu/models/research/slim:$PYTHONPATH
python3 /home/ubuntu/dataset/detect.py