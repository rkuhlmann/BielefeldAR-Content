var allDrawables = [];
var allVisibleDrawables = [];
var editable = false;
var targetCollectionResource = new AR.TargetCollectionResource("assets/tracker.wtc");
var tracker = new AR.ImageTracker(targetCollectionResource);
var trackableBasis = new AR.ImageTrackable(tracker, "*", {
    onImageRecognized: function (name) {
        document.location = "architectsdk://modelontarget_" + name;
        for (var i = 0; i < allDrawables.length; i++) {
            if (allDrawables[i].trackable.targetName == name || allDrawables[i].trackable.targetName == "*") {
                allDrawables[i].onImageRecognized(name);
            }
        }
    },
    onImageLost: function (name) {
        document.location = "architectsdk://modelexittarget_" + name;
        for (var i = 0; i < allDrawables.length; i++) {
            if (allDrawables[i].trackable.targetName == name || allDrawables[i].trackable.targetName == "*") {
                allDrawables[i].onImageLost(name);
            }
        }
    }
});


class RTTrackable extends AR.Trackable2DObject {
    constructor(name){
        super(tracker, name, {
            onImageRecognized: function (name) {
            },
            onImageLost: function (name) {
            }
        });
    }
}

class RTMenuGroup {
    constructor(scaleX, scaleY, innerPaddingV, horizontal, anchorX, anchorY) {
        this.menuElements = [];
        this.innerPadding = innerPaddingV;
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.horizontal = horizontal;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
    
    addMenuElement(drawable){
        if (this.horizontal) {        
            if (this.menuElements.length > 0) {
                drawable.translate.x = this.menuElements[this.menuElements.length-1].translate.x + this.innerPadding;
                drawable.translate.y = this.menuElements[0].translate.y;

                drawable.scale.x = this.menuElements[0].scale.x;
                drawable.scale.y = this.menuElements[0].scale.y;
                
                drawable.previousDragValueX = drawable.translate.x;
                drawable.previousDragValueY = drawable.translate.y;

                this.menuElements.push(drawable);
            } else {
                drawable.translate.x = this.anchorX;
                drawable.translate.y = this.anchorY;
                
                drawable.scale.x = this.scaleX;
                drawable.scale.y = this.scaleY;

                drawable.previousDragValueX = drawable.translate.x;
                drawable.previousDragValueY = drawable.translate.y;

                this.menuElements.push(drawable);
            }
        } else {
            if (this.menuElements.length > 0) {
                drawable.translate.y = this.menuElements[this.menuElements.length-1].translate.y - this.innerPadding;
                drawable.translate.x = this.menuElements[0].translate.x;
                
                drawable.scale.x = this.menuElements[0].scale.x;
                drawable.scale.y = this.menuElements[0].scale.y;

                drawable.previousDragValueY = drawable.translate.y;
                drawable.previousDragValueX = drawable.translate.x;

                this.menuElements.push(drawable);
            } else {
                drawable.translate.x = this.anchorX;
                drawable.translate.y = this.anchorY;
                
                drawable.scale.x = this.scaleX;
                drawable.scale.y = this.scaleY;

                drawable.previousDragValueY = drawable.translate.y;
                drawable.previousDragValueX = drawable.translate.x;

                this.menuElements.push(drawable);
            }
        }
        
    }

}

class RTAnimation {
    constructor(animation, repeating) {
        this.animation = animation;
        this.repeating = repeating;
    }
}

class RTImage extends AR.ImageDrawable {

