// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
let video;
let poseNet;
let pose;
let skeleton;
//let poseList = {};
let temp_list = [];
let numPoses = 0
let numKeyPoints = 0
let keyPoint;
let endPose;
let partsList = ["nose", "leftEye", "rightEye", "leftEar", "rightEar", "leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"]
let poseList = {"nose":{"x":[], "y":[]}, "leftEye":{"x":[], "y":[]}, "rightEye":{"x":[], "y":[]}, "leftEar":{"x":[], "y":[]}, "rightEar":{"x":[], "y":[]}, "leftShoulder":{"x":[], "y":[]}, "rightShoulder":{"x":[], "y":[]}, "leftElbow":{"x":[], "y":[]}, "rightElbow":{"x":[], "y":[]}, "leftWrist":{"x":[], "y":[]}, "rightWrist":{"x":[], "y":[]}, "leftHip":{"x":[], "y":[]}, "rightHip":{"x":[], "y":[]}, "leftKnee":{"x":[], "y":[]}, "rightKnee":{"x":[], "y":[]}, "leftAnkle":{"x":[], "y":[]}, "rightAnkle":{"x":[], "y":[]}}
numKeyPoints = partsList.length

//for(var i = 0; i< numKeyPoints; i++) {
//	poseList[partsList[i]] = {"x":[], "y":[]}
//}
//var poseList = partsList.reduce(function(obj, x) {
//    obj[key_maker(x)] = {"x":[], "y":[]};
//    return obj;
//}, {});

// const mode = a => 
//           Object.values(
//             a.reduce((count, e) => {
//               if (!(e in count)) {
//                 count[e] = [0,e];
//               }
//               count[e][0]++;
//               return count;
//             }, {})
//           ).reduce((a,v) => v[0]<a[0]? a:v, [0, null])[1];
// ;

function mode (a){
  result = {}
  a.forEach(value=>{
    if (value in result){
      result.value += 1
    }
    else{
      result[value] = 1
    }
  })
  var maxFreq = 0;
  var ans = 0;
  for(val in result){
    if (result[val] > maxFreq){
      ans = val;
      maxFreq = result[val];
    }
  }
  return ans;
}

function avgposes(poses, poseList){
  numPoses = numPoses + 1
  // keyPoints = poses.keypoints
  // console.log("The received response is: ")
  //console.log("Poses", poses)
  //console.log(poseList, "PoseList")
  numResponse = poses.length
  for(var i=0;i<numResponse;i++){
  	keyPoints = poses[i]['pose']['keypoints']
  	receivedKeyPoints = keyPoints.length
	  for(var i = 0; i< receivedKeyPoints; i++) {
	    record = keyPoints[i]
	  	poseList[record['part']]['x'].push(record['position']['x'])
	  	poseList[record['part']]['y'].push(record['position']['y'])
	  	//console.log(poseList[record['part']]['x'])
	  	//console.log(poseList[record['part']]['y'])
	  	// console.log(poseList)
	  }	
  }
  // if (numPoses > 20){
  //   console.log(1/0)
  // }
  // console.log("Poses: ", numPoses)
  //console.log(poseList)
  if (numPoses > 20) {
  	console.log("Entered")
    endPose = JSON.parse(JSON.stringify(poseList));
    for(var i=0;i<numKeyPoints;i++){
    	endPose[partsList[i]]['x'] = mode(endPose[partsList[i]]['x'])
    	endPose[partsList[i]]['y'] = mode(endPose[partsList[i]]['y'])
    }
    //console.log(poseList)
    numPoses = 0
	  poseList = {"nose":{"x":[], "y":[]}, "leftEye":{"x":[], "y":[]}, "rightEye":{"x":[], "y":[]}, "leftEar":{"x":[], "y":[]}, "rightEar":{"x":[], "y":[]}, "leftShoulder":{"x":[], "y":[]}, "rightShoulder":{"x":[], "y":[]}, "leftElbow":{"x":[], "y":[]}, "rightElbow":{"x":[], "y":[]}, "leftWrist":{"x":[], "y":[]}, "rightWrist":{"x":[], "y":[]}, "leftHip":{"x":[], "y":[]}, "rightHip":{"x":[], "y":[]}, "leftKnee":{"x":[], "y":[]}, "rightKnee":{"x":[], "y":[]}, "leftAnkle":{"x":[], "y":[]}, "rightAnkle":{"x":[], "y":[]}}
    var raw = JSON.stringify(endPose);
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
    console.log(raw);
    var requestOptions = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/api/pose", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    // if (poses.length > 0) {
    //   pose = endPose[0].pose;
    //   skeleton = endPose[0].skeleton;
    // }
  }

}
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  // console.log(poses);
  // poses_list.push(poses[0].pose)
  // setTimeout(avgposes, 2000 ,poses)
  avgposes(poses, poseList)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
}


function modelLoaded() {
  console.log('poseNet ready');
  //console.log(poseList);
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}