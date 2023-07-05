from cv2 import KeyPoint
from ultralytics import YOLO
import cv2
import math
import tkinter as tk
from PIL import Image, ImageTk
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import messaging
import pygame

# variables
user_ref = None
email = None
active_token = None
amount_of_danger_frames = 0
conf = 0.5
amount_of_danger_frames = 0
amount_of_adult_frames = 0
doc_id = None

# =============================== tests =======================
#  testing the accuracy of the age detection
def age_test():
    for i in range(1, 12):
        print(i)
        strin = "./test_images/test"+str(i)+".jpg"
        onImage(strin)
        
# testing to see if the amount of people is right 
def amount_test():        
    for i in range(40):
        if i in [0, 28, 29, 30, 31, 32, 33]:
            continue
        print(i)
        strin = "./test_images/amount/test ("+str(i)+").jpeg"
        onImage(strin)


# ====================================== GUI ======================================

# the getting the email from the gui view point
def getEmail(event, label, entry, window):
    active_doc_id, active_email = get_account(label, entry)
    if(active_doc_id == -1):
        label.config(text = "invalid email")
        return
    
    # setting the global email 
    global email
    email = active_email
    
    global doc_id
    doc_id = active_doc_id
    
    # getting the active contacts
    global active_token
    active_token = get_active_tokens(user_ref, doc_id)
    
    window.destroy()  

# not showing the email warning when writing
def on_entry_change(event, label):
    label.config(text="")

# creating the window to connect
def create_email_window():
    window = tk.Tk()
    window.title("IC-Cam")
    window.geometry("400x300")
    window.grid_rowconfigure(0, weight=1)
    window.grid_columnconfigure(0, weight=1)
    
    connection_frame = tk.Frame(window, width=300, height=200)

    # Create a label
    label = tk.Label(connection_frame, text="Enter your email:")
    label.pack()

    # Create an entry field
    entry = tk.Entry(connection_frame)
    # entry.configure(height=3, width=50)
    entry.pack()
    
    # diplaying the error message
    error_message = tk.Label(connection_frame, text="", fg="red")
    error_message.pack()
    
    entry.bind("<Key>", lambda event: on_entry_change(event, error_message))
    entry.bind("<Return>", lambda event: getEmail(event, error_message, entry, window))
    
    # Create a button
    button = tk.Button(connection_frame, text="Connect", command= lambda : getEmail(None, error_message, entry, window))
    button.pack()
    
    # connection_frame.bind('<Return>', lambda : getEmail(error_message, entry, window))

        
    connection_frame.pack()
    connection_frame.grid(row=0, column=0, sticky="nsew")

    # Start the main event loop
    window.mainloop()

# ============================= Danger area ======================================
# calculates the distance to the pool
def distance_to_pool(child, pools):
    # when there are no pools
    if pools == [] :
        return -1
    
    # getting the location of the child
    child_box = child.boxes.xywh.tolist()[0]
    center = (child_box[0] ,child_box[1] + child_box[3]/2)
    
    # finding the two closest vertices
    closest_distance = np.Infinity
    closest_vertex = []
    second_closest_distance = np.Infinity
    second_closest_vertex = []
    
    # looping through the pools if there are a few
    for pool in pools:
        for vertex in pool:
            # calculating the distace to the vertex
            distance = math.dist(center, vertex)
            
            # found new closest vertex
            if distance < closest_distance:
                # updating the second colsest vertex
                second_closest_distance = closest_distance
                second_closest_vertex = closest_vertex
                # updataing the closest vertex
                closest_distance = distance
                closest_vertex = vertex
            
            # found a new second closest vertex
            elif distance < second_closest_distance:
                # updating the second colsest vertex
                second_closest_distance = distance
                second_closest_vertex = vertex
                
    # ----- calculating the distance between the child and the pool -------------
    # edge case where it is the same point
    if closest_vertex[0] == second_closest_vertex[0] and closest_vertex[1] == second_closest_vertex[1]:
        x = closest_vertex[0]
        y = closest_vertex[1]
    # edge case where the slope is inf
    elif closest_vertex[0] == second_closest_vertex[0]:
        x = closest_vertex[0]
        y = center[1]
    # edge case where the slope is 0
    elif closest_vertex[0] == second_closest_vertex[0]:
        x = center[0]
        y = closest_vertex[1]
        
    else:
        # finding the line equation for the two closest vertiecs
        slope = (closest_vertex[1] - second_closest_vertex[1]) / (closest_vertex[0] - second_closest_vertex[0])
        intercept  = closest_vertex[1] - np.multiply(slope, closest_vertex[0])
        
        # finding the line equation for the orthogonal line with the center
        center_slope = -1 / slope
        center_intercept = center[1] - np.multiply(center[0], center_slope)
        
        # find the dot that is in the intersect between both line
        x = (center_intercept - intercept) / (slope - center_slope)
        y = np.multiply(center_slope, x) + center_intercept
    
    # finding the distance from the child
    if (closest_vertex[0] < x and second_closest_vertex[0] < x)  or (closest_vertex[0] > x and second_closest_vertex[0] > x):
        pool_distance = closest_distance
    elif (closest_vertex[1] < y and second_closest_vertex[1] < y)  or (closest_vertex[1] > y and second_closest_vertex[1] > y):
        pool_distance = closest_distance
    else:
        pool_distance = math.dist((x,y), center)
    

    # returning the ratio of the distance to the child
    return pool_distance / child_box[3]            