    constructor(path, scaleFactor, optionsJSON, trackablename) {
        var resource = new AR.ImageResource(path);
        var values = {
            translate: optionsJSON.translate,
            rotate: optionsJSON.rotate,
            scale: optionsJSON.scale,
            onDragBegan: function (x, y) {
                this.myOnDragBegan(x,y);
                return true;
            },
            onDragChanged: function (x, y) {
                this.myOnDragChanged(x,y);
                return true;
            },
            onDragEnded: function (x, y) {
                this.myOnDragEnded(x,y);
                return true;
            },
            onRotationBegan: function (angleInDegrees) {
                this.myOnRotationBegan(angleInDegrees);
                return true;
            },
            onRotationChanged: function (angleInDegrees) {
                this.myOnRotationChanged(angleInDegrees);
                return true;
            },
            onRotationEnded: function (angleInDegrees) {
                this.myOnRotationEnded(angleInDegrees);
                return true;
            },
            onScaleBegan: function (scale) {
                this.myOnScaleBegan(scale);
                return true;
            },
            onScaleChanged: function (scale) {
                this.myOnScaleChanged(scale);
                return true;
            },
            onScaleEnded: function (scale) {
                this.myOnScaleEnded(scale);
                return true;
            }
        };
        super(resource, scaleFactor, values);
        var dirs = path.split("/");
        var nameParts = dirs[dirs.length - 1].split(".png");
        this.name = nameParts[0];
        this.attachedDrawables = [];
        this.inverseDrawable = this;
        this.toggleTrue = true;
        this.onClickAnimations = [];
        this.onRecognitionAnimations = [];
        this.onAddToCamAnimations = [];
        this.onRemoveFromCamAnimations = [];
        allDrawables.push(this);
        this.playVideoOnClick = null;
        this.previousDragValueX = optionsJSON.translate.x;
        this.previousDragValueY = optionsJSON.translate.y;
        this.previousDragValueZ = optionsJSON.translate.z;
        this.previousRotationValueX = optionsJSON.rotate.x;
        this.previousRotationValueY = optionsJSON.rotate.y;
        this.previousRotationValueZ = optionsJSON.rotate.z;
        this.previousScaleValue = optionsJSON.scale.x;
        this.previousScaleValueX = optionsJSON.scale.x;
        this.previousScaleValueY = optionsJSON.scale.y;
        this.previousScaleValueZ = optionsJSON.scale.z;
        this.oneFingerGestureAllowed = false;
        this.positioningEnabled = true;
        this.scalingEnabled = true;
        this.rotatingEnabled = false;
        this.rotateAxisX = false;
        this.rotateAxisY = false;
        this.rotateAxisZ = true;
        this.positioningAxisX = true;
        this.positioningAxisY = true;
        this.positioningAxisZ = false;

        this.trackable = trackablename;
        this.onClick = function () {
            if (this.playVideoOnClick != null) {
                this.playVideoOnClick.play(0);
                this.removeFromCam();
            }
            this.onClickAdditions();
            this.onClickAnimation();
        }
    }

    onImageRecognized(targetName) {
        this.onRecognitionAnimation();
    }

    onImageLost(targetName) {
        this.onLostAnimation();
    }

    removeFromCam() {
        for (var i = 0; i < this.onRemoveFromCamAnimations.length; i++) {
            if (this.onRemoveFromCamAnimations[i].repeating) {
                this.onRemoveFromCamAnimations[i].animation.start(-1);
            } else {
                this.onRemoveFromCamAnimations[i].animation.start();
            }
        }
        allVisibleDrawables.splice(allVisibleDrawables.indexOf(this),1);
        this.trackable.drawables.removeCamDrawable(this);
    }

    addToCam() {
        allVisibleDrawables.push(this);
        this.trackable.drawables.addCamDrawable(this);
        for (var i = 0; i < this.onAddToCamAnimations.length; i++) {
            if (this.onAddToCamAnimations[i].repeating) {
                this.onAddToCamAnimations[i].animation.start(-1);
            } else {
                this.onAddToCamAnimations[i].animation.start();
            }
        }
    }

    onClickAdditions() {
       
      
         
        
    }

    onRecognitionAnimation() {
        for (var i = 0; i < this.onRecognitionAnimations.length; i++) {
            if (this.onRecognitionAnimations[i].repeating) {
                this.onRecognitionAnimations[i].animation.start(-1);
            } else {
                this.onRecognitionAnimations[i].animation.start();
            }
        }
    }

    onLostAnimation() {

    }

    onClickAnimation() {
        for (var i = 0; i < this.onClickAnimations.length; i++) {
            if (this.onClickAnimations[i].repeating) {
                this.onClickAnimations[i].animation.start(-1);
            } else {
                this.onClickAnimations[i].animation.start();
            }
        }
    }

