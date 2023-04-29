from cv2 import KeyPoint
from zmq import NULL
from ultralytics import YOLO
import cv2
import math
import numpy as np
import supervision as sv

points = {"Nose":0,"Left Eye":1,"Right Eye":2,"Left Ear":3,"Right Ear":4,"Left Shoulder":5,"Right Shoulder":6,"Left Elbow":7,"Right Elbow":8
                 ,"Left Wrist":9,"Right Wrist":10,"Left Hip":11,"Right Hip":12,"Left Knee":13,"Right Knee":14,"Left Ankle":15,"Right Ankle":16}

# calculates the distance between 2 
def calculate_keypoint_distance(keypoints, keypoint_a, keypoint_b):
    if keypoints[points[keypoint_a]][2]>conf and keypoints[points[keypoint_b]][2]>conf:
        return math.dist(keypoints[points[keypoint_a]][:2], keypoints[points[keypoint_b]][:2])
    return -1

# calculating the length of the torso
def calculate_torso_length(keypoints):
    
    # calculating the distance between the left shoulder and left hip
    lslh = calculate_keypoint_distance(keypoints,"Left Shoulder","Left Hip")
   
    #  calculating the distance between the right shoulder and right hip
    rsrh = calculate_keypoint_distance(keypoints,"Right Shoulder","Right Hip")

    # calculating the length of the torso
    if rsrh!=-1 and lslh != -1:
        torso_length = (lslh+rsrh)/2
        return torso_length
    else:
        return -1

# calculating the length of the limbs 
def calculate_limb_length(keypoints):
    # --------------- right arm ----------------------------
    # calculating the distance between the right shoulder and right elbow
    rsre = calculate_keypoint_distance(keypoints,"Right Shoulder","Right Elbow")
    
    # calculating the distance between the right elbow and right wrist
    rerw = calculate_keypoint_distance(keypoints,"Right Elbow","Right Wrist")
    
    # calculating the right arm
    if rsre != -1 and rerw != -1:
        right_arm_length = rsre+rerw
    else:
        right_arm_length = -1
    
    # ----------------------- left arm ------------------------------
    # calculating the distance between the left shoulder and left elbow
    lsle = calculate_keypoint_distance(keypoints,"Left Shoulder","Left Elbow")
    
    # calculating the distance between the left elbow and left wrist
    lelw = calculate_keypoint_distance(keypoints,"Left Elbow","Left Wrist")
    
    # calculating the left arm
    if lsle != -1 and lelw != -1:
        left_arm_length = lsle + lelw
    else:
        left_arm_length = -1
        
    # --------------- right leg ----------------------------
    # calculating the distance between the right hip and right knee
    rhrk = calculate_keypoint_distance(keypoints,"Right Hip","Right Knee")
    
    # calculating the distance between the right knee and right ankle
    rkra = calculate_keypoint_distance(keypoints,"Right Knee","Right Ankle")
    
    # calculating the right arm
    if rhrk != -1 and rkra != -1:
        right_leg_length = rhrk+rkra
    else:
        right_leg_length = -1
    
    # ----------------------- left leg ------------------------------
    # calculating the distance between the left hip and left knee
    lhlk = calculate_keypoint_distance(keypoints,"Left Hip","Left Knee")
    
    # calculating the distance between the left knee and left ankle
    lkla = calculate_keypoint_distance(keypoints,"Left Knee","Left Ankle")
    
    # calculating the left arm
    if lhlk != -1 and lkla != -1:
        left_leg_length = lhlk + lkla
    else:
        left_leg_length = -1
        
    return [right_arm_length, left_arm_length, right_leg_length, left_leg_length]

# calculating the size of the head
def calculate_head_size(keypoints):
    pass

def child_or_adult(img, box):
    cropped_image =  img[box[0]:box[1], box[2]:box[3],:]
    output = pose_model.predict(cropped_image)[0]
    keypointsImage = output.plot()

    # evey key point is in the format of [x,y, clf]
    for out in output:
        keypoints = out.keypoints.tolist()
        torso = calculate_torso_length(keypoints)
        limbs = calculate_limb_length(keypoints)
        head = calculate_head_size(keypoints)
        # for num, point in enumerate(out.keypoints.tolist()):
        #     print(f"{points[num]}: x-{point[0]}. y-{point[1]}. clf={point[2]}")
        #     if point[2]>0.5:
        #         cv2.circle(cropped_image, [int(point[0]), int(point[1])], 5, (0, 0, 255), -1)
    
    cv2.imshow("cropped", keypointsImage)
    cv2.waitKey(1)
    pass


def predict(source, model, img):
    # getting the predictions 
    output = model.predict(source, agnostic_nms=True)[0]
    
    boxes, masks = output.boxes, output.masks
    
    # we don't want the bounding box of the pool
    if model.names[0] != 'pool':   
        # addig the bounding boxes to the image
        for box in boxes.data:
            x1 , y1, x2, y2, score, label = box
            
            if label != 0 or score<0.45:
                continue
            child_or_adult(source, [int(y1),int(y2),int(x1),int(x2)])
            cv2.rectangle(img,(int(x1), int(y1)), (int(x2), int(y2)), color=(0,0,0), thickness=3, lineType=cv2.LINE_AA)

    # if there are no masks
    if masks == None:
        return img
    
    # adding the polygon to the image
    for mask in masks.segments:
        # normalizing the mask coordinates
        mask = np.matrix.round(mask * np.array([img.shape[1],img.shape[0]]))
        # adding the polygon
        cv2.fillPoly(img, pts = np.int32([mask]), color =(0,100,0,0.5))

    return img



def onVideo(source):
    if source == "0":
        cap = cv2.VideoCapture(int(source))
    else:
        cap = cv2.VideoCapture(source)
    if cap.isOpened() == False:
        print("error on opening file....")
        return
    
    predict_every = 0
    (success, image) = cap.read()
    while success:
        # predict every third frame to keep it in real time
        if predict_every != 3:
            predict_every += 1
            (success, image) = cap.read()
            continue
        predict_every = 0
        
        # getting the predictions of the pool and people and adding to image
        display_image = predict(image, model_pool, image)
        display_image = predict(image, model_person, display_image)
        
        # showing the image
        cv2.imshow("Result", display_image)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

        (success, image) = cap.read()   
    cv2.destroyAllWindows()



if __name__ == "__main__":
    print("loading models.....")
    pose_model = YOLO("yolov8m-pose.pt")
    model_pool = YOLO("poolm.pt")
    model_person = YOLO("yolov8m.pt")
    print("finished loading models")
    
    conf = 0.5
    
    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=2,
        text_scale=1
    )
    onVideo("vid.mp4")