# -*- coding: utf-8 -*-
import os
from PIL import Image
import time
import tensorflow as tf
from PIL import Image
import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import zipfile
import time

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
# plt.switch_backend('Agg')
import os
os.chdir('/home/ubuntu/models/research/object_detection')
from object_detection.utils import label_map_util

from object_detection.utils import visualization_utils as vis_util

PATH_TO_TEST_IMAGES = "/home/ubuntu/wechat/testimg/"
PATH_TO_CKPT = '/home/ubuntu/dataset/pb/frozen_inference_graph.pb'
PATH_TO_LABELS = '/home/ubuntu/dataset/pascal_label_map.pbtxt'
NUM_CLASSES = 24
PATH_TO_RESULTS = "/home/ubuntu/wechat/result/"


def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)


def save_object_detection_result():
    IMAGE_SIZE = (12, 8)
    # Load a (frozen) Tensorflow model into memory.
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        # loading ckpt file to graph
        with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')
    # Loading label map
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES,
                                                                use_display_name=True)
    category_index = label_map_util.create_category_index(categories)
    # Helper code
    with detection_graph.as_default():
        with tf.Session(graph=detection_graph) as sess:
            start = time.time()
            for test_image in os.listdir(PATH_TO_TEST_IMAGES):
                image = Image.open(PATH_TO_TEST_IMAGES + test_image)
                # the array based representation of the image will be used later in order to prepare the
                # result image with boxes and labels on it.
                image_np = load_image_into_numpy_array(image)
                # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                image_np_expanded = np.expand_dims(image_np, axis=0)
                image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
                # Each box represents a part of the image where a particular object was detected.
                boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
                # Each score represent how level of confidence for each of the objects.
                # Score is shown on the result image, together with the class label.
                scores = detection_graph.get_tensor_by_name('detection_scores:0')
                classes = detection_graph.get_tensor_by_name('detection_classes:0')
                num_detections = detection_graph.get_tensor_by_name('num_detections:0')
                # Actual detection.
                (boxes, scores, classes, num_detections) = sess.run(
                    [boxes, scores, classes, num_detections],
                    feed_dict={image_tensor: image_np_expanded})
                # Visualization of the results of a detection.
                vis_util.visualize_boxes_and_labels_on_image_array(
                    image_np,
                    np.squeeze(boxes),
                    np.squeeze(classes).astype(np.int32),
                    np.squeeze(scores),
                    category_index,
                    use_normalized_coordinates=True,
                    line_thickness=8)

                final_score = np.squeeze(scores)
                count = 0
                for i in range(100):
                    if scores is None or final_score[i] > 0.5:
                        count = count + 1
                print()
                print("the count of objects is: ", count)
                (im_width, im_height) = image.size
                for i in range(count):
                    # print(boxes[0][i])
                    y_min = boxes[0][i][0] * im_height
                    x_min = boxes[0][i][1] * im_width
                    y_max = boxes[0][i][2] * im_height
                    x_max = boxes[0][i][3] * im_width
                    x = int((x_min + x_max) / 2)
                    y = int((y_min + y_max) / 2)
                    if category_index[classes[0][i]]['name'] == "tower":
                        print("this image has a tower!")
                        y = int((y_max - y_min) / 4 * 3 + y_min)
                    print("object{0}: {1}".format(i, category_index[classes[0][i]]['name']),
                          ',Center_X:', x, ',Center_Y:', y)
                    # print(x_min,y_min,x_max,y_max)
                plt.figure(figsize=IMAGE_SIZE)
                plt.imshow(image_np)
                picName = test_image.split('/')[-1]
                # print(picName)
                plt.savefig(PATH_TO_RESULTS + picName)
                print(test_image + ' succeed')

            end = time.time()
            seconds = end - start
            print("Time taken : {0} seconds".format(seconds))


save_object_detection_result()