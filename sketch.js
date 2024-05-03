let bodypix;
let video;
let segmentation;
let isWhiteBackground = false; 
let pose;
let skeleton;
let count=0;
let distance;
let girl;


const options = {
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5
};

function preload() {
  bodypix = ml5.bodyPix(options);
  scream=loadImage('scream.jpg');
  girl=loadImage('assets/header.png')
}

function setup() {
  createCanvas(320, 240);
  // load up your video
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);
  console.log("ml5 version:", ml5.version);
}
function gotPoses(poses) {
//  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function videoReady() {
  bodypix.segment(video, gotPixResults);
}

function draw() {
    if(count>100){
      count=0
    }
   if (!isWhiteBackground) {
    background(255,255,255); // 设置背景为白色
     image(video, 0, 0, width, height);
  } else {
    // video.hide();
    clear();
    background(0,0,0)
     image(girl, 0.2*width, -0.1*height, width*0.6, height);
    // image(scream, 0, 0, width, height);
    if(segmentation){
      image(segmentation.backgroundMask, 0, 0, width, height);
    }
      
  }
  if (segmentation) {
    // image(segmentation.backgroundMask, 0, 0, width, height);
  }
  if(pose){
    // console.log(pose.rightWrist);
    if(count<50){
      distance=dist(pose.rightWrist.x,pose.rightWrist.y,pose.leftWrist.x,pose.leftWrist.y)
    }
        let side=0.5*(pose.leftEye.x+pose.rightEye.x)    
    console.log(pose.nose.x)
    if(pose.nose.x<side-5){
//       console.log(pose.leftEye)
//       // clear();
//      // image(scream, 0, 0, width, height);
      background(0,0,0);
    if(segmentation){
      image(segmentation.backgroundMask, 0, 0, width, height);
      image(girl,pose.leftEye.x-110, pose.leftEye.y-100, width*0.6, height)
      }
    }  
    // console.log(distance)
    //   ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    if(distance<150 &&pose.rightWrist.confidence>0.08&&pose.leftWrist.confidence>0.08){
      // console.log(pose.leftEye)
      // clear();
     image(scream, 0, 0, width, height);
      
    if(segmentation){
      image(segmentation.backgroundMask, 0, 0, width, height);
      // image(girl,pose.leftEye.x-110, pose.leftEye.y-100, width*0.6, height)
    }
//   
      
      
    }
    
        
  }
  count+=1;
}


function mousePressed() {
  isWhiteBackground = !isWhiteBackground;  // 切换背景颜色状态
}



function modelReady() {
  console.log("Model Loaded: PoseNet");
}

function gotPoseResults(newPoses) {
  poses = newPoses;
}


function gotPixResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  segmentation = result;
  bodypix.segment(video, gotPixResults);
}