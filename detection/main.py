from ultralytics import YOLO
import cv2
import numpy as np
import supervision as sv


def child_or_adult(img, box):
    cropped_image =  img[box[0]:box[1], box[2]:box[3],:]
    cv2.imshow("cropped", cropped_image)
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
    model_pool = YOLO("poolm.pt")
    model_person = YOLO("yolov8m.pt")
    
    if source == "0":
        cap = cv2.VideoCapture(int(source))
    else:
        cap = cv2.VideoCapture(source)
    if cap.isOpened() == False:
        print("error on opening file....")
        return
    
    every_fith = 0
    (success, image) = cap.read()
    while success:
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
    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=2,
        text_scale=1
    )
    onVideo("vid.mp4")