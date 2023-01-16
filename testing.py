from yolov8.ultralytics import YOLO
import cv2
import numpy as np

def predict_pool(image):
    model = YOLO("pool.pt")
    outputs = model.predict(source=image, return_outputs=True) # treat predict as a Python generator
    return add_layers_to_image(outputs, image)
      

def add_layers_to_image(outputs, img):
    for output in outputs:
        print("i am ",output," now bow")
        if output == {}:
            continue
        # for detection
        for x in output["det"]:
            x1 , y1, x2, y2, score, label = x
            if label != 0:
                continue
            cv2.rectangle(img,(int(x1), int(y1)), (int(x2), int(y2)), color=0, thickness=2, lineType=cv2.LINE_AA)
        # for segmentation
        for x in output["segment"]:
            x = np.matrix.round(x)
            cv2.fillPoly(img, pts = np.int32([x]), color =(0,100,0))

    return img



def onVideo(source):
    cap = cv2.VideoCapture(source)
    if cap.isOpened() == False:
        print("error on opening file....")
        return
    
    (success, image) = cap.read()
    while success:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_display = predict_pool(image)
        cv2.imshow("Result", image_display)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

        (success, image) = cap.read()    
    cv2.destroyAllWindows()



if __name__ == "__main__":
    onVideo("vidtest.mp4")