# checks if there is danger
def check_danger(children, adult_num, unknown_num):
    global amount_of_adult_frames
    # there is an adult nearby to watch over them stop the alarm and return
    if adult_num > 0:
        amount_of_adult_frames += 1
        # making sure it wasn't a glitch
        if amount_of_adult_frames+1 > 3:   
            stop_alarm()
        return 
    
    amount_of_adult_frames = 0
    
    # no children no danger
    if len(children) == 0:
        return
    
    
    flag = False
    for child in children:
        if child < 1.5 and child != -1:
            flag = True
    
    global amount_of_danger_frames
    
    # signaling the danger
    if flag:
        amount_of_danger_frames += 1
        
        # making sure it wasn't a glitch
        if amount_of_danger_frames > 1:
            print("DANGER")
            send_notifications()
            play_alarm()
    else:
        amount_of_danger_frames = 0

# playing the alarm
def play_alarm():
    pygame.mixer.music.play(-1)  # -1 indicates infinite loop

# stopping the alarm
def stop_alarm():
    try:
        pygame.mixer.music.stop()
    except:
        print("no alarm is playing")
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
        torso_length = lslh if lslh > rsrh else rsrh
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
    # --------------- arm ----------------------------
    # calculating the distance between the right shoulder and right elbow
    rsre = calculate_keypoint_distance(keypoints,"Right Shoulder","Right Elbow")
    
    # calculating the distance between the left shoulder and left elbow
    lsle = calculate_keypoint_distance(keypoints,"Left Shoulder","Left Elbow")
    
    # calculating the distance between the right elbow and right wrist
    rerw = calculate_keypoint_distance(keypoints,"Right Elbow","Right Wrist")
    
    # calculating the distance between the left elbow and left wrist
    lelw = calculate_keypoint_distance(keypoints,"Left Elbow","Left Wrist")
    
    # getting the max length
    shoulder_2_elbow = lsle if lsle > rsre else rsre
    elbow_2_wrist = lelw if lelw > rerw else rerw
    
    
    # calculating the arm length
    if shoulder_2_elbow != -1 and elbow_2_wrist != -1:
        arm_length = shoulder_2_elbow + elbow_2_wrist
    else:
        arm_length = -1

        
    # ---------------- leg ----------------------------
    # calculating the distance between the right hip and right knee
    rhrk = calculate_keypoint_distance(keypoints,"Right Hip","Right Knee")
    
    # calculating the distance between the left hip and left knee
    lhlk = calculate_keypoint_distance(keypoints,"Left Hip","Left Knee")
    
    # calculating the distance between the right knee and right ankle
    rkra = calculate_keypoint_distance(keypoints,"Right Knee","Right Ankle")
    
    # calculating the distance between the left knee and left ankle
    lkla = calculate_keypoint_distance(keypoints,"Left Knee","Left Ankle")
    
    # getting the max length
    hip_2_knee = lhlk if lhlk > rhrk else rhrk
    knee_2_ankle = lkla if lkla > rkra else rkra
    
    # calculating the leg length
    if hip_2_knee != -1 and knee_2_ankle != -1:
        leg_length = hip_2_knee + knee_2_ankle
    else:
        leg_length = -1
        
    return {"arm":arm_length, "leg": leg_length}

# calculating the deitance between the ear and shoulder
def calculate_ear_to_shoulder_length(keypoints):
    # calculating the distance
    left_side = calculate_keypoint_distance(keypoints, "Left Ear", "Left Shoulder")
    right_side = calculate_keypoint_distance(keypoints, "Right Ear", "Right Shoulder")
    
    # no mesurments 
    if left_side == -1 and right_side == -1:
        return -1
    
    # no left side
    if left_side == -1:
        return right_side
    
    # no right side
    if right_side == -1:
        return left_side
    
    # average of both left and right
    return (left_side + right_side) / 2 

# calculates the width between the shoulders
def calculate_sholders_width(keypoints):
    # calculating the shoulder width
    shoulders = calculate_keypoint_distance(keypoints,"Left Shoulder","Right Shoulder")
    
    if shoulders == -1:
        return -1
    
    return shoulders