    myOnDragBegan(x,y){
        return true;
    }
    myOnDragChanged(x,y){
        return true;
    }
    myOnDragEnded(x,y){
        return true;
    }
    myOnRotationBegan(angleInDegrees){
        return true;
    }
    myOnRotationChanged(angleInDegrees){
        return true;
    }
    myOnRotationEnded(angleInDegrees){
        return true;
    }
    myOnScaleBegan(scale){
        return true;
    }
    myOnScaleChanged(scale){
        return true;
    }
    myOnScaleEnded(scale){
        return true;
    }
}

class RTModel extends AR.Model {

    constructor(path, optionsJSON,trackablename) {
        var values = {
            translate: optionsJSON.translate,
            rotate: optionsJSON.rotate,
            scale: optionsJSON.scale,
            onDragBegan: function (x, y) {
                this.myOnDragBegan(x,y);
                return true;
            },
            onDragChanged: function (x, y) {
                this.myOnDragChanged(x,y);
                return true;
            },
            onDragEnded: function (x, y) {
                this.myOnDragEnded(x,y);
                return true;
            },
            onRotationBegan: function (angleInDegrees) {
                this.myOnRotationBegan(angleInDegrees);
                return true;
            },
            onRotationChanged: function (angleInDegrees) {
                this.myOnRotationChanged(angleInDegrees);
                return true;
            },
            onRotationEnded: function (angleInDegrees) {
                this.myOnRotationEnded(angleInDegrees);
                return true;
            },
            onScaleBegan: function (scale) {
                this.myOnScaleBegan(scale);
                return true;
            },
            onScaleChanged: function (scale) {
                this.myOnScaleChanged(scale);
                return true;
            },
            onScaleEnded: function (scale) {
                this.myOnScaleEnded(scale);
                return true;
            }
        };
        super(path, values);
        var dirs = path.split("/");
        var nameParts = dirs[dirs.length - 1].split(".wt3");
        this.name = nameParts[0];
        this.onClickAnimations = [];
        this.onRecognitionAnimations = [];
        this.onAddToCamAnimations = [];
        this.onRemoveFromCamAnimations = [];
        allDrawables.push(this);
        this.previousDragValueX = optionsJSON.translate.x;
        this.previousDragValueY = optionsJSON.translate.y;
        this.previousDragValueZ = optionsJSON.translate.z;
        this.previousRotationValueX = optionsJSON.rotate.x;
        this.previousRotationValueY = optionsJSON.rotate.y;
        this.previousRotationValueZ = optionsJSON.rotate.z;
        this.previousScaleValue = optionsJSON.scale.x;
        this.previousScaleValueX = optionsJSON.scale.x;
        this.previousScaleValueY = optionsJSON.scale.y;
        this.previousScaleValueZ = optionsJSON.scale.z;
        this.oneFingerGestureAllowed = false;
        this.positioningEnabled = true;
        this.scalingEnabled = true;
        this.rotatingEnabled = false;
        this.rotateAxisX = false;
        this.rotateAxisY = false;
        this.rotateAxisZ = true;
        this.positioningAxisX = true;
        this.positioningAxisY = true;
        this.positioningAxisZ = false;
        this.onClick = function () {
            this.onClickAnimation();
            this.onClickAdditions();
        }
        this.trackable = trackablename;
    }

    onImageRecognized(targetName) {
        this.onRecognitionAnimation();
    }

    onImageLost(targetName) {
        this.onLostAnimation();
    }


    removeFromCam() {
        for (var i = 0; i < this.onRemoveFromCamAnimations.length; i++) {
            if (this.onRemoveFromCamAnimations[i].repeating) {
                this.onRemoveFromCamAnimations[i].animation.start(-1);
            } else {
                this.onRemoveFromCamAnimations[i].animation.start();
            }
        }
        allVisibleDrawables.splice(allVisibleDrawables.indexOf(this),1);
        this.trackable.drawables.removeCamDrawable(this);
    }

