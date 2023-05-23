from ultralytics import YOLO
import cv2
import math
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import messaging
from aiortc import RTCIceCandidate, RTCSessionDescription, MediaStreamTrack, RTCPeerConnection

pc = None

# class VideoStreamTrack(MediaStreamTrack):
#     kind = "video"

#     def __init__(self, track):
#         super().__init__()
#         self.track = track

#     async def recv(self):
#         return await self.track.recv()
    
# def connect_to_live_stream(email):
#     # Retrieve the live stream document from Firestore
#     db = firestore.client()
#     doc_ref = db.collection('LiveFeed').document(email)
#     doc = doc_ref.get()

#     if doc.exists:
#         offer_data = doc.to_dict()
#         offer_type = offer_data["offer"]['type']

#         if offer_type == 'offer':
#             # TODO: Retrieve the offer's candidates from the subcollection
#             candidates_ref = doc_ref.collection('candidates')
#             candidates = candidates_ref.get()

#             # Create the RTCPeerConnection
#             global pc
#             pc = RTCPeerConnection()

#             @pc.on("iceconnectionstatechange")
#             async def on_iceconnectionstatechange():
#                 if pc.iceConnectionState == "failed":
#                     await pc.close()
#                     pc = None

#                 # Process the offer
#                 offer = RTCSessionDescription(sdp=offer_data.get('sdp'), type=offer_data.get('type'))
#                 await pc.setRemoteDescription(offer)

#                 # Process the candidates
#                 for candidate in candidates:
#                     candidate_data = candidate.to_dict()
#                     ice_candidate = RTCIceCandidate(candidate=candidate_data.get('candidate'))
#                     await pc.addIceCandidate(ice_candidate)

#                 # Create an answer
#                 answer = await pc.createAnswer()
#                 await pc.setLocalDescription(answer)

#                 # Save the answer to Firestore
#                 answer_data = {
#                     'type': answer.type,
#                     'sdp': answer.sdp
#                 }
#                 doc_ref.set(answer_data)

#             # Start streaming
#             while True:
#                 print("Hello")
#                 # await asyncio.sleep(0)

#         else:
#             print('Invalid offer type')
#     else:
#         print('Document not found')


#  ======================== unit tests ============================
# a test to see if finds the right amount of people in the frame
# def test_amount_of_people():
#     print("testing amount of people")
    
#     for i in range(2,11):
#         img = cv2.imread("test_images/test"+str(i)+".jpg")
#         predict(img, pose_model, img)
        
#     true = [1] * 9
#     correct = 0
#     for i,j in zip(true, predicted_amount):
#         if i == np.sum(j):
#             correct += 1
    
#     correct_percent = correct / len(true)
    
#     assert correct_percent > 0.9 , "failed"
    
#     print("passesd")

# a test to see if recognizes it correctly as a child or adult
def recognize_child_or_adult():
    pass

# a test to see if the child is in danger
def danger():
    pass

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
    # no children no danger
    if len(children) == 0:
        return
    
    # there is an adult nearby to watch over them
    if adult_num > 0:
        return 
    
    flag = False
    for child in children:
        if child < 1:
            print("DANGER")
            flag = True
    
    if flag:
        signal_danger()
        send_notifications()
    pass

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

# calculating the limb to torso ratio
def limb_to_torso_ratio(limbs, torso, type):
    # checking missing variables
    if torso == -1:
        return -1
    if limbs["left " + type] == -1 and limbs["right " + type] == -1:
        return -1
    
    # calculating the limbs to torso ratio
    left_ratio = limbs["left "+ type] / torso
    right_ratio = limbs["right " + type] / torso
    
    ratio = -1

    # getting the average ratio
    if left_ratio < 0:
        ratio = right_ratio
    elif right_ratio < 0:
        ratio = left_ratio
    else:
        ratio = (left_ratio + right_ratio) / 2
    
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
    if ratio > 1.2:
        return 0
    else:
        return 1

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
    height = estimate_height(head, torso, limbs)
    
    
    child , adult = 0, 0
    # running the ratio function that requie height
    function_array = ([leg_to_body_ratio, [limbs, height]],
                      [arm_to_body_ratio, [limbs, height]],
                      [head_to_body_ratio, [head, height]],
                      [head_to_shoulder_ratio, [head, shoulders]],
                      [arm_to_torso_ratio, [limbs, torso]],
                      [leg_to_torso_ratio, [limbs, torso]])
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
        return 0
    if adult > child:
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
        cv2.imshow("Result", display_image)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

        (success, image) = cap.read()   
    cv2.destroyAllWindows()



# ============================= firebase area ==================================
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
def get_account():
    connected = False
    while not connected:
        email = input("enter your email: ")
        
        # no account and wants to stop the program
        if email == '0':
            return -1
        
        # getting the refrences
        doc_id = get_doc_id(email, user_ref)
        
        # if the account was not found
        if doc_id == -1:
            print("invalid email - you can enter 0 to stop the program")
        else:
            print("connected")
            return doc_id

# returns the doc id for the account
def get_doc_id(email, users_ref):
    
    # getting the account details
    account_ref = users_ref.where("email","==", email)
    
    # returning the doc id for the account
    docs = account_ref.stream()
    for doc in docs:
        return doc.id
    return -1

# signals the account that there is danger
def signal_danger():
    user_ref.document(doc_id).update({"danger" : True})

# gets the list of notification tokens from the contacts
def get_active_tokens():
    # getting the users conrtact list
    doc = user_ref.document(doc_id).get()
    contacts = doc.to_dict()["contacts"]
    
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
        notification=messaging.Notification(
            title = "DANGER",
            body = type_of_danger,
            image="image_url"
        ),
        tokens=active_token,
        android= messaging.AndroidConfig(
            priority= "high"
        )
        
    )
    response = messaging.send_multicast(message)
    # See the BatchResponse reference documentation
    # for the contents of response.
    print('{0} messages were sent successfully'.format(response.success_count))

# ============================= main =============================================
if __name__ == "__main__":
    # connecting to the firebase
    user_ref = connect_to_firebase()
    
    # getting the account refrence and doc id
    doc_id = get_account()
   
    # getting the active contacts
    active_token = get_active_tokens()    
    
    # connect_to_live_stream("idanbkideckel@gmail.com")
    
    conf = 0.5
    
    print("loading models.....")
    
    pose_model = YOLO("weights/yolov8m-pose.pt")
    model_pool = YOLO("weights/poolm.pt")
    # model_person = YOLO("weights/yolov8m.pt")
    
    print("finished loading models")
    
   
    # loading video
    onVideo("vid.mp4")
    # onVideo("vid1.mp4")
    # onVideo("0")
    # onVideo("test.mp4")
    
    # # print testing
    # current = 2
    # true_amount_of_people = [1]*9
    # predicted_amount = []
    # is_child = []
    # for i in range(2,12):
    #     onImage("test_images/test"+str(i)+".jpg")
    #     current += 1
        
    # predicted_amount = []
    # test_amount_of_people()
    