# calculating an estimated height
def estimate_height(head, torso, limbs):
    # checking if there is a missing feture
    if head == -1 or torso == -1:
        return -1
    if limbs["leg"] == -1:
        return -1
    
    # adding up the height 
    height  = head + torso + limbs["leg"]    
    return height

# calculating the size of the head
def calculate_head_size(keypoints):
    # Get the coordinates of the relevant keypoints
    nose = keypoints[points["Nose"]]
    left_eye = keypoints[points["Left Eye"]]
    right_eye = keypoints[points["Right Eye"]]
    if nose[2]<conf or left_eye[2]<conf or right_eye[2]<conf:
        return -1

    # Calculate the Euclidean distance between the eyes
    eye_distance = calculate_keypoint_distance(keypoints,"Left Eye", "Right Eye")
    if eye_distance == -1:
        return -1

    # Calculate the Euclidean distance between the nose and the midpoint between the eyes
    eye_midpoint = [(left_eye[0] + right_eye[0]) / 2, (left_eye[1] + right_eye[1]) / 2]
    nose_eye_distance = math.dist(nose[:2], eye_midpoint)

    # Estimate the head size as the average of the eye distance and nose-eye distance
    head_size = (eye_distance + nose_eye_distance) / 2

    return head_size

# ---------------------- ratio estimations -----------------------

# calculate the ratio for a curtain type of limb
def limb_to_body_ratio(limbs, height, type):
    # missing height
    if height == -1:
        return -1
    
    # calculating the limb to body ratio
    ratio = limbs[type] / height
    
    # if there are no limb mesurements
    if ratio < 0:
        return -1
    else:
        return ratio

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

# calculates if the head to body ratio is for an adult or child --------------------------------------- todo
def head_to_body_ratio(head, height):
    # missing feature
    if head == -1 or height == -1:
        return -1
    
    # calculating the ratio
    ratio = head / height
    return 0

# calculating the limb to torso ratio
def limb_to_torso_ratio(limbs, torso, type):
    # checking missing variables
    if torso == -1:
        return -1
    if limbs[type] == -1:
        return -1
    
    # calculating the limbs to torso ratio
    ratio = limbs[type] / torso
    return ratio

# calculates the arm to torso ratio
def arm_to_torso_ratio(limbs, torso):
    ratio = limb_to_torso_ratio(limbs, torso, "arm")
    # bad calculation 
    if ratio == -1:
        return -1
    
    # returning if child or adult
    if ratio < 0.93:
        return 0
    else:
        return 1

# calculates the leg to torso ratio   
def leg_to_torso_ratio(limbs, torso):
    ratio = limb_to_torso_ratio(limbs, torso, "leg")
    
    # bad calculation 
    if ratio == -1:
        return -1
    
    # returning if child or adult
    if ratio > 1.25:
        return 0
    else:
        return 1

#  calculating the ear to shoulder ratio
def ear_to_shoulder_ratio(ears, shoulder):
    # if there are missing features
    if ears == -1 or shoulder == -1:
        return -1 
    
    # invalid mesurements
    if ears > shoulder:
        return -1
    
    # the ratio
    ratio =  ears / shoulder
    
    if ratio < 0.73:
        return 0
    return 1
        
    
# ---------------------------------------------------------------------------------------------------- todo
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
    ears =  calculate_ear_to_shoulder_length(keypoints)
    shoulders = calculate_sholders_width(keypoints)
    height = estimate_height(head, torso, limbs)
    
    
    child , adult = 0, 0
    # running the ratio function that requie height
    function_array = (
                    # [leg_to_body_ratio, [limbs, height]],
                    #   [arm_to_body_ratio, [limbs, height]],
                    #   [head_to_body_ratio, [head, height]],
                    #   [head_to_shoulder_ratio, [head, shoulders]],
                      [leg_to_torso_ratio, [limbs, torso]],
                      [arm_to_torso_ratio, [limbs, torso]],
                    #   [ear_to_shoulder_ratio, [ears, shoulders]],
                    )
    for func in function_array:
        result = func[0](func[1][0], func[1][1])
            
        # updating the majority count
        match result:
            case 0:
                child += 1
            case 1:
                adult += 1

    # majority rules
    if child > adult:
        print("child")
        return 0
    if adult > child:
        print("adult")
        return 1
    return -1



# ======================== detection area ================= 
def predict(source, model, img=[], pools = []):
    # getting the predictions 
    output = model.predict(source, verbose=False, boxes=False)[0]
    
    # handling the people detection
    if model.names[0] != 'pool':  
        # resetting the count from the last frame 
        children = []
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
                    children.append(distance_to_pool(key, pools))
                # adult case
                case 1:
                    adult_num += 1
                # inconclusive case
                case _:
                    unknown_num += 1 
                    
        # for testing 
        # predicted_amount.append([child_num, adult_num, unknown_num])
        # print(f"{len(children)} children, {adult_num} adults, {unknown_num} unknown")
        check_danger(children, adult_num, unknown_num)
        return output.plot()
    
    # if there are no masks
    if output.masks == None:
        return img
    
    # adding the polygon to the image
    for mask in output.masks.xy:
        # adding the polygon
        pools.append(mask)
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

    cv2.waitKey(1)

