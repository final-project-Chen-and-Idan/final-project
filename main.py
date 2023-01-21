from yolov8.ultralytics import YOLO
import cv2
import numpy as np

def predict_pool(source):
    model = YOLO("poolm.pt")
    outputs = model.predict(source=source, return_outputs=True) # treat predict as a Python generator
    return outputs

def predict_person(source):
    model = YOLO("yolov8m.pt")
    outputs = model.predict(source=source, return_outputs=True) # treat predict as a Python generator
    return outputs

      

def add_layers_to_image(output, img):
    # print(output)
    if not "det" in output:
        return img

    # for detection
    if not "segment" in output:    
        for x in output["det"]:
            x1 , y1, x2, y2, score, label = x
            if label != 0:
                continue
            cv2.rectangle(img,(int(x1), int(y1)), (int(x2), int(y2)), color=(100,100,100), thickness=5, lineType=cv2.LINE_AA)   
    # for segmentation
    else:
        if not "segment" in output:
            return img
        for x in output["segment"]:
            x = np.matrix.round(x)
            cv2.fillPoly(img, pts = np.int32([x]), color =(0,100,0,0.5))

    return img



def onVideo(pools, people, source):
    if source == "0":
        cap = cv2.VideoCapture(int(source))
    else:
        cap = cv2.VideoCapture(source)
    if cap.isOpened() == False:
        print("error on opening file....")
        return
    
    (success, image) = cap.read()
    for pool, person in zip(pools, people):
        if not success:
            break
        
        image_display = add_layers_to_image(pool, image)
        image_display = add_layers_to_image(person, image_display)
        cv2.imshow("Result", image_display)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

        (success, image) = cap.read()   
    cv2.destroyAllWindows()



if __name__ == "__main__":
    pool = predict_pool("vid.mp4")
    person = predict_person("vid.mp4")
    onVideo(pool, person, "vid.mp4")