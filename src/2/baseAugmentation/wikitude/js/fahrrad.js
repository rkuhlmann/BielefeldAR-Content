var World = {
	initiallyLoadedData: false,

	// POI-Marker asset
	markerDrawable_idle: null,

    markerList: [],

	counter: 0,
	loaded: false,
	rotating: false,
	trackableVisible: false,

	init: function initFn() {
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		
		this.tracker = new AR.ClientTracker("assets/tracker.wtc", {
		});

	    var trackableBasis9 = new AR.Trackable2DObject(this.tracker, "*", {
        	onEnterFieldOfVision: function (name) {
        		document.location = "architectsdk://modelontarget_"+name;
        	},
        	onExitFieldOfVision: function (name) {
        		document.location = "architectsdk://modelexittarget_"+name;
        	}
        });

	    var rauthausVid = new AR.VideoDrawable("assets/rathaus.mp4", 1, {
        	offsetX: 0,
        	offsetY: -0.68,
        	isTransparent: true,
        	onFinishedPlaying: function() {
                document.location = "architectsdk://videofinished_rathausVid";
            },
            onPlaybackStarted: function () {
                document.location = "architectsdk://videostarted_rathausVid";
            }
        });

        rauthausVid.play(1);
        rauthausVid.pause();

        var rathaus = new AR.Trackable2DObject(this.tracker, "marker12", {
        	drawables: {
        		cam: [rauthausVid]
        	},
        	onEnterFieldOfVision: function() {
        		rauthausVid.resume();
        	},
        	onExitFieldOfVision: function() {
        		rauthausVid.pause();
        	}
        });

		this.modelFahrrad = new AR.Model("assets/fahrrad.wt3", {
			scale: {
				x: 0.05,
				y: 0.05,
				z: 0.05
			},
			translate: {
				x: -2.0,
				y: -1,
				z: 0.0
			},
			rotate:{
				roll: 0, 
				tilt: -90, 
				head: 0
			}
		});

		this.animFahrrad = new AR.ModelAnimation(World.modelFahrrad, "Fahrrad_animation");

		
		this.appearingAnimation = this.createAppearingAnimation(this.modelFahrrad, 10);

		
		var trackableFahrrad = new AR.Trackable2DObject(this.tracker, "marker9", {
			drawables: {
				cam: [this.modelFahrrad]
			},
			onEnterFieldOfVision: this.appearFahrrad,
			onExitFieldOfVision: this.disappearFahrrad
		});

		var video = new AR.VideoDrawable("assets/schulordnung.mp4", 0.77, {
			offsetX: -0.25,
			offsetY: -0.24,
			isTransparent: true
		});

		video.play(1);
		video.pause();


		var pageOne = new AR.Trackable2DObject(this.tracker, "marker5", {
			drawables: {
				cam: [video]
			},
			onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
				video.resume();
			},
			onExitFieldOfVision: function onExitFieldOfVisionFn() {
				video.pause();
			}
		});
		var videoGoldschatz = new AR.VideoDrawable("assets/goldschatz.mp4", 1.2, {
			offsetX: 0,
			offsetY: -0.7,
			isTransparent: true
		});

		videoGoldschatz.play(1);
		videoGoldschatz.pause();

		var trackableGoldschatz = new AR.Trackable2DObject(this.tracker, "marker10", {
			drawables: {
				cam: [videoGoldschatz]
			},
			onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
				videoGoldschatz.resume();
			},
			onExitFieldOfVision: function onExitFieldOfVisionFn() {
				videoGoldschatz.pause();
			}
		});

	},
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

    		/*
    			The example Image Recognition already explained how images are loaded and displayed in the augmented reality view. This sample loads an AR.ImageResource when the World variable was defined. It will be reused for each marker that we will create afterwards.
    		*/
    		World.markerDrawable_idle = new AR.ImageResource("assets/standpunkt.png");

    		/*
    			Since there are additional changes concerning the marker it makes sense to extract the code to a separate Marker class (see marker.js). Parts of the code are moved from loadPoisFromJsonData to the Marker-class: the creation of the AR.GeoLocation, the creation of the AR.ImageDrawable and the creation of the AR.GeoObject. Then instantiate the Marker in the function loadPoisFromJsonData:
    		*/
    		var marker = new Marker(poiData);

            World.markerList[World.counter] = marker;

    },
	createAppearingAnimation: function createAppearingAnimationFn(model, scale) {

		var tx = new AR.PropertyAnimation(model, "translate.x", -2, scale, 15000, {
			type: AR.CONST.EASING_CURVE_TYPE.LINEAR
		});
	

		return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [tx]);
	},

	appearFahrrad: function appearFahrradFn() {
		var soundKlingel = new AR.Sound("assets/klingel.mp3");
					soundKlingel.play(1);
		World.animFahrrad.start(-1);
		World.trackableVisible = true;
		World.appearingAnimation.start();
	},
	disappearFahrrad: function disappearFahrradFn() {
		World.trackableVisible = false;
	}
};


function myTest(id, lat, lon, title){
    //alert("Hello Test World: Latitude"+lat+"Longitude"+lon);
    if(id<World.counter){
        World.markerList[id].markerObject.enabled = true;
    }else{
        var poiData = {
            "id": (id),
    	    "longitude": (lon),//(lon + (Math.random() / 5 - 0.1)),
    	    "latitude": (lat),//(lat + (Math.random() / 5 - 0.1)),
    	    "altitude": 100.0,
        	"description": "This is the description of POI#1",
    	    "title": title

        };


        World.loadPoisFromJsonData(poiData);
        World.initiallyLoadedData = true;
        World.counter++;
    }
};

function endGeo(){
    for(var i = 0; i < World.markerList.length; i++){
           World.markerList[i].markerObject.enabled = false;
      }

};


World.init();