# running the prediction on 
def onVideo(source):
    
    # loading the feed
    print("loading feed .......")
    
    if source == "0":
        cap = cv2.VideoCapture(int(source))
    else:
        cap = cv2.VideoCapture(source)
    if cap.isOpened() == False:
        print("error on opening file....")
        return
    
    print("feed loaded")
    
    predict_every = 0
    (success, image) = cap.read()
    while success:
        # predict every third frame to keep it in real time
        if predict_every != 3:
            predict_every += 1
            (success, image) = cap.read()
            continue
        predict_every = 0
        
        # holder for the pool detections
        pools = []
        
        # getting the predictions of the pool and people and adding to image
        display_image = predict(image, model_pool, img=image, pools=pools)
        display_image = predict(image, pose_model, pools=pools)
        
        # showing the image
        cv2.imshow("IC-Cam", display_image)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        # Check if the window is closed
        if cv2.getWindowProperty('IC-Cam', cv2.WND_PROP_VISIBLE) < 1:
            break
        
        (success, image) = cap.read()   
    cv2.destroyAllWindows()



# ============================= firebase area ==================================

# running all firebase functions
def setup_firebase():
    # connecting to the firebase
    global user_ref
    user_ref = connect_to_firebase()

# connecting to the firebase
def connect_to_firebase():
    # getting the credentials
    cred = credentials.Certificate("./firebase_key.json")
    
    # initializing the connection
    firebase_admin.initialize_app(cred)
    
    # connecting to the firestore
    db = firestore.client()
    
    # getting all the users
    users_ref = db.collection("Users")
    
    return users_ref

# logging into the account
def get_account(label, entry):

        email = entry.get().strip()

        # getting the refrences
        doc_id = get_doc_id(email, user_ref)
        
        # if the account was not found
        if doc_id == -1:
            return -1, -1
        else:
            print("connected")
            return doc_id , email

# returns the doc id for the account
def get_doc_id(email, users_ref):
    
    # getting the account details
    account_ref = users_ref.where("email","==", email)
    
    # returning the doc id for the account
    docs = account_ref.stream()
    for doc in docs:
        return doc.id
    return -1

# gets the list of notification tokens from the contacts
def get_active_tokens(user_ref, doc_id):
    # getting the users conrtact list
    doc = user_ref.document(doc_id).get()
    contacts = doc.to_dict()["contacts"]
    
    # # the token of the user
    # user_token =  doc.to_dict()["token"]
    
    # # active_tokens = [user_token]
    active_tokens = []
    
    # getting the token of each active contact
    for contact in contacts:
        # taking the token of the uesr who is active and not a request
        if contacts[contact]["active"] and not contacts[contact]["request"]:
            # getting the doc of the contact to get his token
            contact_id = get_doc_id(contact, user_ref)
            active_tokens.append(user_ref.document(contact_id).get().to_dict()["token"])
    
    return active_tokens

# sends push notifications to the active users
def send_notifications(type_of_danger = "child is alone near the pool"):

    message = messaging.MulticastMessage(
        tokens=active_token,
        android= messaging.AndroidConfig(
            priority= "high",
            
            notification= messaging.AndroidNotification(
                vibrate_timings_millis= [1000, 30000, 1000, 10000, 1000, 30000],
                title="DANGER",
                body=type_of_danger,
                visibility="public",
                channel_id= "ic-Cam",
                default_sound=False,
                sound="alarm",
            )
        )
        
    )
    
    response = messaging.send_multicast(message)
    # See the BatchResponse reference documentation
    # for the contents of response.
    print('{0} messages were sent successfully'.format(response.success_count))
    
    # in case it was not sent
    if response.success_count == 0:
        messaging.send_multicast(message)

# ============================= main =============================================

if __name__ == "__main__":
    print("loading models.....")
    
    pose_model = YOLO("weights/yolov8m-pose.pt")
    model_pool = YOLO("weights/poolm.pt")
    model_person = YOLO("weights/best.pt") 
    print("finished loading models")
    
    # loading the alarm
    pygame.mixer.init()
    pygame.mixer.music.load("./alarm.mp3")
    
    try:
        setup_firebase()
        
        create_email_window()

        # only if there is an account connected
        if email != None:
            # onVideo("vid.mp4")
            onVideo("0")
    
    
    except:
        print("an error occord")
    
    
    # age_test()