    addToCam() {
        allVisibleDrawables.push(this);
        this.trackable.drawables.addCamDrawable(this);
        for (var i = 0; i < this.onAddToCamAnimations.length; i++) {
            if (this.onAddToCamAnimations[i].repeating) {
                this.onAddToCamAnimations[i].animation.start(-1);
            } else {
                this.onAddToCamAnimations[i].animation.start();
            }
        }
    }

    onRecognitionAnimation() {
        for (var i = 0; i < this.onRecognitionAnimations.length; i++) {
            if (this.onRecognitionAnimations[i].repeating) {
                this.onRecognitionAnimations[i].animation.start(-1);
            } else {
                this.onRecognitionAnimations[i].animation.start();
            }
        }
    }
    onClickAdditions() {
        

    }
    onLostAnimation() {

    }

    onClickAnimation() {
        for (var i = 0; i < this.onClickAnimations.length; i++) {
            if (this.onClickAnimations[i].repeating) {
                this.onClickAnimations[i].animation.start(-1);
            } else {
                this.onClickAnimations[i].animation.start();
            }
        }
    }

    myOnDragBegan(x,y){
        return true;
    }
    myOnDragChanged(x,y){
        return true;
    }
    myOnDragEnded(x,y){
        return true;
    }
    myOnRotationBegan(angleInDegrees){
        return true;
    }
    myOnRotationChanged(angleInDegrees){
        return true;
    }
    myOnRotationEnded(angleInDegrees){
        return true;
    }
    myOnScaleBegan(scale){
        return true;
    }
    myOnScaleChanged(scale){
        return true;
    }
    myOnScaleEnded(scale){
        return true;
    }

}

class RTVideo extends AR.VideoDrawable {
    constructor(path, scaleFactor, optionsJSON, replayDrawable = null, repeating = true, transparent = false, trackablename) {
        var values = {
            translate: optionsJSON.translate,
            rotate: optionsJSON.rotate,
            scale: optionsJSON.scale,
			isTransparent: transparent,
            onDragBegan: function (x, y) {
                this.myOnDragBegan(x,y);
                return true;
            },
            onDragChanged: function (x, y) {
                this.myOnDragChanged(x,y);
                return true;
            },
            onDragEnded: function (x, y) {
                this.myOnDragEnded(x,y);
                return true;
            },
            onRotationBegan: function (angleInDegrees) {
                this.myOnRotationBegan(angleInDegrees);
                return true;
            },
            onRotationChanged: function (angleInDegrees) {
                this.myOnRotationChanged(angleInDegrees);
                return true;
            },
            onRotationEnded: function (angleInDegrees) {
                this.myOnRotationEnded(angleInDegrees);
                return true;
            },
            onScaleBegan: function (scale) {
                this.myOnScaleBegan(scale);
                return true;
            },
            onScaleChanged: function (scale) {
                this.myOnScaleChanged(scale);
                return true;
            },
            onScaleEnded: function (scale) {
                this.myOnScaleEnded(scale);
                return true;
            }
        };

        super(path, scaleFactor, values);
        var dirs = path.split("/");
        var nameParts = dirs[dirs.length - 1].split(".mp4");
        this.name = nameParts[0];
        allDrawables.push(this);
        if (repeating) {
            this.play(-1);
        } else {
            this.play();
        }
        this.pause();
        this.visible = false;
        this.onClickAnimations = [];
        this.onRecognitionAnimations = [];
        this.onAddToCamAnimations = [];
        this.onRemoveFromCamAnimations = [];
        this.previousDragValueX = optionsJSON.translate.x;
        this.previousDragValueY = optionsJSON.translate.y;
        this.previousDragValueZ = optionsJSON.translate.z;
        this.previousRotationValueX = optionsJSON.rotate.x;
        this.previousRotationValueY = optionsJSON.rotate.y;
        this.previousRotationValueZ = optionsJSON.rotate.z;
        this.previousScaleValue = optionsJSON.scale.x;
        this.oneFingerGestureAllowed = false;
        this.positioningEnabled = true;
        this.scalingEnabled = true;
        this.rotatingEnabled = false;
        this.rotateAxisX = false;
        this.rotateAxisY = false;
        this.rotateAxisZ = true;
        this.positioningAxisX = true;
        this.positioningAxisY = true;
        this.positioningAxisZ = false;
        if (replayDrawable != null) {
            replayDrawable.playVideoOnClick = this;
            this.onFinishedPlaying = function () {
                replayDrawable.addToCam();
            }
        }
        this.onClick = function () {
            this.onClickAnimation();
            this.onClickAdditions();
        }
        this.trackable = trackablename;
    }

