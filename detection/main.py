from cv2 import KeyPoint
from sympy import false
from zmq import NULL
from ultralytics import YOLO
import cv2
import math
import numpy as np
import supervision as sv


# ============================= child or adult area ================================

points = {"Nose":0,"Left Eye":1,"Right Eye":2,"Left Ear":3,"Right Ear":4,"Left Shoulder":5,"Right Shoulder":6,"Left Elbow":7,"Right Elbow":8
                 ,"Left Wrist":9,"Right Wrist":10,"Left Hip":11,"Right Hip":12,"Left Knee":13,"Right Knee":14,"Left Ankle":15,"Right Ankle":16}


#  ---------------------- calculating length and distances -----------------------
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
    
    # foundleft side
    if rsrh == -1 and lslh != -1:
        return lslh
    
    # found right side
    if rsrh != -1 and lslh == -1:
        return rsrh
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
        
    return {"right arm":right_arm_length, "left arm":left_arm_length,"right leg": right_leg_length,"left leg": left_leg_length}

# calculates the width between the shoulders
def calculate_sholders_width(keypoints):
    # calculating the shoulder width
    shoulders = calculate_keypoint_distance(keypoints,"Left Shoulder","Right Shoulder")
    
    if shoulders == -1:
        return -1
    
    return shoulders

# calculates the width between the hips
def calculate_hip_width(keypoints):
    # calculating the hip width
    hips = calculate_keypoint_distance(keypoints, "Left Hip", "Right Hip")
    
    if hips == -1:
        return -1
    
    return hips

# calculating an estimated height
def estimate_height(head, torso, limbs):
    # checking if there is a missing feture
    if head == -1 or torso == -1:
        return -1
    if limbs["right leg"] == -1 and limbs["left leg"] == -1:
        return -1
    
    # adding up the height 
    height  = head + torso

    # adding the leg length 
    if limbs["right leg"] == -1:
        height += limbs["left leg"]
    elif limbs["left leg"] == -1:
        height += limbs["right leg"]
    else:
        height += (limbs["right leg"] + limbs["left leg"]) / 2
    
    return height

# calculating the size of the head
def calculate_head_size(keypoints):
    return 0
    pass

# ---------------------- ratio estimations -----------------------

# calculate the ratio for a curtain type of limb
def limb_to_body_ratio(limbs, height, type):
    # missing height
    if height == -1:
        return -1
    
    # calculating the limb to body ratio for both limbs
    left = limbs["left "+ type] / height
    right = limbs["right "+ type] / height
    
    # if there are no limb mesurements
    if left < 0 and right < 0:
        return -1
    
    # if there isn't a left limb mesurement
    if left < 0:
        return right
    
    # if there isn't a right limb mesurement
    if right<0:
        return left
    
    # return the average limb to body ratio
    return (left + right)/2

# calculates if the leg to body ratio is for an adult or child
def leg_to_body_ratio(limbs, height):
    ratio = limb_to_body_ratio(limbs, height, "leg")
    
    if ratio == -1:
        return -1
    
    return 0

# calculates if the arm to body ratio is for an adult or child
def arm_to_body_ratio(limbs, height):
    ratio = limb_to_body_ratio(limbs, height, "arm")
    if ratio == -1:
        return -1
    return 0

# calculates if the head to body ratio is for an adult or child
def head_to_body_ratio(head, height):
    # missing feature
    if head == -1 or height == -1:
        return -1
    
    # calculating the ratio
    ratio = head / height
    return 0

def head_to_shoulder_ratio(head, shoulder):
    if head == -1 or shoulder == -1:
        return -1
    


# ------------------- child or adult main -----------------
# calculates if it is a child or adult
def child_or_adult(keypoints):
    
    # getting the mesurements 
    torso = calculate_torso_length(keypoints)
    limbs = calculate_limb_length(keypoints)
    head = calculate_head_size(keypoints)
    shoulders = calculate_sholders_width(keypoints)
    hips = calculate_hip_width(keypoints)
    height = estimate_height(head, torso, limbs)
    
    
    child , adult = 0, 0
    if height != -1:
        # running the ratio function that requie height
        function_array = (leg_to_body_ratio, arm_to_body_ratio, head_to_body_ratio)
        for i, func in enumerate(function_array):
            if i == 2:
                result = func(head, height)
            else:
                result = func(limbs, height)
                
            # updating the majority count
            match result:
                case 0:
                    child += 1
                case 1:
                    adult += 1
    
    # getting the answer from head to shoulder ratio
    result = head_to_shoulder_ratio(head, shoulders)
    match result:
        case 0:
            child += 1
        case 1:
            adult += 1
    
    # majority rules
    if child > adult:
        return 0
    if adult > child:
        return 1
    return -1

# ======================== detection area ================= 

def predict(source, model, img):
    # getting the predictions 
    output = model.predict(source, verbose=False, conf=0.45, boxes=False)[0]
    
    # handling the people detection
    if model.names[0] != 'pool':  
        # resetting the count from the last frame 
        child_num = 0
        adult_num = 0
        unknown_num = 0
        
        for key in output:
            # extracting the key points
            keypoints = key.keypoints.tolist()
            
            # cheking if the detected is a child or adult
            age = child_or_adult(keypoints)
            
            # hadling response
            match age:
                # child case
                case 0:
                    child_num += 1
                # adult case
                case 1:
                    adult_num += 1
                # inconclusive case
                case _:
                    unknown_num += 1 
                    
        # print(f"{child_num} children, {adult_num} adults, {unknown_num} unknown")
        return output.plot()
    # if there are no masks
    if output.masks == None:
        return img
    
    # adding the polygon to the image
    for mask in output.masks.xy:
        # adding the polygon
        cv2.fillPoly(img, pts = np.int32([mask]), color =(0,100,0,0.5))

    return img


# predicting on image (for testing)
def onImage(source):
    
    image = cv2.imread(source)
    
    # getting the predictions of the pool and people and adding to image
    display_image = predict(image, pose_model, image)
    display_image = predict(image, model_pool, display_image)
    
    # showing the image
    cv2.imshow("Result", display_image)

    cv2.waitKey(0)

# running the prediction on 
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
        if predict_every != 2:
            predict_every += 1
            (success, image) = cap.read()
            continue
        predict_every = 0
        
        # getting the predictions of the pool and people and adding to image
        display_image = predict(image, pose_model, image)
        # display_image = predict(image, model_pool, display_image)
        
        # showing the image
        cv2.imshow("Result", display_image)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

        (success, image) = cap.read()   
    cv2.destroyAllWindows()



if __name__ == "__main__":
    conf = 0.5
    
    print("loading models.....")
    
    pose_model = YOLO("weights/yolov8m-pose.pt")
    model_pool = YOLO("weights/poolm.pt")
    # model_person = YOLO("weights/yolov8m.pt")
    
    print("finished loading models")
    
    # loading video
    # onVideo("vid.mp4")
    # onVideo("0")
    # onVideo("test.mp4")
    current = 0
    for i in range(2,11):
        onImage("test_images/test"+str(i)+".jpg")
        current += 1