var World = {

	init : function initFn() {
		this.createOverlays();
	},

	createOverlays : function createOverlaysFn() {

		this.tracker = new AR.ClientTracker("assets/tracker.wtc");
		var trackableBasis = new AR.Trackable2DObject(this.tracker, "*", {
				onEnterFieldOfVision : function (name) {
					//document.location = "architectsdk://modelontarget_"+name;
					document.location = "architectsdk://" + name;
				},
				onExitFieldOfVision : function () {
					document.location = "architectsdk://exit";
					//document.location = "architectsdk://modelexittarget_"+name;
				}
			});


		var videoInfotext = new AR.VideoDrawable("assets/Dialog_wiki.mp4", 0.94, {
			offsetX: 0,
			offsetY: -0.95,
			isTransparent: true
		});

		videoInfotext.play(-1);
		videoInfotext.pause();

		this.trackableInfotext = new AR.Trackable2DObject(this.tracker, "marker1", {
			drawables: {
				cam: [videoInfotext]
			},
			onEnterFieldOfVision: function onEnterFieldOfVisionFn() {
				videoInfotext.resume();
			},
			onExitFieldOfVision: function onExitFieldOfVisionFn() {
				videoInfotext.pause();
			}
		});
		this.trackableInfotext.enabled=false;
	},

	switchContentToInfo: function switchContentToInfoFn(){
			World.trackableInfotext.enabled = true;
	},

	switchContentToAR: function switchContentToARFn(){
			World.trackableInfotext.enabled = false;
	},
	turnEverythingOff: function turnEverythingOffFn(){
    		World.trackableSoldaten.enabled = false;
    }
};

World.init();