    onImageRecognized(targetName) {
        //if (trackableBasis.drawables.cam.indexOf(this) > -1) {
        this.resume();
        //}
        this.onRecognitionAnimation();
    }

    onImageLost(targetName) {
        this.pause();
        this.onLostAnimation();
    }
    onClickAdditions() {

    }
    removeFromCam() {
        this.pause();
        for (var i = 0; i < this.onRemoveFromCamAnimations.length; i++) {
            if (this.onRemoveFromCamAnimations[i].repeating) {
                this.onRemoveFromCamAnimations[i].animation.start(-1);
            } else {
                this.onRemoveFromCamAnimations[i].animation.start();
            }
        }
        allVisibleDrawables.splice(allVisibleDrawables.indexOf(this),1);
        this.trackable.drawables.removeCamDrawable(this);
    }

    addToCam() {
        allVisibleDrawables.push(this);
        //this.resume();
        this.trackable.drawables.addCamDrawable(this);
        for (var i = 0; i < this.onAddToCamAnimations.length; i++) {
            if (this.onAddToCamAnimations[i].repeating) {
                this.onAddToCamAnimations[i].animation.start(-1);
            } else {
                this.onAddToCamAnimations[i].animation.start();
            }
        }
    }

    onRecognitionAnimation() {
        for (var i = 0; i < this.onRecognitionAnimations.length; i++) {
            if (this.onRecognitionAnimations[i].repeating) {
                this.onRecognitionAnimations[i].animation.start(-1);
            } else {
                this.onRecognitionAnimations[i].animation.start();
            }
        }
    }

    onLostAnimation() {
    }

    onClickAnimation() {
        for (var i = 0; i < this.onClickAnimations.length; i++) {
            if (this.onClickAnimations[i].repeating) {
                this.onClickAnimations[i].animation.start(-1);
            } else {
                this.onClickAnimations[i].animation.start();
            }
        }
    }

    myOnDragBegan(x,y){
        return true;
    }
    myOnDragChanged(x,y){
        return true;
    }
    myOnDragEnded(x,y){
        return true;
    }
    myOnRotationBegan(angleInDegrees){
        return true;
    }
    myOnRotationChanged(angleInDegrees){
        return true;
    }
    myOnRotationEnded(angleInDegrees){
        return true;
    }
    myOnScaleBegan(scale){
        return true;
    }
    myOnScaleChanged(scale){
        return true;
    }
    myOnScaleEnded(scale){
        return true;
    }
}


function createAppLink(drawable, url) {
    drawable.onClickAdditions = function () {        
        if (isAndroid()) {
				document.location = "architectsdk://url_https://www." + url;
        } else {
				window.location.href = "https://" + url;
        }    
    }
}


function createWebLink(drawable, url) {
    drawable.onClickAdditions = function () {
        document.location = "architectsdk://url_" + url;
    }
}

function createSwapBuild(drawable, buildID, isPrivate, password) {
    if (isPrivate) {
        drawable.onClickAdditions = function () {
            document.location = "architectsdk://swapToPrivate_" + buildID + "_" + password;
        }
    } else {
        drawable.onClickAdditions = function () {
            document.location = "architectsdk://swapTo_" + buildID;
        }

    }
}

function createFullscreen(drawable, offlinevideopath) {
    drawable.onClickAdditions = function () {
        document.location = "architectsdk://fullscreen_" + offlinevideopath;
    }
}

function createPanoImage(drawable, offlinepanopath, onlinepanopath) {
    drawable.onClickAdditions = function () {
        if (isAndroid()) {
            document.location = "architectsdk://PanoImage_" + offlinepanopath;
        } else {
            document.location = "architectsdk://url_http://apps.neulandserver.de/onlineAssets/" + onlinepanopath;
        }
    }
}

function create3DBounceAnim(drawable, length) {

    var sx = new AR.PropertyAnimation(drawable, "scale.x", 0, drawable.scale.x, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
    });
    var sy = new AR.PropertyAnimation(drawable, "scale.y", 0, drawable.scale.y, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
    });
    var sz = new AR.PropertyAnimation(drawable, "scale.z", 0, drawable.scale.z, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
    });

    return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [sx, sy, sz]);
}

function create2DBounceAnim(drawable, length) {

    var sx = new AR.PropertyAnimation(drawable, "height", 0.75, drawable.height, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
    });

    return sx;
}

function create2DEaseInOutAnim(drawable, length,startingPoint) {

    var sx = new AR.PropertyAnimation(drawable, "height",startingPoint, drawable.height, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_IN_OUT_CIRC,
        overshoot: 1.0
    });

    return sx;
}

function createOpacityUpAnim(drawable,length){
    return new AR.PropertyAnimation(drawable, "opacity", 0, 1, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_CUBIC
    });
}

function createOpacityDownAnim(drawable,length){
    return new AR.PropertyAnimation(drawable, "opacity", 1, 0, length, {
        type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_CUBIC
    });
}

/*
function createSequentialAppearAnim (drawables, length) {
    
    var drawableVar = [];
    
    for (var i = 0; i < drawables.length; i++) {
        var drawableVar[i] = new AR.PropertyAnimation(drawables[i], "height", 0, drawables[i].height, length);  
    }
    
    //var drawable11 = new AR.PropertyAnimation(drawables[i], "height", 0, drawables[i].height, length);
    //var drawable22 = new AR.PropertyAnimation(drawables[1], "height", 0, drawables[1].height, length);    
    
    return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.SEQUENTIAL, [drawableVar[0], drawableVar[1]]);
}
*/

function createToggle(drawableOn, drawableOff, attachedDrawablesOn, attachedDrawablesOff, initialOn) {
    drawableOn.inverseDrawable = drawableOff;
    drawableOn.attachedDrawables = attachedDrawablesOn;
    drawableOff.inverseDrawable = drawableOn;
    drawableOff.attachedDrawables = attachedDrawablesOff;
    drawableOn.toggleTrue = initialOn;
    drawableOff.toggleTrue = !initialOn;
    if (initialOn) {
        if (attachedDrawablesOn.length > 0) {
            attachedDrawablesOn.addToCam();
        }
        if (attachedDrawablesOn.length > 0) {
            for (var i = 0; i < attachedDrawablesOn.length; i++) {
                if (attachedDrawablesOn[i].trackable.drawables.cam.indexOf(attachedDrawablesOn[i]) === -1) {
                    attachedDrawablesOn[i].addToCam();
                }
            }
        }
        drawableOn.addToCam();
    } else {
        if (attachedDrawablesOff.length > 0) {
            for (var i = 0; i < attachedDrawablesOff.length; i++) {
                if (attachedDrawablesOff[i].trackable.drawables.cam.indexOf(attachedDrawablesOff[i]) === -1) {
                    attachedDrawablesOff[i].addToCam();
                }
            }
        }
        drawableOff.addToCam();
    }

    drawableOn.onClickAdditions = function () {
        if (this.toggleTrue) {
            this.toggleTrue = false;
            this.inverseDrawable.toggleTrue = true;
            if (this.attachedDrawables.length > 0) {
                for (var i = 0; i < this.attachedDrawables.length; i++) {
                    this.attachedDrawables[i].removeFromCam();
                }
            }
            if (this.inverseDrawable.attachedDrawables.length > 0) {
                for (var i = 0; i < this.inverseDrawable.attachedDrawables.length; i++) {
                    if (this.inverseDrawable.attachedDrawables[i].trackable.drawables.cam.indexOf(this.inverseDrawable.attachedDrawables[i]) === -1) {
                        this.inverseDrawable.attachedDrawables[i].addToCam();
                    }

                }
            }

            this.removeFromCam();
            this.inverseDrawable.addToCam();
        }
    };

    drawableOff.onClickAdditions = function () {
        if (this.toggleTrue) {
            this.toggleTrue = false;
            this.inverseDrawable.toggleTrue = true;
            if (this.attachedDrawables.length > 0) {
                for (var i = 0; i < this.attachedDrawables.length; i++) {
                    this.attachedDrawables[i].removeFromCam();
                }
            }
            if (this.inverseDrawable.attachedDrawables.length > 0) {
                for (var i = 0; i < this.inverseDrawable.attachedDrawables.length; i++) {
                    if (this.inverseDrawable.attachedDrawables[i].trackable.drawables.cam.indexOf(this.inverseDrawable.attachedDrawables[i]) === -1) {
                        this.inverseDrawable.attachedDrawables[i].addToCam();
                    }
                }
            }
            this.removeFromCam();
            this.inverseDrawable.addToCam();
        }
    }
}

function isAndroid() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
        return true;
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return false;
    }
    return true;
}

function callAppInterface() {
    document.location = "architectsdk://barcode_123"
}

function writeOptionsToJSON() {
    var allOptions = "{\"data\":[";
    for (var i = 0; i < allDrawables.length; i++) {
        if (allOptions.length>10){
            allOptions += ",";
        }
        allOptions += "{\"name\":"+JSON.stringify(allDrawables[i].name)+"," +
            "\"scale\":"+JSON.stringify(allDrawables[i].scale)+"," +
            "\"translate\":"+JSON.stringify(allDrawables[i].translate)+"," +
            "\"rotate\":"+JSON.stringify(allDrawables[i].rotate)+"}";
    }
    allOptions+="]}";

    var json = JSON.stringify(allOptions);
    alert(json);
    AR.platform.sendJSONObject(JSON.parse(allOptions));
}

function makeEditable(drawable) {
    drawable.myOnDragBegan= function (x, y) {
        this.oneFingerGestureAllowed = true;
        return true;
    };
    drawable.myOnDragChanged= function (x, y) {
        if (this.oneFingerGestureAllowed && this.positioningEnabled) {
            if (this.positioningAxisX && this.positioningAxisY) {
                this.translate.x = this.previousDragValueX + x;
                this.translate.y = this.previousDragValueY - y;
            } else if (this.positioningAxisX && this.positioningAxisZ) {
                this.translate.x = this.previousDragValueX + x;
                this.translate.z = this.previousDragValueZ + y;
            }
            else if (this.positioningAxisY && this.positioningAxisZ) {
                this.translate.y = this.previousDragValueY - x;
                this.translate.z = this.previousDragValueZ + y;
            }
        }

        return true;
    };
    drawable.myOnDragEnded= function (x, y) {
        this.previousDragValueX = this.translate.x;
        this.previousDragValueY = this.translate.y;
        this.previousDragValueZ = this.translate.z;

        return true;
    };
    drawable.myOnRotationBegan= function (angleInDegrees) {
        return true;
    };
    drawable.myOnRotationChanged= function (angleInDegrees) {
        if (this.rotatingEnabled) {
            if (this.rotateAxisX) {
                this.rotate.x = this.previousRotationValueX - angleInDegrees;
            } else if (this.rotateAxisY) {
                this.rotate.y = this.previousRotationValueY - angleInDegrees;
            } else if (this.rotateAxisZ) {
                this.rotate.z = this.previousRotationValueZ - angleInDegrees;
            }
        }
        return true;
    };
    drawable.myOnRotationEnded= function (angleInDegrees) {
        this.previousRotationValueX = this.rotate.x;
        this.previousRotationValueY = this.rotate.y;
        this.previousRotationValueZ = this.rotate.z;

        return true;
    };
    drawable.myOnScaleBegan= function (scale) {
        return true;
    };
    drawable.myOnScaleChanged= function (scale) {
        if (this.scalingEnabled) {
            var scaleValue = this.previousScaleValue * scale;
            this.scale = {x: scaleValue, y: scaleValue, z: scaleValue};
        }
        return true;
    };
    drawable.myOnScaleEnded= function (scale) {
        this.previousScaleValue = this.scale.x;

        return true;
    }
}
